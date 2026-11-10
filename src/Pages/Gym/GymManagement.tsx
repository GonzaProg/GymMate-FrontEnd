import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GymApi, type GymDTO } from "../../API/Gym/GymApi";
import { PagoGymApi, type PagoGymDTO } from "../../API/Gym/PagoGymApi";
import { Card } from "../../Components/UI/Card";
import { showSuccess, showError } from "../../Helpers/Alerts";
import { useEditGym } from "../../Hooks/Gym/useEditGym";
import { AppStyles } from "../../Styles/AppStyles";
import { Button } from "../../Components/UI/Button";
import { Input } from "../../Components/UI/Input";
import { Edit2, Image as ImageIcon, Camera, Wallet, Trash2, Check, X } from "lucide-react";

const getTodayInputDateAR = () => {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).formatToParts(new Date());

  const d = partes.find(p => p.type === "day")?.value || "01";
  const m = partes.find(p => p.type === "month")?.value || "01";
  const y = partes.find(p => p.type === "year")?.value || "2026";
  return `${y}-${m}-${d}`;
};

const inputDateToDDMMYYYY = (yyyyMmDd: string): string => {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd.trim());
  if (!partes) return yyyyMmDd;
  const [, y, m, d] = partes;
  return `${d}/${m}/${y}`;
};

const ddmmyyyyToInputDate = (ddMmYyyy: string): string => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddMmYyyy.trim());
  if (!partes) return getTodayInputDateAR();
  const [, d, m, y] = partes;
  return `${y}-${m}-${d}`;
};

