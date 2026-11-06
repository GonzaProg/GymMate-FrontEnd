import { useState } from "react"; 
import { createPortal } from "react-dom";
import { AppStyles } from "../../Styles/AppStyles";
import { useEvolucionCorporal, type PosicionFoto } from "../../Hooks/Evoluciones/useEvolucionCorporal";
import { X, Plus, ChevronDown, ChevronUp, Scale, Ruler, Camera, Trash2, Calendar, Pencil, ImagePlus } from "lucide-react";

export const EvolucionCorporal = ({ currentUser }: { currentUser: any }) => {
    const {
        historial, loading, loadingMore, saving,
        peso, setPeso, cuello, setCuello, hombros, setHombros,
        pecho, setPecho, bicep, setBicep, antebrazo, setAntebrazo,
        cintura, setCintura, cadera, setCadera, muslo, setMuslo,
        pantorrilla, setPantorrilla,
        fotos, handleFileChange, clearFile,
        isFormOpen, setIsFormOpen, resetForm,
        fotoSeleccionada, setFotoSeleccionada,
        mostrarTodos, handleVerTodos, todosCargados,
        handleGuardar, handleEliminar, handleChangeFotoExistente
    } = useEvolucionCorporal(currentUser);

    const isButtonDisabled = saving || !peso || !pecho || !bicep || !cintura || !cadera || !muslo;

    const registrosVisibles = mostrarTodos ? historial : historial.slice(0, 5);

    const renderInputMedida = (label: string, state: string, setter: (val: string) => void, unit: string = "cm", required: boolean = false) => (
        <div className="flex flex-col gap-1 w-full"> 
            <label className="text-xs text-gray-400 font-bold ml-1 tracking-wide flex justify-between">
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            <div className="relative">
                <input 
                    type="number" 
                    min={0}
                    step="0.1" 
                    value={state} 
                    onChange={e => setter(e.target.value)}
                    className={`${AppStyles.inputDark} w-full text-sm font-bold h-10 px-3 pr-10`}
                    placeholder={`0.0`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs">{unit}</span>
            </div>
        </div>
    );

    const renderFotoUpload = (title: string, pos: PosicionFoto, data: { file: File | null, preview: string | null }) => (
        <div className="flex flex-col gap-1 text-center">
            <span className="text-xs text-gray-400 font-bold mb-1">{title}</span>
            {data.preview ? (
                <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                    <img src={data.preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                        type="button" 
                        onClick={() => clearFile(pos)} 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-8 h-8 text-white drop-shadow-md" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl h-24 cursor-pointer hover:bg-white/5 hover:border-gray-400 transition-all text-gray-400">
                    <Camera className="w-6 h-6 mb-1 opacity-70" />
                    <span className="text-[10px] font-semibold">Subir Foto</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, pos)} className="hidden" />
                </label>
            )}
        </div>
    );

    const [uploadingPos, setUploadingPos] = useState<{ id: number, pos: PosicionFoto } | null>(null);

    return (
        <div className="mt-6 animate-fade-in pb-24 space-y-6 max-w-xl mx-auto relative">
            
            {/* FORMULARIO DE CARGA */}
            <div className={`${AppStyles.glassCard} p-0 overflow-hidden`}>
                <button 
                    onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors rounded-2xl"
                >
                    <h3 className="text-white font-bold flex items-center gap-2">
                        {isFormOpen ? <><X className="w-5 h-5"/> Cancelar Registro</> : <><Plus className="w-5 h-5"/> Añadir Nuevo Registro</>}
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all duration-500 ease-in-out px-2 overflow-hidden ${isFormOpen ? 'max-h-[2000px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
                    <form onSubmit={handleGuardar} className="space-y-6 pt-4 border-t border-white/10">
                        
                        <div>
                            <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3 border-b border-white/5 pb-2">
                                <Scale className="w-5 h-5" /> Medidas Generales
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {renderInputMedida("Peso", peso, setPeso, "kg", true)}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3 border-b border-white/5 pb-2">
                                <Ruler className="w-5 h-5" /> Medidas Obligatorias ({'cm'})
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {renderInputMedida("Pecho", pecho, setPecho, "cm", true)}
                                {renderInputMedida("Bíceps", bicep, setBicep, "cm", true)}
                                {renderInputMedida("Cintura", cintura, setCintura, "cm", true)}
                                {renderInputMedida("Cadera", cadera, setCadera, "cm", true)}
                                {renderInputMedida("Muslo", muslo, setMuslo, "cm", true)}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-gray-400 font-bold mb-3 border-b border-white/5 pb-2">
                                <Ruler className="w-5 h-5" /> Medidas Opcionales ({'cm'})
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {renderInputMedida("Cuello", cuello, setCuello, "cm", false)}
                                {renderInputMedida("Hombros", hombros, setHombros, "cm", false)}
                                {renderInputMedida("Antebrazo", antebrazo, setAntebrazo, "cm", false)}
                                {renderInputMedida("Pantorrilla", pantorrilla, setPantorrilla, "cm", false)}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-3 border-b border-white/5 pb-2">
                                <Camera className="w-5 h-5" /> Fotos de Progreso (Opcional)
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                                {renderFotoUpload("Frontal", "fotoFrontal", fotos.fotoFrontal)}
                                {renderFotoUpload("Espaldas", "fotoEspaldas", fotos.fotoEspaldas)}
                                {renderFotoUpload("Perfil Izq", "fotoPerfilIzquierdo", fotos.fotoPerfilIzquierdo)}
                                {renderFotoUpload("Perfil Der", "fotoPerfilDerecho", fotos.fotoPerfilDerecho)}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isButtonDisabled} 
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 mt-2 ${
                                isButtonDisabled 
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600' 
                                    : `${AppStyles.btnPrimary}` 
                            }`}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando Registro...
                                </>
                            ) : (
                                "Guardar Progreso"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* HISTORIAL */}
            <div className="space-y-4">
                <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider pl-2 flex items-center gap-2">
                    {mostrarTodos ? "Todos los registros" : "Últimos registros"}
                </h3>
                
                {loading ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`${AppStyles.glassCard} h-28 opacity-50`}></div>
                        ))}
                    </div>
                ) : historial.length === 0 ? (
                    <div className={`${AppStyles.glassCard} flex flex-col items-center justify-center text-center py-10 border-dashed border-2 border-white/10`}>
                        <Scale className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
                        <p className="text-gray-400 font-medium">Aún no has registrado tu progreso.</p>
                        <p className="text-gray-500 text-sm mt-1">¡Comienza hoy mismo!</p>
                    </div>
                ) : (
                    <>
                        {registrosVisibles.map(item => (
                            <div key={item.id} className="bg-gray-800/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden group">
                                <div className="flex justify-between items-center z-10 border-b border-white/5 pb-3">
                                    <div>
                                        <p className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                            {item.peso} <span className="text-sm text-green-400 font-bold uppercase mt-1">kg</span>
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mt-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <button onClick={() => handleEliminar(item.id)} className={AppStyles.btnDelete} title="Eliminar registro">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Medidas renderizadas */}
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 z-10">
                                    {[{label: 'Pecho', val: item.pecho}, {label: 'Bíceps', val: item.bicep}, {label: 'Cintura', val: item.cintura}, {label: 'Cadera', val: item.cadera}, {label: 'Muslo', val: item.muslo}, 
                                      {label: 'Cuello', val: item.cuello}, {label: 'Hombros', val: item.hombros}, {label: 'Antebraz.', val: item.antebrazo}, {label: 'Pantorr.', val: item.pantorrilla}
                                    ].map(medida => medida.val ? (
                                        <div key={medida.label} className="bg-white/5 rounded-lg p-2 text-center">
                                            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-tighter">{medida.label}</span>
                                            <span className="text-sm font-bold text-gray-200">{medida.val}</span>
                                        </div>
                                    ) : null)}
                                </div>

                                {/* Fotos renderizadas directamente con placeholder para subir/cambiar */}
                                <div className="grid grid-cols-4 gap-3 z-10 mt-2">
                                    {(['fotoFrontal', 'fotoEspaldas', 'fotoPerfilIzquierdo', 'fotoPerfilDerecho'] as PosicionFoto[]).map(pos => {
                                        const url = item[pos];
                                        const isUpdating = uploadingPos?.id === item.id && uploadingPos?.pos === pos;
                                        
                                        return (
                                            <div key={pos} className="flex flex-col items-center gap-2">
                                                <div className="relative aspect-[3/4] w-full bg-black/40 rounded-lg overflow-hidden border border-white/5">
                                                    {url ? (
                                                        <>
                                                            <img 
                                                                src={url} 
                                                                alt={pos} 
                                                                className="w-full h-full object-cover cursor-pointer" 
                                                                loading="lazy" 
                                                                onClick={() => setFotoSeleccionada(url)}
                                                            />
                                                            {/* EDITAR FOTO - SIEMPRE VISIBLE */}
                                                            <label 
                                                                title="Cambiar foto"
                                                                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white rounded-md p-1.5 cursor-pointer transition-all shadow-xl shadow-black/50 border border-white/20"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                                <input 
                                                                    type="file" accept="image/*" className="hidden"
                                                                    onChange={async (e) => {
                                                                        if(e.target.files && e.target.files[0]) {
                                                                            setUploadingPos({ id: item.id, pos });
                                                                            await handleChangeFotoExistente(item.id, e.target.files[0], pos);
                                                                            setUploadingPos(null);
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 text-gray-600 hover:text-gray-400 transition-colors border border-dashed border-gray-700/50 rounded-lg">
                                                            <ImagePlus className="w-6 h-6 mb-1 opacity-70" />
                                                            <span className="text-[8px] uppercase font-bold tracking-wider mt-1">Añadir</span>
                                                            <input 
                                                                type="file" accept="image/*" className="hidden"
                                                                onChange={async (e) => {
                                                                    if(e.target.files && e.target.files[0]) {
                                                                        setUploadingPos({ id: item.id, pos });
                                                                        await handleChangeFotoExistente(item.id, e.target.files[0], pos);
                                                                        setUploadingPos(null);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    )}

                                                    {/* Spinner de actualización individual */}
                                                    {isUpdating && (
                                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-1">
                                                    {pos.replace('foto', '').replace('Izquierdo', 'Izq').replace('Derecho', 'Der')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {(!todosCargados || historial.length > 5) && (
                            <button 
                                onClick={handleVerTodos}
                                disabled={loadingMore}
                                className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Cargando todos...
                                    </>
                                ) : mostrarTodos ? (
                                    <>Ver menos <ChevronUp className="w-4 h-4"/></>
                                ) : (
                                    <>Ver historial completo <ChevronDown className="w-4 h-4"/></>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* MODAL FOTO PANTALLA COMPLETA */}
            {fotoSeleccionada && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col p-4 animate-fade-in" onClick={() => setFotoSeleccionada(null)}>
                    <div className="flex justify-end pb-4 pt-safe mt-4">
                        <button 
                            onClick={() => setFotoSeleccionada(null)}
                            className="text-white flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2 rounded-full px-5 font-bold transition-colors shadow-lg"
                        >
                            Cerrar <X className="w-4 h-4"/>
                        </button>
                    </div>
                    
                    <div className="flex-1 w-full max-w-3xl mx-auto pb-10 flex items-center justify-center">
                        <img 
                            src={fotoSeleccionada} 
                            alt="Foto Evolución" 
                            className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" 
                            onClick={(e) => e.stopPropagation()} 
                        />
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};