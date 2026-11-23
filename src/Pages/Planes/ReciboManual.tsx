import { useState } from "react";
import { AppStyles } from "../../Styles/AppStyles";
import { useManualReceipt } from "../../Hooks/Planes/useReciboManual";
import { Card } from "../../Components/UI/Card";
import { Search, FileText, AlertTriangle, Send, Receipt, X, Download } from "lucide-react";

export const ManualReceipt = () => {
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const {
        alumnoSeleccionado,
        sugerencias,
        busqueda,
        handleSearchChange,
        handleSelectAlumno,
        clearSelection,
        enviarRecibo,
        sending,
        ultimoComprobanteUrl,
        loadingComprobante
    } = useManualReceipt();

    // Verificamos si tiene AL MENOS UNA suscripción activa
    const tienePlanesActivos = alumnoSeleccionado?.userPlans?.some((p: any) => p.activo);

    return (
        <div className={AppStyles.principalContainer}>
            {/* Modal de Comprobante */}
            {showReceiptModal && ultimoComprobanteUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 pt-safe pb-safe" onClick={() => setShowReceiptModal(false)}>
                    <div className="absolute top-safe-offset right-safe-offset flex items-center gap-3 z-[60]" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const downloadUrl = ultimoComprobanteUrl.includes('/upload/') 
                                        ? ultimoComprobanteUrl.replace('/upload/', '/upload/fl_attachment/')
                                        : ultimoComprobanteUrl;
                                    const response = await fetch(downloadUrl);
                                    if (!response.ok) throw new Error("Error al descargar la imagen");
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = 'comprobante_gymmate.jpg';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error("Error en la descarga:", error);
                                    window.open(ultimoComprobanteUrl, '_blank');
                                }
                            }}
                            className="bg-white/10 hover:bg-[#009EE3]/80 p-3 rounded-full transition-colors text-white shadow-lg backdrop-blur-md"
                            title="Descargar comprobante"
                        >
                            <Download className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={() => setShowReceiptModal(false)}
                            className="bg-red-500/80 hover:bg-red-500 p-3 rounded-full transition-colors text-white shadow-lg backdrop-blur-md"
                            title="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative max-w-2xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img 
                            src={ultimoComprobanteUrl} 
                            alt="Comprobante" 
                            className="w-full h-auto max-h-[85vh] object-contain shadow-2xl rounded-xl"
                        />
                    </div>
                </div>
            )}

            <div className="w-full max-w-3xl mx-auto">
                
                {/* HEADER */}
                <div className={AppStyles.headerContainer}>
                    <p className={AppStyles.subtitle}>Envía comprobantes de planes activos manualmente.</p>
                </div>

                {/* BUSCADOR */}
                {!alumnoSeleccionado && (
                    <div className={AppStyles.searchWrapper}>
                        <div className={`${AppStyles.searchGlow} bg-gradient-to-r from-cyan-500 to-blue-600`}></div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Buscar alumno por nombre..."
                                className={`${AppStyles.searchInput} pl-10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500`}
                            />
                            
                            {sugerencias.length > 0 && (
                                <ul className={AppStyles.suggestionsList}>
                                    {sugerencias.map((alumno) => (
                                        <li
                                            key={alumno.id}
                                            onClick={() => handleSelectAlumno(alumno)}
                                            className={AppStyles.suggestionItem}
                                        >
                                            <div className={AppStyles.avatarSmall.replace("bg-gray-800 text-green-400 border-green-500/30", "bg-cyan-900/50 text-cyan-400 border-cyan-500/30")}>
                                                {alumno.nombre.charAt(0)}
                                            </div>
                                            <span className="text-gray-200 font-medium">{alumno.nombre} {alumno.apellido}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* TARJETA DE ACCIÓN */}
                {alumnoSeleccionado && (
                    <Card className={`${AppStyles.glassCard} border-t-4 border-cyan-500 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Info Alumno */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                            {alumnoSeleccionado.fotoPerfil ? (
                                                <img src={alumnoSeleccionado.fotoPerfil} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-cyan-400">{alumnoSeleccionado.nombre.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</h2>
                                        <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-cyan-400 underline transition-colors">
                                            Cambiar usuario
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">Estado Cuenta</p>
                                    <span className={`text-sm font-bold px-2 py-1 rounded border ${tienePlanesActivos ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                        {tienePlanesActivos ? 'ACTIVO' : 'SIN PLAN'}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 mb-6"></div>

                            {/* Info del Plan */}
                            {tienePlanesActivos ? (
                                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/20 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center">
                                            {loadingComprobante ? (
                                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : ultimoComprobanteUrl ? (
                                                <Receipt className="w-10 h-10 text-blue-400" />
                                            ) : (
                                                <FileText className="w-10 h-10 text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-blue-300 text-xs font-bold uppercase tracking-wider">Documento Disponible</p>
                                            <h3 className="text-xl font-bold text-white">Comprobante de Plan</h3>
                                            <p className="text-gray-400 text-sm pt-1">
                                                {ultimoComprobanteUrl 
                                                    ? "(Se enviará el último comprobante guardado)"
                                                    : "(Se generará un recibo nuevo)"}
                                            </p>
                                        </div>
                                    </div>
                                    {ultimoComprobanteUrl && (
                                        <button
                                            onClick={() => setShowReceiptModal(true)}
                                            className="px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold shadow-lg bg-[#009EE3]/10 hover:bg-[#009EE3]/20 border border-[#009EE3]/30 text-[#009EE3] shadow-[#009EE3]/10"
                                        >
                                            <Receipt className="w-5 h-5" />
                                            Ver Comprobante
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 bg-red-900/20 rounded-xl p-4 border border-red-500/20 mb-8 text-center text-red-300">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" /> Este usuario no posee un plan activo. No se puede generar recibo.
                                </div>
                            )}

                            {/* Botón de Acción */}
                            <button
                                onClick={enviarRecibo}
                                disabled={sending || !tienePlanesActivos}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3
                                    ${!tienePlanesActivos 
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20'
                                    }
                                `}
                            >
                                {sending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {ultimoComprobanteUrl ? "Enviando Comprobante..." : "Generando PDF y Enviando..."}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" /> Enviar Recibo por WhatsApp
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
                                Se enviará al número: {alumnoSeleccionado.telefono || <span className="inline-flex items-center gap-1 ml-1 text-yellow-500/90 font-medium">No registrado <AlertTriangle className="w-4 h-4" /></span>}
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};