export const GymManagement = () => {
  const [gyms, setGyms] = useState<GymDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el panel inline de Pagos por Gimnasio (Sin ventanas flotantes)
  const [activePagosGymId, setActivePagosGymId] = useState<number | null>(null);
  const [pagosPorGym, setPagosPorGym] = useState<Record<number, PagoGymDTO[]>>({});
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [submittingPago, setSubmittingPago] = useState(false);

  // Inputs del formulario inline de PagoGym
  const [montoPago, setMontoPago] = useState("");
  const [fechaPago, setFechaPago] = useState(() => getTodayInputDateAR());
  const [editingPagoId, setEditingPagoId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [pagoError, setPagoError] = useState<string | null>(null);

  const loadGyms = async () => {
    try {
      const data = await GymApi.getAll();
      setGyms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    showEditModal,
    nombre, setNombre,
    codigo, setCodigo,
    selectedLogo, handleLogoChange,
    selectedFondo, handleFondoChange,
    removeFondo, setRemoveFondo,
    loading: editLoading,
    openEditModal,
    closeEditModal,
    handleSubmit
  } = useEditGym(loadGyms);

  useEffect(() => {
    loadGyms();
  }, []);

  const cargarPagosDeGym = async (gymId: number) => {
    setLoadingPagos(true);
    setPagoError(null);
    try {
      const historial = await PagoGymApi.getByGym(gymId);
      setPagosPorGym(prev => ({ ...prev, [gymId]: historial }));
    } catch (error: any) {
      setPagoError(error.response?.data?.error || "Error al cargar el historial de pagos");
    } finally {
      setLoadingPagos(false);
    }
  };

  const handleTogglePagosPanel = (gymId: number) => {
    if (activePagosGymId === gymId) {
      setActivePagosGymId(null);
      resetFormularioPago();
    } else {
      setActivePagosGymId(gymId);
      resetFormularioPago();
      cargarPagosDeGym(gymId);
    }
  };

  const resetFormularioPago = () => {
    setMontoPago("");
    setFechaPago(getTodayInputDateAR());
    setEditingPagoId(null);
    setConfirmDeleteId(null);
    setPagoError(null);
  };

  const handleGuardarPago = async (e: React.FormEvent, gymId: number) => {
    e.preventDefault();
    setPagoError(null);

    const montoNum = Number(montoPago);
    if (!montoPago || isNaN(montoNum) || montoNum <= 0) {
      setPagoError("El monto debe ser mayor a 0");
      return;
    }

    if (!fechaPago) {
      setPagoError("Selecciona una fecha de pago");
      return;
    }

    const fechaFormateada = inputDateToDDMMYYYY(fechaPago);

    setSubmittingPago(true);
    try {
      if (editingPagoId) {
        await PagoGymApi.update(editingPagoId, {
          gymId,
          monto: montoNum,
          fechaPago: fechaFormateada
        });
      } else {
        await PagoGymApi.create({
          gymId,
          monto: montoNum,
          fechaPago: fechaFormateada
        });
      }

      resetFormularioPago();
      await cargarPagosDeGym(gymId);
    } catch (error: any) {
      setPagoError(error.response?.data?.error || "Error al guardar el pago");
    } finally {
      setSubmittingPago(false);
    }
  };

  const handleIniciarEdicionPago = (pago: PagoGymDTO) => {
    setEditingPagoId(pago.id);
    setMontoPago(String(pago.monto));
    setFechaPago(ddmmyyyyToInputDate(pago.fechaPago));
    setConfirmDeleteId(null);
    setPagoError(null);
  };

  const handleEliminarPago = async (pagoId: number, gymId: number) => {
    setPagoError(null);
    try {
      await PagoGymApi.delete(pagoId);
      if (editingPagoId === pagoId) {
        resetFormularioPago();
      } else {
        setConfirmDeleteId(null);
      }
      await cargarPagosDeGym(gymId);
    } catch (error: any) {
      setPagoError(error.response?.data?.error || "Error al eliminar el pago");
    }
  };

  const handleToggle = async (gym: GymDTO) => {
    try {
      // Optimistic UI Update
      const newStatus = !gym.activo;
      setGyms(prev => prev.map(g => g.id === gym.id ? { ...g, activo: newStatus } : g));

      await GymApi.toggleStatus(gym.id, newStatus);
      showSuccess(newStatus ? "Gimnasio Activado" : "Gimnasio Bloqueado");
    } catch (error) {
      showError("Error al cambiar estado");
      loadGyms(); // Revertir
    }
  };

  const handleToggleMpAccess = async (gym: GymDTO) => {
    try {
      const newStatus = !gym.cambiarMPAccessToken;
      setGyms(prev => prev.map(g => g.id === gym.id ? { ...g, cambiarMPAccessToken: newStatus } : g));

      await GymApi.toggleMpAccess(gym.id, newStatus);
      showSuccess(newStatus ? "Permiso MP Activado" : "Permiso MP Bloqueado");
    } catch (error) {
      showError("Error al cambiar permiso");
      loadGyms();
    }
  };

  if (loading) return <div className="text-white">Cargando gimnasios...</div>;

  return (
    <div className="mt-16 animate-fade-in-up">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {gyms.map((gym) => {
          const isPagosOpen = activePagosGymId === gym.id;
          const historialGym = pagosPorGym[gym.id] || [];

          return (
            <Card key={gym.id} className={`border ${gym.activo ? 'border-green-500/30 bg-gray-900/90' : 'border-red-500/30 bg-red-900/90'}`}>
              <div className="flex justify-between items-start mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{gym.nombre}</h3>
                  <p className="text-gray-400 text-xs mt-1">Código: <span className="text-yellow-400 font-mono">{gym.codigoAcceso}</span></p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePagosPanel(gym.id)}
                    className={`px-3 py-1 rounded text-sm transition flex items-center gap-1 border ${
                      isPagosOpen
                        ? 'bg-green-500/30 text-green-300 border-green-500/50'
                        : 'bg-green-500/20 text-green-400 border-transparent hover:bg-green-500/30'
                    }`}
                  >
                    <Wallet className="w-3 h-3" /> Pagos
                  </button>
                  <button 
                    onClick={() => openEditModal(gym)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Editar
                  </button>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${gym.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {gym.activo ? 'ACTIVO' : 'BLOQUEADO'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-300 text-sm">Acceso al sistema</span>
                
                {/* Toggle Switch Activo */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={gym.activo}
                    onChange={() => handleToggle(gym)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                <span className="text-gray-300 text-sm">Permitir cambiar MP Token</span>
                
                {/* Toggle Switch MP Access */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={gym.cambiarMPAccessToken || false}
                    onChange={() => handleToggleMpAccess(gym)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {/* PANEL INLINE DE PAGOS DEL GIMNASIO (Sin ventanas flotantes) */}
              {isPagosOpen && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
                  <form onSubmit={(e) => handleGuardarPago(e, gym.id)} className="space-y-3 bg-gray-800/40 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                        {editingPagoId ? "Editar Pago" : "Registrar Pago Mensual"}
                      </span>
                      {editingPagoId && (
                        <button
                          type="button"
                          onClick={resetFormularioPago}
                          className={`${AppStyles.actionBtnBase} ${AppStyles.btnCancel} text-xs`}
                        >
                          Cancelar edición
                        </button>
                      )}
                    </div>

                    {pagoError && (
                      <div className={`${AppStyles.errorBox} !mb-2 !p-2 text-xs`}>
                        {pagoError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={AppStyles.label}>Monto ($)</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={montoPago}
                          onChange={(e) => setMontoPago(e.target.value)}
                          placeholder="Ej: 25000"
                          className={`${AppStyles.inputDark} !p-2 text-sm`}
                          required
                        />
                      </div>

                      <div>
                        <label className={AppStyles.label}>Fecha de Pago</label>
                        <input
                          type="date"
                          value={fechaPago}
                          onChange={(e) => setFechaPago(e.target.value)}
                          className={`${AppStyles.inputDark} !p-2 text-sm`}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingPago}
                      className={`w-full py-2 px-4 rounded-xl font-bold text-sm transition-all border ${AppStyles.btnSave}`}
                    >
                      {submittingPago
                        ? "Guardando..."
                        : editingPagoId
                        ? "Actualizar Pago"
                        : "Cargar Pago"}
                    </button>
                  </form>

                  {/* HISTORIAL DE PAGOS DEL GYM */}
                  <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10 flex justify-between items-center bg-black/40">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Historial de Pagos
                      </span>
                      <span className={AppStyles.numberBadge}>
                        {historialGym.length}
                      </span>
                    </div>

                    {loadingPagos ? (
                      <div className="p-4 text-center text-gray-400 text-xs animate-pulse">
                        Cargando historial...
                      </div>
                    ) : historialGym.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-xs">
                        No hay pagos registrados para este gimnasio.
                      </div>
                    ) : (
                      <div className={`max-h-56 ${AppStyles.customScrollbar}`}>
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className={AppStyles.tableHeader}>
                              <th className="p-2.5">Fecha</th>
                              <th className="p-2.5 text-right">Monto</th>
                              <th className="p-2.5 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historialGym.map((pago) => (
                              <tr key={pago.id} className={AppStyles.tableRow}>
                                <td className="p-2.5 font-mono text-gray-300">
                                  {pago.fechaPago}
                                </td>
                                <td className="p-2.5 text-right font-mono font-bold text-green-400">
                                  ${Number(pago.monto).toLocaleString("es-AR")}
                                </td>
                                <td className="p-2.5 text-right">
                                  {confirmDeleteId === pago.id ? (
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleEliminarPago(pago.id, gym.id)}
                                        className={AppStyles.btnDelete}
                                        title="Confirmar eliminación"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className={`${AppStyles.btnIconBase} ${AppStyles.btnCancel}`}
                                        title="Cancelar"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleIniciarEdicionPago(pago)}
                                        className={AppStyles.btnEdit}
                                        title="Editar pago"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(pago.id)}
                                        className={AppStyles.btnDelete}
                                        title="Eliminar pago"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* MODAL EDITAR GYM */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={AppStyles.modalContent}>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Editar Gimnasio</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className={`p-6 space-y-4 flex-1 ${AppStyles.customScrollbar}`}>
                <Input
                  label="Nombre del Gimnasio"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                <Input
                  label="Código de Acceso"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
                <div>
                  <label className={AppStyles.label}>Logo (Opcional)</label>
                  <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-purple-500/50 hover:bg-white/5 transition-all group cursor-pointer relative h-20 flex items-center justify-center">
                    <input 
                      type="file" accept="image/*" 
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      {selectedLogo ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-purple-400" />
                          <p className="text-purple-400 font-bold text-sm truncate max-w-[150px]">{selectedLogo.name}</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-500 group-hover:scale-110 transition" />
                          <p className="text-gray-400 text-xs">Arrastra logo</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className={AppStyles.label}>Fondo de Inicio de Alumnos (Opcional)</label>
                  <div className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all group cursor-pointer relative h-20 flex items-center justify-center">
                    <input 
                      type="file" accept="image/*" 
                      onChange={handleFondoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      {selectedFondo ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                          <p className="text-blue-400 font-bold text-sm truncate max-w-[150px]">{selectedFondo.name}</p>
                        </>
                      ) : removeFondo ? (
                        <>
                          <Camera className="w-8 h-8 text-red-500" />
                          <p className="text-red-400 text-xs font-bold w-full">Fondo será eliminado</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-500 group-hover:scale-110 transition" />
                          <p className="text-gray-400 text-xs">Arrastra imagen de fondo</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 relative z-20">
                    <button 
                      type="button"
                      onClick={() => {
                        const nextState = !removeFondo;
                        setRemoveFondo(nextState);
                        if (nextState) {
                            handleFondoChange({ target: { files: null } } as any);
                        }
                      }}
                      className={`text-xs px-3 py-1 rounded transition-colors ${removeFondo ? 'bg-gray-700 text-gray-300' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                    >
                      {removeFondo ? "Deshacer eliminación" : "Eliminar fondo actual"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Eliminar el fondo actual solo lo elimina de mi DB pero no de cloudinary, eso debo eliminarlo manualmente.</p>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-4 shrink-0">
                <Button type="submit" disabled={editLoading} className="flex-1">
                  {editLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button type="button" onClick={closeEditModal} className={AppStyles.btnSecondary + " flex-1"}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
