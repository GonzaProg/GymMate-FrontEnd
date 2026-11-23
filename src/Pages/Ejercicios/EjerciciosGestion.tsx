import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { useEjerciciosGestion } from '../../Hooks/Ejercicios/useEjerciciosGestion';
import { AppStyles } from '../../Styles/AppStyles';
import { VideoEjercicio } from '../../Components/VideoEjercicios/VideoEjercicio';
import { useAuthUser } from '../../Hooks/Auth/useAuthUser';
import { TIPOS_AGARRE, MUSCULOS_PERMITIDOS } from '../../API/Ejercicios/EjerciciosApi';
import { ChevronDown, Play, Dumbbell, Edit2, Trash2, Image as ImageIcon, Video, Hourglass, Save, X } from 'lucide-react';
import { MuscleFilter } from '../../Components/MuscleFilter/MuscleFilter';
import { CloudinaryApi } from '../../Helpers/Cloudinary/Cloudinary';

interface Props {
    onNavigate?: (tab: string) => void;
}

export const EjerciciosGestion = ({ onNavigate }: Props) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
    const [filterNoMedia, setFilterNoMedia] = useState(false);
    
    const { 
        ejercicios, loading, uploading, editingId, editForm, 
        selectedVideo, selectedImage,
        videoUrl, imageUrl, 
        handleDelete, startEdit, cancelEdit, saveEdit, 
        handleEditInputChange, handleVideoChange, handleImageChange,
        setVideoUrl, setImageUrl
    } = useEjerciciosGestion();

    const { isAdmin } = useAuthUser();

    const filteredEjercicios = useMemo(() => {
        let result = ejercicios;
        if (selectedMuscle) {
            result = result.filter(e => e.musculoTrabajado === selectedMuscle);
        }
        const q = searchTerm.trim().toLowerCase();
        if (q) {
            result = result.filter((e) => {
                if (editingId != null && e.id === editingId) return true;
                return e.nombre.toLowerCase().includes(q);
            });
        }
        if (isAdmin && filterNoMedia) {
            result = result.filter(e => !e.imagenUrl && !e.urlVideo);
        }
        return result;
    }, [ejercicios, searchTerm, editingId, selectedMuscle, filterNoMedia, isAdmin]);

    const handleNewExercise = () => {
        if (onNavigate) {
            onNavigate('Crear Ejercicio');
        } else {
            navigate('/ejercicios/crear');
        }
    };

    return (
        <div className={AppStyles.principalContainer}>
            <div className="w-full max-w-7xl mx-auto space-y-6"> 
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
                        <div className="w-full sm:max-w-xs">
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar ejercicio..."
                                className={`${AppStyles.inputDark} h-10 text-sm bg-gray-900/60`}
                            />
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => setFilterNoMedia(!filterNoMedia)}
                                className={`h-10 px-4 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                                    filterNoMedia
                                        ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-md shadow-red-950/20"
                                        : "bg-gray-900/60 text-gray-400 border-white/10 hover:bg-gray-800 hover:text-white"
                                }`}
                                title="Filtrar ejercicios sin imagen ni video"
                            >
                                Ejercicios Sin Multimedia
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={handleNewExercise} 
                        className={`${AppStyles.btnPrimary} flex items-center gap-2 px-6 flex-none w-auto`}
                    >
                        <span>+</span> Nuevo Ejercicio
                    </button>
                </div>

                <div className="bg-gray-900/40 rounded-xl border border-white/5 mb-4 px-2">
                    <MuscleFilter selectedMuscle={selectedMuscle} onSelectMuscle={setSelectedMuscle} />
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {loading ? (
                        <p className="col-span-full py-8 text-center text-gray-400 italic font-bold">Cargando...</p>
                    ) : filteredEjercicios.length > 0 ? filteredEjercicios.map((ej) => {
                        const thumbUrl = CloudinaryApi.getThumbnail(ej.imagenUrl, ej.urlVideo);
                        return (
                            <div 
                                key={ej.id} 
                                className="relative group rounded-xl overflow-hidden border border-white/10 hover:border-green-500/60 transition-all aspect-square bg-gray-900 shadow-xl cursor-default"
                            >
                                <div className="absolute inset-0 z-0 bg-black" onClick={(e) => { e.stopPropagation(); if (ej.urlVideo) setVideoUrl(ej.urlVideo); }}>
                                    {thumbUrl ? (
                                        <img src={thumbUrl} alt={ej.nombre} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity cursor-pointer" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-500 bg-gray-800/50 cursor-pointer">
                                            <Dumbbell className="w-10 h-10 opacity-50 text-white" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Modal de Imagen Preview */}
                                 <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                                    <p className="text-white text-sm font-bold leading-tight drop-shadow-md text-center mb-2">{ej.nombre}</p>
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {ej.musculoTrabajado && (
                                            <span className={AppStyles.tagMuscle}>
                                                {ej.musculoTrabajado}
                                            </span>
                                        )}
                                        {ej.tipoAgarre && (
                                            <span className={AppStyles.tagGrip}>
                                                Agarre {ej.tipoAgarre}
                                            </span>
                                        )}
                                        {ej.elementosGym && (
                                            <span className={AppStyles.tagElements}>
                                                {ej.elementosGym}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Play Button Centrado */}
                                {ej.urlVideo && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setVideoUrl(ej.urlVideo!); }} 
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-green-400 shadow-lg z-20"
                                    >
                                        <Play size={20} className="fill-white text-white ml-1" />
                                    </button>
                                )}

                                {/* Botones de Edición / Eliminar abajo */}
                                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2 z-20">
                                    <button onClick={(e) => { e.stopPropagation(); startEdit(ej); }} className={AppStyles.btnEdit} title="Editar"><Edit2 className="w-4 h-4" /></button>
                                    {isAdmin && (
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(ej.id); }} className={AppStyles.btnDelete} title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="col-span-full py-8 text-center text-gray-400 italic">No se encontraron ejercicios</p>
                    )}
                </div>
            </div>

            {/* MODALES */}
            {/* Modal de Edición */}
             {editingId && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 overflow-y-auto" onClick={cancelEdit}>
                    <div className={`${AppStyles.glassCard} max-w-2xl w-full p-6 animate-fade-in my-8 relative`} onClick={e => e.stopPropagation()}>
                        <h3 className={`${AppStyles.sectionTitle} flex items-center gap-2`}><Edit2 className="w-5 h-5 text-purple-400" /> Editar Ejercicio</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={AppStyles.label}>Nombre</label>
                                <input 
                                    className={AppStyles.inputDark} 
                                    value={editForm.nombre} 
                                    onChange={(e) => handleEditInputChange('nombre', e.target.value)} 
                                    autoFocus 
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={AppStyles.label}>Músculo Trabajado</label>
                                    <div className="relative group">
                                        <select 
                                            className={`${AppStyles.inputDark} appearance-none cursor-pointer pr-10`} 
                                            value={editForm.musculoTrabajado} 
                                            onChange={(e) => handleEditInputChange('musculoTrabajado', e.target.value)}
                                        >
                                            <option value="" className={AppStyles.darkBackgroundSelect} disabled>Seleccione un músculo</option>
                                            {MUSCULOS_PERMITIDOS.map(m => (
                                                <option key={m} value={m} className={AppStyles.darkBackgroundSelect}>{m}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 group-hover:text-purple-400 transition-colors">
                                            <ChevronDown className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={AppStyles.label}>Elementos</label>
                                    <input 
                                        className={AppStyles.inputDark} 
                                        value={editForm.elementosGym} 
                                        placeholder="Ej: Barra/Mancuernas/Máquina/etc."
                                        onChange={(e) => handleEditInputChange('elementosGym', e.target.value)} 
                                    />
                                </div>
                                
                                <div className="col-span-1 md:col-span-2">
                                    <label className={AppStyles.label}>Tipo de Agarre</label>
                                    <div className="relative group">
                                        <select 
                                            className={`${AppStyles.inputDark} appearance-none cursor-pointer pr-10`} 
                                            value={editForm.tipoAgarre} 
                                            onChange={(e) => handleEditInputChange('tipoAgarre', e.target.value)}
                                        >
                                            <option value="" className={AppStyles.darkBackgroundSelect}>Ninguno</option>
                                            {TIPOS_AGARRE.map(agarre => (
                                                <option key={agarre} value={agarre} className={AppStyles.darkBackgroundSelect}>{agarre}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 group-hover:text-purple-400 transition-colors">
                                            <ChevronDown className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className={AppStyles.label}>Detalles</label>
                                <textarea 
                                    className={`${AppStyles.inputDark} min-h-[80px] resize-y`} 
                                    value={editForm.detalles} 
                                    placeholder="Anotaciones extra sobre la técnica o cuidados especiales..."
                                    onChange={(e) => handleEditInputChange('detalles', e.target.value)} 
                                />
                            </div>

                            {/* Media (Solo admin) */}
                            {isAdmin && (
                                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                    <div>
                                        <label className={AppStyles.label}>Imagen</label>
                                        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-sm py-2 px-4 rounded-lg flex justify-center items-center gap-2 shadow-lg transition-colors">
                                            <span>{selectedImage ? <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Seleccionada</span> : <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-purple-400" /> Subir Imagen</span>}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label className={AppStyles.label}>Video</label>
                                        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-sm py-2 px-4 rounded-lg flex justify-center items-center gap-2 shadow-lg transition-colors">
                                            <span>{selectedVideo ? <span className="flex items-center gap-2"><Video className="w-4 h-4" /> Seleccionado</span> : <span className="flex items-center gap-2"><Video className="w-4 h-4 text-green-400" /> Subir Video</span>}</span>
                                            <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-4 pt-4 mt-6 border-t border-white/10">
                                <button onClick={cancelEdit} disabled={uploading} className={`${AppStyles.btnSecondary} flex-1`}>
                                    Cancelar
                                </button>
                                <button onClick={() => saveEdit(editingId)} disabled={uploading} className={`${AppStyles.btnPrimary} flex-[2] flex justify-center items-center gap-2`}>
                                    {uploading ? <span className="flex items-center gap-2"><Hourglass className="w-4 h-4" /> Guardando...</span> : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Guardar</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {videoUrl && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 pt-safe pb-safe">
                    <button onClick={() => setVideoUrl(null)} className="absolute top-safe-offset right-safe-offset z-[10000] p-2 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors border border-white/20 w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-md touch-manipulation">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-white/20">
                        <VideoEjercicio url={videoUrl} controls={true} muted={true} />
                    </div>
                </div>,
                document.body
            )}
            {imageUrl && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out" onClick={() => setImageUrl(null)}>
                    <img src={imageUrl} alt="Ejercicio" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10" />
                </div>,
                document.body
            )}
        </div>
    );
};