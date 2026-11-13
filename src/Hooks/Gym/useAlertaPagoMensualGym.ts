import { useState, useEffect } from "react";
import { PagoGymApi } from "../../API/Gym/PagoGymApi";

export const useAlertaPagoMensualGym = (
    esEntrenadorOAdmin: boolean,
    gymId?: number,
    codigoAcceso?: string
) => {
    const [mostrarAlertaPagoGym, setMostrarAlertaPagoGym] = useState(false);

    useEffect(() => {
        if (!esEntrenadorOAdmin || !gymId) {
            setMostrarAlertaPagoGym(false);
            return;
        }

        // 1. Excluir gimnasio de administrador (GYM-001)
        const codigo = codigoAcceso?.trim().toUpperCase();
        if (codigo === "GYM-001" || codigo === "GYM001") {
            setMostrarAlertaPagoGym(false);
            return;
        }

        // 2. Comprobar primero si estamos entre los días 10 y 15 del mes (Zona horaria Argentina)
        const partesFecha = new Intl.DateTimeFormat("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            day: "2-digit"
        }).formatToParts(new Date());

        const diaActual = Number(partesFecha.find(p => p.type === "day")?.value || 0);
        if (diaActual < 10 || diaActual > 15) {
            setMostrarAlertaPagoGym(false);
            return;
        }

        // 3. Si está entre el 10 y el 15, consultar en la DB si existe el pago mensual de ese gym
        let cancelado = false;
        const comprobarPagoEnDB = async () => {
            try {
                const estado = await PagoGymApi.verificarEstadoMensual();
                if (!cancelado) {
                    setMostrarAlertaPagoGym(Boolean(estado.debeMostrarAlerta));
                }
            } catch (error) {
                console.error("Error verificando estado de pago mensual del gimnasio:", error);
            }
        };

        comprobarPagoEnDB();

        return () => {
            cancelado = true;
        };
    }, [esEntrenadorOAdmin, gymId, codigoAcceso]);

    return {
        mostrarAlertaPagoGym,
        cerrarAlertaPagoGym: () => setMostrarAlertaPagoGym(false)
    };
};

