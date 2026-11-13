import { useEffect, useState } from "react";
import { GymApi } from "../../API/Gym/GymApi";
import { AppStyles } from "../../Styles/AppStyles";
import { showError, showSuccess } from "../../Helpers/Alerts";
import { Smartphone, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export const AppVersionManager = () => {
    const [versionActual, setVersionActual] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        const cargarVersion = async () => {
            try {
                const data = await GymApi.getAppVersion();
                setVersionActual(data.ultimaVersionApp || "");
            } catch (error) {
                console.error("Error obteniendo la versión actual:", error);
                showError("No se pudo obtener la versión actual de la base de datos");
            } finally {
                setLoading(false);
            }
        };

        cargarVersion();
    }, []);

    const handleCambiarVersion = async (accion: 'subir' | 'bajar') => {
        if (updating) return;
        setUpdating(true);

        try {
            const res = await GymApi.cambiarVersionApp(accion);
            setVersionActual(res.ultimaVersionApp);

            // Actualizar también el usuario en storage local para mantener sincronizado el estado
            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
            const userStr = storage.getItem("user");
            if (userStr) {
                const parsed = JSON.parse(userStr);
                if (parsed.gym) {
                    parsed.gym.ultimaVersionApp = res.ultimaVersionApp;
                    storage.setItem("user", JSON.stringify(parsed));
                }
            }

            await showSuccess(`Versión actualizada a v${res.ultimaVersionApp} ✅`);
            window.location.reload();
        } catch (error: any) {
            showError(error.response?.data?.error || "No se pudo actualizar la versión");
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center pt-20">Cargando versión...</div>;
    }

    return (
        <div className={AppStyles.principalContainer}>
            <div className="w-full max-w-2xl mx-auto mt-10">
                <div className={AppStyles.headerContainer.replace("text-center", "text-left")}>
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-7 h-7 text-green-400" />
                        <h1 className={AppStyles.title}>Aumentar Versión</h1>
                    </div>
                    <p className={AppStyles.subtitle}>
                        Gestiona el número de la última versión de la aplicación móvil (Android e iOS) guardada en la base de datos.
                    </p>
                </div>

                <div className={`${AppStyles.glassCard} mt-8 text-center py-10 px-6`}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Versión Actual en Base de Datos
                    </p>

                    <div className="inline-flex items-center justify-center bg-gray-900/70 border border-green-500/30 rounded-2xl px-8 py-5 mb-6 shadow-inner">
                        <span className="text-4xl md:text-5xl font-extrabold text-green-400 font-mono tracking-wider">
                            v{versionActual || "---"}
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                        El versionado avanza de <span className="text-gray-200 font-mono">1.2.0</span> hasta <span className="text-gray-200 font-mono">1.2.9</span>, pasando automáticamente a <span className="text-gray-200 font-mono">1.3.0</span> y así sucesivamente.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                        <button
                            onClick={() => handleCambiarVersion('bajar')}
                            disabled={updating}
                            className="w-full sm:w-1/2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/40 disabled:opacity-50 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowDownCircle className="w-5 h-5" />
                            {updating ? "Actualizando..." : "Bajar Versión (-1)"}
                        </button>

                        <button
                            onClick={() => handleCambiarVersion('subir')}
                            disabled={updating}
                            className="w-full sm:w-1/2 bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowUpCircle className="w-5 h-5" />
                            {updating ? "Actualizando..." : "Subir Versión (+1)"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

