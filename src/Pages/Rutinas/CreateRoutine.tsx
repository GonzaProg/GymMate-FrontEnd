import { useState, useRef, useEffect } from "react";
import { Play, ChevronDown, Info, Dumbbell, ArrowUp, ArrowDown, Edit2, Trash2, RefreshCw, Plus, Save, CheckCircle2, Calendar, X, Link, Unlink } from "lucide-react";
import { createPortal } from "react-dom";
import { useCreateRoutine } from "../../Hooks/Rutinas/useCreateRoutine";
import { Input, Button } from "../../Components/UI";
import { AppStyles } from "../../Styles/AppStyles";
import { VideoEjercicio } from "../../Components/VideoEjercicios/VideoEjercicio";
import { MuscleFilter } from "../../Components/MuscleFilter/MuscleFilter";
import { CloudinaryApi } from "../../Helpers/Cloudinary/Cloudinary";
import React from "react";

interface CreateRoutineProps {
    isGeneral?: boolean;
    routineIdToEdit?: number | null;
    groupIdToEdit?: string | null;
}

export const CreateRoutine = ({ isGeneral = false, routineIdToEdit = null, groupIdToEdit = null }: CreateRoutineProps) => {
  const {
    // Datos Generales
    nombreRutina, setNombreRutina,
    // Buscador Alumnos
    busqueda, sugerencias, mostrarSugerencias, setMostrarSugerencias, handleSearchChange, handleSelectAlumno, 
    // Datos Display Edición
    alumnoNombreDisplay,
    // Buscador Ejercicios
    ejercicioBusqueda, ejerciciosFiltrados, mostrarSugerenciasEjercicios, 
    handleEjercicioSearchChange, handleSelectEjercicio, setMostrarSugerenciasEjercicios,
    selectedMuscle, handleSelectMuscle,
    // Formulario Detalle
    series, handleSeriesChange,
    tipoSerie, setTipoSerie,
    repsInicial, handleRepsInicialChange,
    reps, handleRepsChange,
    peso, handlePesoChange,
    pesosArray, handlePesoArrayChange, repsArrayCalculado,
    handleAddExercise, 
    detalles, editIndex, handleEditRow, cancelEditRow, handleDeleteRow, 
    moveRowUp, moveRowDown, handleSubmit,
    selectedForSuperserie, toggleSelectForSuperserie, groupSelectedIntoSuperserie, removeFromSuperserie, getSuperserieIndex,
    ejercicios, // <-- Extraemos los ejercicios para buscar detalles rápidos
    // --- MULTI-DÍA ---
    dias, diaActual, handleAddDay, handleRemoveDay, handleSelectDay, MAX_DIAS,
    isEditing
  } = useCreateRoutine(isGeneral, routineIdToEdit, groupIdToEdit);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el modal de video NO está abierto, y el click fue fuera del contenedor del buscador
      if (!previewUrl && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setMostrarSugerenciasEjercicios(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [previewUrl, setMostrarSugerenciasEjercicios]);

  // Contar ejercicios totales en todos los días
  const totalEjercicios = dias.reduce((sum, dia) => sum + dia.length, 0);

  return (
    <div className={`${AppStyles.principalContainer} principalContainer`}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
              
        <div className="flex flex-col gap-6">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <div className={`${AppStyles.glassCard} overflow-visible z-50`}>
             <div className={"absolute top-[1px] left-[6px] w-[calc(100%-2px)] h-1 bg-gradient-to-r from-green-500/50 to-transparent rounded-t-3xl"}></div>
             
             <h3 className={`${AppStyles.sectionTitle} left-[100px]`}>
                <span className={AppStyles.numberBadge}>1</span> 
                {isEditing ? "Editar Rutina" : "Nueva Rutina"}
             </h3>

            <Input 
              label="Nombre de Rutina" 
              value={nombreRutina} 
              onChange={e => setNombreRutina(e.target.value)} 
              placeholder="Ej: Hipertrofia" 
              className={AppStyles.inputDark}
              labelClassName={AppStyles.label}
            />
            
            {/* INFO: Si tiene más de 1 día, mostrar formato de nombre */}
            {dias.length > 1 && (
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-300 text-xs flex items-center gap-2">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  {isEditing ? 'Se actualizarán' : 'Se crearán'} {dias.length} rutinas: {dias.map((_, i) => `"${nombreRutina || "..."} - Día ${i+1}"`).join(", ")}
                </p>
              </div>
            )}
            
            {/* LÓGICA CORREGIDA CON ESTILO SIMPLE */}
            {(!isGeneral && !isEditing) ? (
                /* CASO: CREANDO PERSONALIZADA (Buscador) */
                <div className="relative mt-4">
                    <Input 
                        label="Asignar a Alumno" value={busqueda} 
                        onChange={e => handleSearchChange(e.target.value)} 
                        onFocus={() => busqueda && setMostrarSugerencias(true)}
                        placeholder="Buscar por nombre..." className={AppStyles.inputDark} labelClassName={AppStyles.label}
                    />
                    {mostrarSugerencias && sugerencias.length > 0 && (
                        <ul className={AppStyles.suggestionsList}>
                        {sugerencias.map((a) => (
                            <li key={a.id} onClick={() => handleSelectAlumno(a)} className={AppStyles.suggestionItem}>
                            <div className={AppStyles.avatarSmall}>{a.nombre.charAt(0)}</div>
                            <span className="text-gray-200">{a.nombre} {a.apellido}</span>
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
            ) : (
                /* CASO: GENERAL O EDICIÓN (Cartel Simple) */
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-blue-300 text-sm font-bold flex items-center gap-2">
                        <Info className="w-4 h-4" /> {routineIdToEdit ? "Modo Edición" : "Modo Plantilla"}
                    </p>
                    {/* Opcional: Mostrar nombre del alumno en pequeñito si estamos editando una personal */}
                    {routineIdToEdit && !isGeneral && alumnoNombreDisplay && (
                        <p className="text-gray-400 text-xs mt-1 pl-6">
                           Alumno: {alumnoNombreDisplay}
                        </p>
                    )}
                </div>
            )}

          </div>

          {/* COLUMNA 2: EJERCICIOS (Buscador corregido incluido) */}
          <div className={`${AppStyles.glassCard} overflow-visible z-40`}>
             <div className={"absolute top-[1px] left-[6px] w-[calc(100%-2px)] h-1 bg-gradient-to-r from-green-500/50 to-transparent rounded-t-3xl"}></div>
             <h3 className={`${AppStyles.sectionTitle} left-[100px]`}>
              <span className={AppStyles.numberBadge}>2</span>
              Ejercicios {dias.length > 1 && <span className="text-green-400 text-sm font-normal ml-2">→ Día {diaActual + 1}</span>}
             </h3>
             
             <div className="mt-4 bg-black/20 rounded-xl border border-white/5 mb-4">
                 <MuscleFilter selectedMuscle={selectedMuscle} onSelectMuscle={handleSelectMuscle} />
             </div>

             <div className="mt-2 relative" ref={searchContainerRef}>
                <Input 
                    label="Buscar Ejercicio"
                    value={ejercicioBusqueda}
                    onChange={(e) => handleEjercicioSearchChange(e.target.value)}
                    onFocus={() => setMostrarSugerenciasEjercicios(true)}
                    placeholder="Escribe para buscar..."
                    className={AppStyles.inputDark}
                    labelClassName={AppStyles.label}
                />
                
                {mostrarSugerenciasEjercicios && (ejercicioBusqueda.trim() !== "" || selectedMuscle) ? (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
                        {ejerciciosFiltrados.length > 0 ? ejerciciosFiltrados.map((ej) => {
                            const thumbUrl = CloudinaryApi.getThumbnail(ej.imagenUrl, ej.urlVideo);
                            return (
                                <div 
                                    key={ej.id} 
                                    className="relative group rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-green-500/60 transition-all aspect-square bg-gray-900 shadow-md flex-shrink-0" 
                                    onClick={() => handleSelectEjercicio(ej)}
                                >
                                    {thumbUrl ? (
                                        <img src={thumbUrl} alt={ej.nombre} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-500 bg-gray-800/50">
                                            <Dumbbell className="w-8 h-8 opacity-50 mb-1" />
                                        </div>
                                    )}
                                    
                                    {/* Gradient Overlay superior para el texto */}
                                    <div className="absolute top-0 inset-x-0 p-2 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
                                        <p className="text-white text-xs font-bold leading-tight drop-shadow-md text-center">{ej.nombre}</p>
                                    </div>

                                    {/* Botón de play (para ver video) */}
                                    {ej.urlVideo && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setPreviewUrl(ej.urlVideo); }} 
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-green-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-green-400 shadow-lg"
                                        >
                                            <Play size={18} className="fill-white text-white ml-1" />
                                        </button>
                                    )}
                                </div>
                            );
                        }) : (
                            <p className="col-span-full py-6 text-center text-gray-500 italic">No hay ejercicios encontrados</p>
                        )}
                    </div>
                ) : null}
            </div>

            <div className={`grid grid-cols-2 ${tipoSerie === 'Estandar' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mt-4`}>
                <Input label="Series" type="number" value={series} onChange={handleSeriesChange} className={`${AppStyles.inputDark} text-center font-bold`} labelClassName={AppStyles.label} />
                {tipoSerie === 'Estandar' ? (
                    <>
                        <Input label="Reps" type="text" value={reps} onChange={handleRepsChange} className={`${AppStyles.inputDark} text-center font-bold`} labelClassName={AppStyles.label} placeholder="Ej: 15/12" />
                        <Input label="Peso" type="text" value={peso} onChange={handlePesoChange} className={`${AppStyles.inputDark} text-center font-bold`} labelClassName={AppStyles.label} placeholder="A elección" />
                    </>
                ) : (
                    <Input label="Reps Iniciales" type="text" value={repsInicial} onChange={handleRepsInicialChange} className={`${AppStyles.inputDark} text-center font-bold`} labelClassName={AppStyles.label} placeholder="Ej: 15" />
                )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <label className={AppStyles.label}>Tipo de Serie</label>
                <div className="relative group">
                    <select 
                        value={tipoSerie} 
                        onChange={(e) => setTipoSerie(e.target.value as any)} 
                        className={`${AppStyles.inputDark} text-center font-bold px-4 py-[10px] appearance-none rounded-lg border border-white/10 cursor-pointer pr-10 w-full`}
                    >
                        <option value="Estandar" className={AppStyles.darkBackgroundSelect}>Estándar</option>
                        <option value="Ascendente" className={AppStyles.darkBackgroundSelect}>Ascendente</option>
                        <option value="Descendente" className={AppStyles.darkBackgroundSelect}>Descendente</option>
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 group-hover:text-green-400 transition-colors">
                        <ChevronDown className="w-4 h-4 fill-current" />
                    </div>
                </div>
            </div>

            {/* Listado dinámico de pesos por repetición */}
            {tipoSerie !== 'Estandar' && (
                <div className="mt-6 p-4 rounded-xl border border-white/5 bg-black/20 space-y-3">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Detalle por Serie</h4>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider w-[150px] text-center">Peso</span>
                </div>
                {Array(Number(series) || 1).fill("").map((_, i) => {
                    const computedReps = repsArrayCalculado[i] || "-";

                    return (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-lg">
                            <span className="text-blue-400 font-bold min-w-[30px]">#{i + 1}</span>
                            <span className="text-gray-300 font-medium flex-1">
                                {computedReps} reps
                            </span>
                            <div className="w-[150px]">
                                <Input 
                                    type="text" 
                                    value={pesosArray[i] || ""} 
                                    onChange={(e) => handlePesoArrayChange(i, e.target.value)} 
                                    className={`${AppStyles.inputDark} text-center font-bold`} 
                                    placeholder="A elección" 
                                />
                            </div>
                        </div>
                    );
                })}
                </div>
            )}

            <div className="pt-4 flex gap-2">
                {editIndex !== null && (
                    <Button variant="danger" onClick={cancelEditRow} className="flex-1 bg-gray-700">CANCELAR</Button>
                )}
                <Button variant="info" fullWidth onClick={handleAddExercise} className={`${editIndex !== null ? "flex-[2] bg-yellow-500/20 text-yellow-400" : AppStyles.btnPrimary} flex items-center justify-center gap-2`}>
                    {editIndex !== null ? <><RefreshCw className="w-4 h-4" /> ACTUALIZAR</> : <><Plus className="w-4 h-4" /> AGREGAR A DÍA {diaActual + 1}</>}
                </Button>
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <div className={AppStyles.glassCard}>
            <div className={AppStyles.sectionTitle}><h3>Resumen</h3></div>
            
            {/* === TABS DE DÍAS === */}
            {!(routineIdToEdit) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {dias.map((dia, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectDay(index)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        diaActual === index 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Día {index + 1}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        diaActual === index ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-gray-500'
                      }`}>
                        {dia.length}
                      </span>
                      {/* Botón eliminar día (solo si hay más de 1) */}
                      {dias.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveDay(index); }}
                          className="ml-1 p-0.5 rounded-full hover:bg-red-500/30 text-gray-500 hover:text-red-400 transition-colors"
                          title={`Eliminar Día ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Botón Nuevo Día */} 
                  {dias.length < MAX_DIAS && (
                    <button
                      onClick={handleAddDay}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nuevo Día
                    </button>
                  )}
                </div>

                {/* Info de resumen multi-día */}
                {dias.length > 1 && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    {dias.length} días · {totalEjercicios} ejercicios en total · Máximo {MAX_DIAS} días
                  </div>
                )}
              </div>
            )}

            {/* === ENCABEZADO DEL DÍA ACTUAL === */}
            {dias.length > 1 && (
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">{diaActual + 1}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Día {diaActual + 1}</h4>
                  <p className="text-gray-500 text-xs">{detalles.length} ejercicio{detalles.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
            
            {detalles.length === 0 ? <div className="text-center py-10 text-gray-500">Sin ejercicios en {dias.length > 1 ? `Día ${diaActual + 1}` : 'la rutina'}</div> : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm text-left">
                <thead className={AppStyles.tableHeader}>
                  <tr>
                    <th className="p-4 w-12 text-center text-xs font-bold uppercase tracking-wider text-gray-500">SuperSerie</th>
                    <th className="p-4">Ejercicio</th>
                    <th className="p-4 text-center">Series</th>
                    <th className="p-4 text-center">Reps</th>
                    <th className="p-4 text-center">Peso</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {detalles.map((d: any, index: number) => {
                      const ejOriginal = ejercicios.find((e: any) => e.id === d.ejercicioId);
                      const isSuperserie = !!d.grupoSuperserie;
                      const isFirstInSuperserie = isSuperserie && (index === 0 || d.grupoSuperserie !== detalles[index - 1].grupoSuperserie);
                      const isLinkedWithPrev = isSuperserie && !isFirstInSuperserie;
                      const isLastInSuperserie = isSuperserie && (index === detalles.length - 1 || detalles[index + 1].grupoSuperserie !== d.grupoSuperserie);
                      const isSelected = selectedForSuperserie.includes(index);

                      return (
                      <React.Fragment key={index}>
                      {isFirstInSuperserie && (
                          <tr className="bg-red-500/10 border-t border-b border-red-500/20">
                              <td colSpan={6} className="py-2 px-4 text-center text-red-400 font-bold text-xs tracking-widest uppercase shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
                                  🔥 Superserie {getSuperserieIndex(d.grupoSuperserie)}
                              </td>
                          </tr>
                      )}
                      <tr className={`${AppStyles.tableRow} ${editIndex === index ? 'bg-yellow-500/10' : ''} ${isSuperserie ? 'bg-red-500/5' : ''} ${isSelected ? 'bg-blue-500/10' : ''} ${isLinkedWithPrev ? 'border-t-0' : ''}`}>
                        <td className="p-4 text-center">
                            {!isSuperserie ? (
                                <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectForSuperserie(index)}
                                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer"
                                    title="Seleccionar para agrupar en superserie"
                                />
                            ) : (
                                <button 
                                    onClick={() => removeFromSuperserie(index)} 
                                    className="p-1.5 rounded-full transition-colors flex justify-center items-center text-red-400 hover:bg-red-500/20 mx-auto"
                                    title="Desvincular de la Superserie"
                                >
                                    <Unlink className="w-4 h-4" />
                                </button>
                            )}
                        </td>
                        <td className="p-4 font-medium text-white flex items-center gap-2 relative">
                          {isSuperserie && (
                              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center">
                                  {/* Top half line (only if not first) */}
                                  <div className={`w-0.5 h-1/2 ${!isFirstInSuperserie ? 'bg-red-500/40' : 'bg-transparent'}`}></div>
                                  
                                  {/* Center dot */}
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.8)] absolute top-1/2 transform -translate-y-1/2"></div>
                                  
                                  {/* Bottom half line (only if not last) */}
                                  <div className={`w-0.5 h-1/2 ${!isLastInSuperserie ? 'bg-red-500/40' : 'bg-transparent'}`}></div>
                              </div>
                          )}
                          <span className={`${isSuperserie ? 'text-red-400 ml-6' : ''}`}>{d.nombreEjercicio}</span>
                          {ejOriginal?.urlVideo && (
                              <button 
                                  onClick={() => setPreviewUrl(ejOriginal.urlVideo)}
                                  className="text-blue-400 hover:text-blue-300 bg-blue-500/10 p-1.5 rounded-full transition-colors ml-2 flex-shrink-0"
                                  title="Ver video"
                              >
                                  <Play size={12} className="fill-current" />
                              </button>
                          )}
                        </td>
                        <td className="p-4 text-center text-gray-300">{d.series}</td>
                        <td className="p-4 text-center text-gray-300">{d.repeticiones}</td>
                        <td className="p-4 text-center text-green-400">{d.peso}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => moveRowUp(index)} disabled={index === 0} className={`p-2 rounded flex justify-center items-center transition-opacity ${index === 0 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'text-blue-400 hover:bg-blue-500/10'}`}><ArrowUp className="w-4 h-4" /></button>
                          <button onClick={() => moveRowDown(index)} disabled={index === detalles.length - 1} className={`p-2 rounded flex justify-center items-center transition-opacity ${index === detalles.length - 1 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'text-blue-400 hover:bg-blue-500/10'}`}><ArrowDown className="w-4 h-4" /></button>
                          <button onClick={() => handleEditRow(index)} className="text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 p-2 border border-yellow-500/20 rounded transition-colors flex justify-center items-center"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteRow(index)} className="text-red-500 bg-red-500/10 hover:bg-red-500/20 p-2 border border-red-500/20 rounded transition-colors flex justify-center items-center"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                      </React.Fragment>
                    )})}
                </tbody>
              </table>
              
              {selectedForSuperserie.length >= 2 && (
                  <div className="bg-blue-500/20 border-t border-blue-500/30 p-4 flex justify-between items-center sticky bottom-0 z-10 backdrop-blur-md">
                      <span className="text-blue-300 font-bold text-sm">
                          {selectedForSuperserie.length} ejercicios seleccionados
                      </span>
                      <Button variant="info" onClick={groupSelectedIntoSuperserie} className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Agrupar en Superserie
                      </Button>
                  </div>
              )}
            </div>
           )}

          <div className="mt-8 flex justify-end pt-6 border-t border-white/10">
            <Button variant="info" onClick={handleSubmit} size="lg" className={`${AppStyles.btnPrimary} flex items-center justify-center gap-2`}>
                {routineIdToEdit ? <><Save className="w-5 h-5" /> GUARDAR CAMBIOS</> : <><CheckCircle2 className="w-5 h-5" /> {dias.length > 1 ? `CONFIRMAR (${dias.length} DÍAS)` : 'CONFIRMAR'}</>}
            </Button>
          </div>
        </div>

      </div>

      {previewUrl && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 pt-safe pb-safe animate-fade-in">
              <button onClick={() => setPreviewUrl(null)} className="absolute top-safe-offset right-safe-offset z-[10000] p-2 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors border border-white/20 w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-md touch-manipulation">
                  <X className="w-6 h-6" />
              </button>
              <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-white/20">
                  <VideoEjercicio url={previewUrl} controls={true} muted={true} />
              </div>
          </div>,
          document.body
      )}

    </div>
  );
};