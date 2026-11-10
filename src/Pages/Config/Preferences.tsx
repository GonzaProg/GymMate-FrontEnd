import { AppStyles } from "../../Styles/AppStyles";
import { ToggleSwitch } from "../../Components/UI/ToggleSwitch";
import { usePreferences } from "../../Hooks/Config/usePreferences";
import { Settings, Bot, Save, Monitor, Package, Lock, CreditCard, Users } from "lucide-react";

export const Preferences = () => {
    const { 
        loading, 
        autoBirthday, toggleBirthday,
        autoReceipts, toggleReceipts,
        birthdayMessage, setBirthdayMessage, saveBirthdayMessage, savingMessage,
        inactivityMessage, setInactivityMessage, saveInactivityMessage, savingInactivityMessage,
        showFinancialMetrics, setShowFinancialMetrics,
        moduloAsistencia, toggleAsistencia,
        passwordCurrent, setPasswordCurrent,
        passwordNew, setPasswordNew,
        passwordConfirm, setPasswordConfirm,
        changingPassword, updateFinanzasPassword,
        cambiarMPAccessToken, tieneMercadoPago, vincularMercadoPago, desvincularMercadoPago,
        concurrenciaBajaMax, setConcurrenciaBajaMax,
        concurrenciaMediaMax, setConcurrenciaMediaMax,
        fraseConcurrenciaBaja, setFraseConcurrenciaBaja,
        fraseConcurrenciaMedia, setFraseConcurrenciaMedia,
        fraseConcurrenciaAlta, setFraseConcurrenciaAlta,
        saveConcurrenciaConfig, savingConcurrencia
    } = usePreferences();

    if (loading) return <div className="text-white text-center pt-20">Cargando preferencias...</div>;

    return (
        <div className={AppStyles.principalContainer}>
            <div className="w-full max-w-4xl mx-auto">
                
                <div className={AppStyles.headerContainer.replace("text-center", "text-left")}>
                    <div className="flex items-center gap-3">
                        <Settings className="w-7 h-7 text-white" />
                        <h1 className={AppStyles.title}>Configuración</h1>
                    </div>
                    <p className={AppStyles.subtitle}>Personaliza el comportamiento de tu sistema.</p>
                </div>

                <div className="space-y-6 mt-8 mb-20">
                    
                    {/* SECCIÓN: AUTOMATIZACIONES (Backend) */}
                    <div className={AppStyles.glassCard}>
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Bot className="w-6 h-6 text-blue-400" /> Automatizaciones (WhatsApp)
                        </h3>
                        
                        {/* Cumpleaños */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-white font-bold text-lg">Saludos de Cumpleaños</p>
                                <p className="text-gray-400 text-sm">Enviar un mensaje automático a las 9:00 AM a los socios que cumplan años.</p>
                            </div>
                            <ToggleSwitch checked={autoBirthday} onChange={toggleBirthday} />
                        </div>

                        {/* Cumpleaños - Editor de Mensaje (Solo si está activo) */}
                        {autoBirthday && (
                            <div className="mb-8 ml-1 pl-4 border-l-2 border-green-500/30 animate-fade-in-down">
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    Mensaje Personalizado:
                                </label>
                                <div className="text-xs text-gray-500 mb-2">
                                    Puedes usar <span className="text-green-400">{`{nombre}`}</span> para el nombre del socio y <span className="text-green-400">{`{gym}`}</span> para el nombre del gimnasio.
                                    <span className="italic opacity-70 ml-1">(Si lo dejas vacío, se usará el mensaje por defecto).</span>
                                </div>
                                <textarea 
                                    value={birthdayMessage}
                                    onChange={(e) => setBirthdayMessage(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm h-32 resize-none"
                                    placeholder={`¡Feliz Cumpleaños {nombre}! 🎂🎈\n\nDesde *{gym}* queremos desearte un día excelente.\n¡Gracias por entrenar con nosotros! 💪🎁`}
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={saveBirthdayMessage}
                                        disabled={savingMessage}
                                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {savingMessage ? 'Guardando...' : <span className="flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Guardar Mensaje</span>}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-white/10 my-6"></div>

                        {/* Recibos */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-lg">Recibos de Pago</p>
                                <p className="text-gray-400 text-sm">Enviar PDF del comprobante automáticamente al registrar un pago o renovación.</p>
                            </div>
                            <ToggleSwitch checked={autoReceipts} onChange={toggleReceipts} />
                        </div>

                        <div className="h-px bg-white/10 my-6"></div>

                        {/* Seguimiento por Inactividad */}
                        <div>
                            <div className="mb-4">
                                <p className="text-white font-bold text-lg">Seguimiento por Inactividad</p>
                                <p className="text-gray-400 text-sm">Mensaje que se envía automáticamente a los socios que llevan más de 1 mes sin conectarse.</p>
                            </div>

                            <div className="ml-1 pl-4 border-l-2 border-green-500/30">
                                <label className="block text-gray-300 text-sm font-bold mb-2">
                                    Mensaje Personalizado de Inactividad:
                                </label>
                                <div className="text-xs text-gray-500 mb-2">
                                    Puedes usar <span className="text-green-400">{`{nombre}`}</span> para el nombre del socio y <span className="text-green-400">{`{gym}`}</span> para el nombre del gimnasio.
                                    <span className="italic opacity-70 ml-1">(Si lo dejas vacío, se usará el mensaje por defecto).</span>
                                </div>
                                <textarea 
                                    value={inactivityMessage}
                                    onChange={(e) => setInactivityMessage(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm h-36 resize-none"
                                    placeholder={`¡Hola {nombre}! 👋\n\nDesde *{gym}* notamos que hace más de un mes no venís al gimnasio y queríamos saber cómo estás. 🏋️‍♂️\n\n¿Necesitás ayuda con algo, tu rutina o tus horarios?\n\n¡Contanos si podemos ayudarte en algo, te esperamos cuando quieras retomar! 💪`}
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={saveInactivityMessage}
                                        disabled={savingInactivityMessage}
                                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {savingInactivityMessage ? 'Guardando...' : <span className="flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Guardar Mensaje</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: INTERFAZ (Local) */}
                    <div className={AppStyles.glassCard}>
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Monitor className="w-6 h-6 text-purple-400" /> Interfaz y Métricas
                        </h3>

                        {/* Métricas Financieras */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-lg">Panel Financiero</p>
                                <p className="text-gray-400 text-sm">Mostrar gráficas de ingresos y métricas en el historial de pagos.</p>
                            </div>
                            <ToggleSwitch checked={showFinancialMetrics} onChange={setShowFinancialMetrics} />
                        </div>
                    </div>

                    {/* SECCIÓN: MÓDULOS DEL SISTEMA */}
                    <div className={AppStyles.glassCard}>
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Package className="w-6 h-6 text-green-400" /> Módulos del Sistema
                        </h3>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-lg">Control de Asistencia</p>
                                <p className="text-gray-400 text-sm">Habilita el escaneo de códigos QR, concurrencia en vivo y control de accesos.</p>
                            </div>
                            <ToggleSwitch checked={moduloAsistencia} onChange={toggleAsistencia} />
                        </div>
                    </div>

                    {/* SECCIÓN: SEGURIDAD FINANCIERA */}
                    <div className={AppStyles.glassCard}>
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-red-400" /> Seguridad Financiera
                        </h3>
                        
                        <div className="mb-4">
                            <p className="text-white font-bold text-lg mb-1">Cambiar Contraseña del Dashboard</p>
                            <p className="text-gray-400 text-sm mb-6">Completa los campos para actualizar la seguridad de acceso a finanzas.</p>
                            
                            <div className="space-y-4 max-w-sm">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 shadow-sm">Contraseña Actual</label>
                                    <input 
                                        type="password" 
                                        value={passwordCurrent}
                                        onChange={(e) => setPasswordCurrent(e.target.value)}
                                        placeholder="••••"
                                        className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-red-500 transition-all font-mono tracking-widest"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Nueva Clave</label>
                                        <input 
                                            type="password" 
                                            value={passwordNew}
                                            onChange={(e) => setPasswordNew(e.target.value)}
                                            placeholder="••••"
                                            className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-red-500 transition-all font-mono tracking-widest"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Confirmar</label>
                                        <input 
                                            type="password" 
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            placeholder="••••"
                                            className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-red-500 transition-all font-mono tracking-widest"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={updateFinanzasPassword}
                                    disabled={changingPassword}
                                    className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 disabled:bg-gray-700 text-sm font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {changingPassword ? "Actualizando..." : (
                                        <>
                                            <Save className="w-4 h-4" /> 
                                            Actualizar Seguridad
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: CONCURRENCIA */}
                    <div className={AppStyles.glassCard}>
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-orange-400" /> Configuración de Concurrencia (App Alumnos)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Máximo Concurrencia Baja (verde)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={concurrenciaBajaMax}
                                    onChange={(e) => setConcurrenciaBajaMax(Number(e.target.value))}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-green-500 transition-all font-mono"
                                />
                                <p className="text-xs text-gray-400 mt-1">Si hay hasta {concurrenciaBajaMax} personas.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Máximo Concurrencia Media (amarillo)</label>
                                <input
                                    type="number"
                                    min={concurrenciaBajaMax + 1}
                                    value={concurrenciaMediaMax}
                                    onChange={(e) => setConcurrenciaMediaMax(Number(e.target.value))}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-white/10 focus:border-yellow-500 transition-all font-mono"
                                />
                                <p className="text-xs text-gray-400 mt-1">Entre {concurrenciaBajaMax + 1} y {concurrenciaMediaMax} personas.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mensaje Concurrencia Baja (Verde)</label>
                                <input
                                    type="text"
                                    value={fraseConcurrenciaBaja}
                                    onChange={(e) => setFraseConcurrenciaBaja(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-green-500/30 focus:border-green-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mensaje Concurrencia Media (Amarillo)</label>
                                <input
                                    type="text"
                                    value={fraseConcurrenciaMedia}
                                    onChange={(e) => setFraseConcurrenciaMedia(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-yellow-500/30 focus:border-yellow-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mensaje Concurrencia Alta (Naranja)</label>
                                <input
                                    type="text"
                                    value={fraseConcurrenciaAlta}
                                    onChange={(e) => setFraseConcurrenciaAlta(e.target.value)}
                                    className="w-full bg-gray-900/50 text-white p-3 rounded-lg border border-orange-500/30 focus:border-orange-500 transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Se mostrará cuando superen las {concurrenciaMediaMax} personas.</p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button
                                onClick={saveConcurrenciaConfig}
                                disabled={savingConcurrencia}
                                className={AppStyles.btnPrimary}
                            >
                                {savingConcurrencia ? 'Guardando...' : <span className="flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Guardar Concurrencia</span>}
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN: MERCADOPAGO (Visible si cambiarMPAccessToken es true O si ya tiene cuenta vinculada) */}
                    {(cambiarMPAccessToken || tieneMercadoPago) && (
                        <div className={`${AppStyles.glassCard} border-blue-500/30 animate-fade-in-up mb-20`}>
                            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-[#009EE3]" /> Integración con MercadoPago
                            </h3>

                            <div className="space-y-4 max-w-lg">
                                {!tieneMercadoPago ? (
                                    <div className="bg-[#009EE3]/10 border border-[#009EE3]/30 p-6 rounded-xl">
                                        <p className="text-white text-sm mb-4">
                                            Al vincular tu cuenta, Mercado Pago te solicitará permisos para que podamos generar cobros de suscripciones en tu nombre. 
                                            El dinero irá directamente a tu cuenta bancaria.
                                        </p>
                                        <button
                                            onClick={vincularMercadoPago}
                                            className="w-full bg-[#009EE3] hover:bg-[#007EB5] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CreditCard className="w-5 h-5" /> Vincular cuenta de Mercado Pago
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-green-400 font-bold text-lg mb-1 flex items-center gap-2">
                                                ✅ Cuenta Vinculada
                                            </p>
                                            <p className="text-gray-300 text-sm">Tus pagos se procesarán automáticamente.</p>
                                        </div>
                                        <button
                                            onClick={desvincularMercadoPago}
                                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Desvincular
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};