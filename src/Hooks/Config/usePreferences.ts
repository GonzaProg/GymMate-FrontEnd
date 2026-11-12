import { useState, useEffect } from "react";
import { GymApi } from "../../API/Gym/GymApi";
import { MercadoPagoApi } from "../../API/Pagos/MercadoPagoApi";
import { showError, showSuccess } from "../../Helpers/Alerts";
import { Capacitor } from '@capacitor/core';

export const usePreferences = () => {
    // DB Settings
    const [autoBirthday, setAutoBirthday] = useState(true);
    const [autoReceipts, setAutoReceipts] = useState(true);
    const [birthdayMessage, setBirthdayMessage] = useState("");
    const [inactivityMessage, setInactivityMessage] = useState("");
    const [moduloAsistencia, setModuloAsistencia] = useState(true);
    const [cambiarMPAccessToken, setCambiarMPAccessToken] = useState(false);

    // Concurrencia Settings
    const [concurrenciaBajaMax, setConcurrenciaBajaMax] = useState(8);
    const [concurrenciaMediaMax, setConcurrenciaMediaMax] = useState(20);
    const [fraseConcurrenciaBaja, setFraseConcurrenciaBaja] = useState("Está súper tranquilo. ¡Es el momento perfecto para entrenar!");
    const [fraseConcurrenciaMedia, setFraseConcurrenciaMedia] = useState("Hay movimiento, pero no es excusa para no entrenar. ¡Vamos!");
    const [fraseConcurrenciaAlta, setFraseConcurrenciaAlta] = useState("Está bastante lleno. ¡Queda a tu elección!");
    const [savingConcurrencia, setSavingConcurrencia] = useState(false);
    const [ultimaVersionApp, setUltimaVersionApp] = useState("");

    // Auth info to check if already linked
    const currentUserStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const [tieneMercadoPago, setTieneMercadoPago] = useState(currentUser?.gym?.tieneMercadoPago ?? false);

    // Estados para el cambio de contraseña
    const [passwordCurrent, setPasswordCurrent] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    // LocalStorage Settings (Métricas)
    // Inicializamos leyendo de localStorage
    const [showFinancialMetrics, setShowFinancialMetricsState] = useState(() => {
        const saved = localStorage.getItem("showFinancialMetrics");
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [loading, setLoading] = useState(true);
    const [savingMessage, setSavingMessage] = useState(false);
    const [savingInactivityMessage, setSavingInactivityMessage] = useState(false);

    // Cargar Configuración del Backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await GymApi.getPreferences();
                setAutoBirthday(data.envioAutomaticoCumpleanos);
                setAutoReceipts(data.envioAutomaticoRecibos);
                setBirthdayMessage(data.mensajeCumpleanos || "");
                setInactivityMessage(data.mensajeInactividad || "");
                setModuloAsistencia(data.moduloAsistencia ?? true);
                setCambiarMPAccessToken(data.cambiarMPAccessToken ?? false);
                setConcurrenciaBajaMax(data.concurrenciaBajaMax ?? 8);
                setConcurrenciaMediaMax(data.concurrenciaMediaMax ?? 20);
                setFraseConcurrenciaBaja(data.fraseConcurrenciaBaja ?? "Está súper tranquilo. ¡Es el momento perfecto para entrenar!");
                setFraseConcurrenciaMedia(data.fraseConcurrenciaMedia ?? "Hay movimiento, pero no es excusa para no entrenar. ¡Vamos!");
                setFraseConcurrenciaAlta(data.fraseConcurrenciaAlta ?? "Está bastante lleno. ¡Queda a tu elección!");
                if (data.ultimaVersionApp) setUltimaVersionApp(data.ultimaVersionApp);
            } catch (err) {
                console.error("Error cargando preferencias", err);
            } finally {
                setLoading(false);
            }
        };
        load();

        // Check for OAuth callbacks
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mp_success')) {
            showSuccess("¡Cuenta de Mercado Pago vinculada exitosamente! ✅");
            setTieneMercadoPago(true);
            setCambiarMPAccessToken(false);

            // Actualizar localstorage / sessionstorage
            if (currentUser && currentUser.gym) {
                currentUser.gym.tieneMercadoPago = true;
                const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
                storage.setItem("user", JSON.stringify(currentUser));
            }

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (urlParams.get('mp_error')) {
            showError("Hubo un error al vincular tu cuenta de Mercado Pago.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // --- HANDLERS DB ---
    const toggleBirthday = async (val: boolean) => {
        setAutoBirthday(val); // Optimistic UI
        try {
            await GymApi.updatePreferences({ envioAutomaticoCumpleanos: val });
        } catch (e) {
            setAutoBirthday(!val); // Revertir si falla
            showError("No se pudo actualizar");
        }
    };

    const toggleReceipts = async (val: boolean) => {
        setAutoReceipts(val);
        try {
            await GymApi.updatePreferences({ envioAutomaticoRecibos: val });
        } catch (e) {
            setAutoReceipts(!val);
            showError("No se pudo actualizar");
        }
    };

    const toggleAsistencia = async (val: boolean) => {
        setModuloAsistencia(val);
        try {
            await GymApi.updatePreferences({ moduloAsistencia: val });

            // --- EL TRUCO ESTÁ AQUÍ: Actualizamos la "memoria" del navegador ---
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            const userStr = storage.getItem("user");

            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.gym) {
                    user.gym.moduloAsistencia = val; // Sobreescribimos con el nuevo valor
                    storage.setItem("user", JSON.stringify(user)); // Lo guardamos de nuevo
                }
            }

            showSuccess(`Módulo de asistencia ${val ? 'activado' : 'desactivado'}. Actualizando vista...`);

            // Recargamos la pestaña automáticamente después de 1 segundo para que el menú lateral desaparezca/aparezca
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (e) {
            setModuloAsistencia(!val);
            showError("No se pudo actualizar el módulo");
        }
    };

    // --- HANDLER LOCALSTORAGE (Sync entre pestañas) ---
    const setShowFinancialMetrics = (val: boolean) => {
        setShowFinancialMetricsState(val);
        localStorage.setItem("showFinancialMetrics", JSON.stringify(val));
        // Disparar evento para que otros componentes se enteren (ej: HistorialPagos)
        window.dispatchEvent(new Event("storage"));
    };

    // --- HANDLER PARA EL MENSAJE ---
    const saveBirthdayMessage = async () => {
        setSavingMessage(true);
        try {
            await GymApi.updatePreferences({ mensajeCumpleanos: birthdayMessage });
            showSuccess("Mensaje de cumpleaños actualizado ✅");
        } catch (error) {
            showError("No se pudo guardar el mensaje");
        } finally {
            setSavingMessage(false);
        }
    };

    const saveInactivityMessage = async () => {
        setSavingInactivityMessage(true);
        try {
            await GymApi.updatePreferences({ mensajeInactividad: inactivityMessage });
            showSuccess("Mensaje de inactividad actualizado ✅");
        } catch (error) {
            showError("No se pudo guardar el mensaje de inactividad");
        } finally {
            setSavingInactivityMessage(false);
        }
    };

    const saveConcurrenciaConfig = async () => {
        if (concurrenciaMediaMax <= concurrenciaBajaMax) {
            showError("El máximo de concurrencia media debe ser mayor al de concurrencia baja");
            return;
        }

        setSavingConcurrencia(true);
        try {
            await GymApi.updatePreferences({
                concurrenciaBajaMax,
                concurrenciaMediaMax,
                fraseConcurrenciaBaja,
                fraseConcurrenciaMedia,
                fraseConcurrenciaAlta
            });

            // Actualizamos la memoria local para que StudentHome lo tome de inmediato
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            const userStr = storage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.gym) {
                    user.gym.concurrenciaBajaMax = concurrenciaBajaMax;
                    user.gym.concurrenciaMediaMax = concurrenciaMediaMax;
                    user.gym.fraseConcurrenciaBaja = fraseConcurrenciaBaja;
                    user.gym.fraseConcurrenciaMedia = fraseConcurrenciaMedia;
                    user.gym.fraseConcurrenciaAlta = fraseConcurrenciaAlta;
                    storage.setItem("user", JSON.stringify(user));
                }
            }

            showSuccess("Configuración de concurrencia actualizada ✅");
        } catch (error) {
            showError("No se pudo guardar la configuración de concurrencia");
        } finally {
            setSavingConcurrencia(false);
        }
    };

    const vincularMercadoPago = async () => {
        try {
            const platform = Capacitor.getPlatform();
            const isNative = platform === 'electron' || navigator.userAgent.toLowerCase().includes('electron');

            const { url } = await MercadoPagoApi.getOAuthUrl(isNative);

            if (isNative) {
                // En Electron simulamos un click en un link externo para forzar al sistema operativo 
                // a abrir el navegador real (Chrome, Edge) en vez de una ventana interna.
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showSuccess("Sigue los pasos en la ventana del navegador. Cuando termines, refresca esta página.");
            } else {
                window.location.href = url; // Redirigir al usuario al flujo OAuth (Navegador Web normal)
            }
        } catch (error) {
            showError("No se pudo obtener la URL de vinculación.");
        }
    };

    const desvincularMercadoPago = async () => {
        try {
            await GymApi.desvincularMercadoPago();
            showSuccess("Cuenta de Mercado Pago desvinculada ✅");
            setTieneMercadoPago(false);

            if (currentUser && currentUser.gym) {
                currentUser.gym.tieneMercadoPago = false;
                localStorage.setItem("user", JSON.stringify(currentUser));
            }
        } catch (error) {
            showError("No se pudo desvincular la cuenta");
        }
    };

    const updateFinanzasPassword = async () => {
        if (!passwordCurrent || !passwordNew || !passwordConfirm) {
            showError("Todos los campos de contraseña son obligatorios");
            return;
        }

        if (passwordNew !== passwordConfirm) {
            showError("Las nuevas contraseñas no coinciden");
            return;
        }

        setChangingPassword(true);
        try {
            // 1. Verificar la contraseña actual
            const verifyRes = await GymApi.verifyFinancePassword(passwordCurrent);

            if (verifyRes.success) {
                // 2. Si es válida, proceder al cambio
                await GymApi.updatePreferences({ finanzasPassword: passwordNew });
                showSuccess("Contraseña financiera actualizada ✅");

                // Limpiar campos
                setPasswordCurrent("");
                setPasswordNew("");
                setPasswordConfirm("");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                showError("La contraseña actual es incorrecta");
            } else {
                showError("No se pudo actualizar la contraseña");
            }
        } finally {
            setChangingPassword(false);
        }
    };

    return {
        loading,
        savingMessage,
        savingInactivityMessage,
        autoBirthday,
        autoReceipts,
        birthdayMessage,
        setBirthdayMessage,
        saveBirthdayMessage,
        inactivityMessage,
        setInactivityMessage,
        saveInactivityMessage,
        toggleBirthday,
        toggleReceipts,
        showFinancialMetrics,
        setShowFinancialMetrics,
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
        saveConcurrenciaConfig, savingConcurrencia,
        ultimaVersionApp
    };
};