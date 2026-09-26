import { useRenewPlan } from "../../Hooks/Planes/useRenewPlan"; 
import { AppStyles } from "../../Styles/AppStyles";
import { RenewPlanStyles } from "../../Styles/RenewPlanStyles";
import { PaymentMethodSelect } from "../../Components/UI/PaymentMethodSelect";
import { Input } from "../../Components/UI/Input";
import { Search, ClipboardList, RefreshCcw, X, Plus, Hourglass, FileText } from "lucide-react";
import { useState } from "react";
import { UserPaymentHistory } from "./UserPaymentHistory";

export const RenewPlan = () => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const {
    planesDisponibles,
    alumnoSeleccionado,
    sugerencias,
    busqueda,
    loadingAction,
    metodoPago,      
    setMetodoPago,   
    fechaInicio,
    setFechaInicio,
    setBusqueda,
    seleccionarAlumno: originalSeleccionarAlumno,
    limpiarSeleccion: originalLimpiarSeleccion,
    renovarPlan,
    cancelarPlan,
    asignarPlan
  } = useRenewPlan();

  const seleccionarAlumno = (alumno: any) => {
    setMostrarHistorial(false);
    originalSeleccionarAlumno(alumno);
  };

  const limpiarSeleccion = () => {
    setMostrarHistorial(false);
    originalLimpiarSeleccion();
  };

  const ultimoPlan = alumnoSeleccionado?.userPlans
    ?.filter((p: any) => !p.activo && p.plan?.nombre !== "Plan de Prueba")
    ?.sort((a: any, b: any) => new Date(b.fechaVencimiento).getTime() - new Date(a.fechaVencimiento).getTime())[0];

  const getPreviewDates = (duracionDias: number, vencimientoActual?: string) => {
    if (fechaInicio) {
      const parts = fechaInicio.split("-");
      const inicio = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + duracionDias);
      return { inicio: inicio.toLocaleDateString(), fin: fin.toLocaleDateString() };
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    let inicio = new Date();
    let fin = new Date();
    
    if (vencimientoActual) {
      const venc = new Date(vencimientoActual);
      venc.setHours(0, 0, 0, 0);
      if (venc >= hoy) {
        inicio = new Date(venc);
        fin = new Date(venc);
        fin.setDate(fin.getDate() + duracionDias);
        return { inicio: inicio.toLocaleDateString(), fin: fin.toLocaleDateString() };
      }
    }
    
    fin.setDate(fin.getDate() + duracionDias);
    return { inicio: inicio.toLocaleDateString(), fin: fin.toLocaleDateString() };
  };

  return (
    <div className={AppStyles.principalContainer}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* HEADER */}
          <div className={AppStyles.headerContainer + " mb-8"}>
            <p className={AppStyles.subtitle}>Administra renovaciones, altas y bajas.</p>
          </div>

          {/* BUSCADOR  */}
          {!alumnoSeleccionado && (
            <div className={AppStyles.searchWrapper}>
              <div className={`${AppStyles.searchGlow} bg-gradient-to-r from-green-600 to-blue-600`}></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar alumno por nombre..."
                  className={`${AppStyles.searchInput} pl-10 focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                />
                
                {sugerencias.length > 0 && (
                  <ul className={AppStyles.suggestionsList}>
                    {sugerencias.map((alumno) => (
                      <li
                        key={alumno.id}
                        onClick={() => seleccionarAlumno(alumno)}
                        className={AppStyles.suggestionItem}
                      >
                        <div className={AppStyles.avatarSmall}>
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

          {/* DETALLE ALUMNO SELECCIONADO  */}
          {alumnoSeleccionado && (
            mostrarHistorial ? (
              <UserPaymentHistory 
                alumnoSeleccionado={alumnoSeleccionado} 
                onBack={() => setMostrarHistorial(false)}
              />
            ) : (
            <div className={`${AppStyles.glassCard.replace("overflow-hidden", "")} animate-fade-in`}>
              
              {/* Encabezado del Alumno */}
              <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className={RenewPlanStyles.avatarContainer}>
                    {alumnoSeleccionado.fotoPerfil ? (
                        <img 
                            src={alumnoSeleccionado.fotoPerfil} 
                            alt="Perfil" 
                            className={RenewPlanStyles.avatarImg}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    ) : (
                        <span className={RenewPlanStyles.avatarFallback}>
                            {alumnoSeleccionado.nombre.charAt(0).toUpperCase()}
                        </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}
                      <button 
                        onClick={() => setMostrarHistorial(true)}
                        className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm py-1.5 px-3 rounded-lg transition-colors border border-blue-500/30 font-medium ml-2"
                        title="Ver Historial de Pagos Anual"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Historial</span>
                      </button>
                    </h2>
                  </div>
                </div>
                
                <button 
                  onClick={limpiarSeleccion}
                  className="mt-4 md:mt-0 text-gray-400 hover:text-white underline text-sm transition"
                >
                  Cambiar alumno
                </button>
              </div>

              {/* LISTA DE SUSCRIPCIONES ACTIVAS */}
              <div className="mb-8">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-400" /> Suscripciones Activas
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {alumnoSeleccionado.userPlans?.filter((p: any) => p.activo).length || 0}
                      </span>
                  </h3>

                  {alumnoSeleccionado.userPlans && alumnoSeleccionado.userPlans.some((p: any) => p.activo) ? (
                      <div className="grid grid-cols-1 gap-4">
                          {alumnoSeleccionado.userPlans.filter((p: any) => p.activo).map((sus: any, index: number) => (
                              <div key={sus.id} className="bg-gray-800/50 border border-white/10 rounded-xl p-4 flex flex-col xl:flex-row justify-between items-center gap-4 hover:border-white/20 transition-all relative" style={{ zIndex: 50 - index }}>
                                  
                                  {/* Info Plan */}
                                  <div className="flex-1 text-left w-full">
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                          <h4 className="text-xl font-bold text-green-400">{sus.plan.nombre}</h4>
                                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600 uppercase">
                                              {sus.plan.tipo}
                                          </span>
                                      </div>
                                      <p className="text-gray-400 text-sm mb-3">
                                          Vence: <span className="text-white font-mono">{new Date(sus.fechaVencimiento).toLocaleDateString()}</span>
                                      </p>

                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-300 mb-3 bg-black/20 p-3 rounded-lg border border-white/5 w-full max-w-xl">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 font-bold mb-0.5">Precio</span>
                                            <span className="text-green-400 font-mono font-bold">${sus.plan.precio}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 font-bold mb-0.5">Duración</span>
                                            <span className="font-medium flex items-center gap-1"><Hourglass className="w-3 h-3"/> {sus.plan.duracionDias} días</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 font-bold mb-0.5">Acceso</span>
                                            <span className="font-medium">{sus.plan.diasPorSemana === 7 ? "Pase Libre" : `${sus.plan.diasPorSemana} días/sem`}</span>
                                        </div>
                                      </div>

                                      {sus.plan.descripcion && (
                                        <p className="text-gray-400 text-xs italic border-l-2 border-white/10 pl-2 max-w-lg line-clamp-2">
                                            "{sus.plan.descripcion}"
                                        </p>
                                      )}
                                  </div>

                                  {/* Botones de Acción Individuales */}
                                  <div className="flex flex-col gap-2 w-full xl:w-auto xl:items-end">
                                      <div className="flex flex-col xl:flex-row items-end gap-3 w-full xl:w-auto">
                                          <div className="w-full xl:w-48">
                                              <label className="text-gray-400 text-xs mb-1 block">Fecha Inicio (Opcional):</label>
                                              <Input 
                                                  type="date"
                                                  value={fechaInicio}
                                                  onChange={(e: any) => setFechaInicio(e.target.value)}
                                                  className={`${AppStyles.inputDark} h-[46px] py-1 mb-0 mt-0`}
                                              />
                                          </div>
                                          <div className="w-full xl:w-48">
                                              <PaymentMethodSelect 
                                                  value={metodoPago} 
                                                  onChange={setMetodoPago}
                                                  className="mb-0"
                                              />
                                          </div>
                                          <div className="flex gap-2 w-full xl:w-auto">
                                              <button 
                                                  onClick={() => renovarPlan()} 
                                                  disabled={loadingAction}
                                                  className="flex-1 xl:flex-none bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition shadow-lg disabled:opacity-50 h-[46px] px-4"
                                                  title="Renovar este plan"
                                              >
                                                  {loadingAction ? '...' : <span className="flex items-center justify-center gap-2"><RefreshCcw className="w-4 h-4" /> Renovar</span>}
                                              </button>
                                              <button 
                                                  onClick={() => cancelarPlan()}
                                                  disabled={loadingAction}
                                                  className="flex-1 xl:flex-none bg-red-900/50 hover:bg-red-600 text-white p-2 rounded-lg transition border border-red-800/50 disabled:opacity-50 h-[46px] px-4"
                                                  title="Cancelar este plan"
                                              >
                                                  {loadingAction ? '...' : <span className="flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancelar</span>}
                                              </button>
                                          </div>
                                      </div>
                                      <div className="text-xs text-gray-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 w-full text-center">
                                          {(() => {
                                              const duracion = (sus.plan as any).duracionDias || planesDisponibles.find(p => p.id === sus.plan.id)?.duracionDias;
                                              const preview = getPreviewDates(duracion, sus.fechaVencimiento);
                                              return <span>Nueva vigencia: <b className="text-white">{preview.inicio}</b> al <b className="text-green-400">{preview.fin}</b></span>;
                                          })()}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="bg-black/20 p-6 rounded-lg border border-white/5 flex flex-col items-center text-center">
                          <p className="text-gray-400 mb-4 text-lg">
                              Este usuario no tiene planes activos.
                          </p>
                          
                          {ultimoPlan && (
                              <div className="w-full max-w-2xl bg-gray-800/80 border border-white/10 rounded-xl p-5 mt-2 flex flex-col gap-4">
                                  <h4 className="text-white font-semibold text-md">¿Quiere renovar su último plan registrado?</h4>
                                  
                                  <div className="flex flex-col text-left bg-black/30 p-4 rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                          <span className="text-green-400 font-bold text-lg">{ultimoPlan.plan.nombre}</span>
                                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded border border-gray-600 uppercase">
                                              {ultimoPlan.plan.tipo}
                                          </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                          <span className="text-gray-400">Venció el:</span>
                                          <span className="text-red-400 font-mono font-medium">{new Date(ultimoPlan.fechaVencimiento).toLocaleDateString()}</span>
                                      </div>
                                      <div className="flex justify-between text-sm mt-1">
                                          <span className="text-gray-400">Precio original:</span>
                                          <span className="text-white font-mono">${ultimoPlan.plan.precio}</span>
                                      </div>
                                  </div>

                                  <div className="flex flex-col gap-2 w-full mt-2">
                                      <div className="flex flex-col sm:flex-row items-end gap-3 w-full">
                                          <div className="w-full sm:flex-1">
                                              <label className="text-gray-400 text-xs mb-1 block">Fecha Inicio (Opcional):</label>
                                              <Input 
                                                  type="date"
                                                  value={fechaInicio}
                                                  onChange={(e: any) => setFechaInicio(e.target.value)}
                                                  className={`${AppStyles.inputDark} h-[46px] py-1 mb-0 mt-0`}
                                              />
                                          </div>
                                          <div className="w-full sm:flex-1">
                                              <PaymentMethodSelect 
                                                  value={metodoPago} 
                                                  onChange={setMetodoPago}
                                                  className="mb-0"
                                              />
                                          </div>
                                          <button 
                                              onClick={() => renovarPlan(ultimoPlan.id, false)} 
                                              disabled={loadingAction}
                                              className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto h-[46px]"
                                              title="Renovar desde Hoy"
                                          >
                                              {loadingAction ? '...' : <><RefreshCcw className="w-6 h-4" /> Renovar</>}
                                          </button>
                                      </div>
                                      <div className="text-xs text-gray-400 bg-black/30 px-3 py-2 rounded-lg border border-white/5 text-center mt-1">
                                          {(() => {
                                              const duracion = (ultimoPlan.plan as any).duracionDias || planesDisponibles.find(p => p.id === ultimoPlan.plan.id)?.duracionDias || 30;
                                              const preview = getPreviewDates(duracion);
                                              return <span>Nueva vigencia: <b className="text-white">{preview.inicio}</b> al <b className="text-green-400">{preview.fin}</b></span>;
                                          })()}
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>

              {/* SECCIÓN AGREGAR NUEVO PLAN - SOLO SI NO TIENE PLANES ACTIVOS */}
              {!alumnoSeleccionado.userPlans || !alumnoSeleccionado.userPlans.some((p: any) => p.activo) && (
              <div className="border-t border-white/10 pt-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-green-400" /> Asignar Nuevo Plan</h3>
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                          <div className="w-full sm:w-48">
                              <label className="text-gray-400 text-xs mb-1 block">Fecha Inicio (Opcional):</label>
                              <Input 
                                  type="date"
                                  value={fechaInicio}
                                  onChange={(e: any) => setFechaInicio(e.target.value)}
                                  className={`${AppStyles.inputDark} h-[46px] py-1 mb-0 mt-0`}
                              />
                          </div>
                          <div className="w-full sm:w-48">
                              <PaymentMethodSelect 
                                  value={metodoPago} 
                                  onChange={setMetodoPago} 
                                  className="mb-0" 
                                  label="MÉTODO DE PAGO PARA ALTA:" 
                              />
                          </div>
                      </div>
                  </div>

                  <div className={RenewPlanStyles.plansGrid}>
                      {planesDisponibles.map(plan => (
                          <div 
                              key={plan.id}
                              onClick={() => asignarPlan(plan)}
                              className={`${RenewPlanStyles.planOptionCard} cursor-pointer group hover:bg-gray-800 transition-all`}
                          >
                              <div className="flex justify-between items-start">
                                  <div>
                                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">
                                          {plan.tipo}
                                      </span>
                                      <h4 className="text-white font-bold text-lg mt-1 group-hover:text-green-400 transition-colors">
                                          {plan.nombre}
                                      </h4>
                                  </div>
                                  <span className="bg-white/10 text-white text-xs font-mono px-2 py-1 rounded">
                                      ${plan.precio}
                                  </span>
                              </div>
                              <p className="text-gray-500 text-xs mt-3 flex items-center gap-1">
                                  <span className="flex items-center justify-center"><Hourglass className="w-4 h-4" /></span> {plan.duracionDias} días
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
              )}

            </div>
            )
          )}
        </div>
    </div>
  );
};