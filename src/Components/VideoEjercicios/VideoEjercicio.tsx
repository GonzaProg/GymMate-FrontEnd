import { useRef, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Maximize, Minimize } from 'lucide-react';

interface VideoProps {
  url: string;
  fallbackUrl?: string; // URL de la nube para fallback
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Intentar leer un archivo de Capacitor Filesystem y devolver un blob URL
const readLocalFile = async (path: string): Promise<string | null> => {
  try {
    const file = await Filesystem.readFile({
      path: path,
      directory: Directory.Data
    });
    const blob = b64toBlob(file.data as string, 'video/mp4');
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

export const VideoEjercicio = ({ url, fallbackUrl, controls = false, muted = true, loop = true }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    const loadVideo = async () => {
      if (!url) return;

      // === NATIVO (Android/iOS) ===
      if (Capacitor.isNativePlatform()) {
        // Si ya es una URL de la nube, no hacemos nada
        if (url.startsWith('http')) {
          if (isMounted) setVideoSrc(url);
          return;
        }

        // Si es un archivo local (sea path completo o solo fileName)
        try {
          const fileName = url.split('/').pop() || url;
          const result = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Data
          });
          if (isMounted) setVideoSrc(Capacitor.convertFileSrc(result.uri));
        } catch (e) {
          console.error("Error obteniendo URI nativa del video:", e);
          if (fallbackUrl && isMounted) setVideoSrc(fallbackUrl);
        }
        return;
      }

      // === WEB ===
      // Si es una URL directa (http, data, blob), usarla directamente
      if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        if (isMounted) setVideoSrc(url);
        return;
      }

      // Si NO es URL directa, es un archivo local guardado en IndexedDB

      // 1. Intentar con el path tal cual (para formato fileName directo: "vid_123_456.mp4")
      let blobUrl = await readLocalFile(url);
      if (blobUrl) {
        objectUrl = blobUrl;
        if (isMounted) setVideoSrc(blobUrl);
        return;
      }

      // 2. Intentar extrayendo solo el fileName del path
      const fileName = url.split('/').pop();
      if (fileName && fileName !== url) {
        blobUrl = await readLocalFile(fileName);
        if (blobUrl) {
          objectUrl = blobUrl;
          if (isMounted) setVideoSrc(blobUrl);
          return;
        }
      }

      // 3. Fallback: usar la URL de la nube si se proporcionó
      if (fallbackUrl) {
        console.warn("⚠️ Video offline no encontrado, usando nube:", fallbackUrl);
        if (isMounted) setVideoSrc(fallbackUrl);
        return;
      }

      // 4. Último recurso
      if (isMounted) setVideoSrc(url);
    };

    loadVideo();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, fallbackUrl]);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
        videoRef.current.load(); 
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.log("Autoplay bloqueado (interacción requerida):", err);
            });
        }
    }
  }, [videoSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const lastTapRef = useRef<number>(0);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isRightHalf = x > rect.width / 2;
      
      if (videoRef.current) {
        if (isRightHalf) {
          videoRef.current.currentTime += 5;
        } else {
          videoRef.current.currentTime -= 5;
        }
      }
      lastTapRef.current = 0;
    } else {
      // Single tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          togglePlay();
          lastTapRef.current = 0;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative flex items-center justify-center">
      <style>
        {`
          .hide-video-volume::-webkit-media-controls-mute-button,
          .hide-video-volume::-webkit-media-controls-volume-slider,
          .hide-video-volume::-webkit-media-controls-overlay-play-button,
          .hide-video-volume::-webkit-media-controls-start-playback-button {
            display: none !important;
          }
        `}
      </style>
      {videoSrc && (
          <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain hide-video-volume" 
                autoPlay
                loop={loop}
                muted={muted}
                playsInline
                controls={controls}
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                style={{ pointerEvents: controls ? 'auto' : 'none' }}
              />
              {controls && (
                  <>
                      <div 
                          className="absolute inset-0 bottom-16 z-10 cursor-pointer touch-manipulation" 
                          onClick={handleOverlayClick}
                      />
                      <button 
                          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                          className={`absolute ${isFullscreen ? 'top-safe-offset left-safe-offset' : 'top-4 left-4'} z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10 flex items-center justify-center`}
                          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                      >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </button>
                  </>
              )}
          </>
      )}
    </div>
  );
};