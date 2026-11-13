import { useState, useEffect } from "react";
import { PlansApi, type UserPlanDTO } from "../../API/Planes/PlansApi";

export const useUserPlan = (enabled: boolean = true) => {
    // Ahora 'activePlans' es un array
    const [activePlans, setActivePlans] = useState<UserPlanDTO[]>([]);
    const [isUserExpired, setIsUserExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;
        fetchMyPlans();
    }, [enabled]);

    const fetchMyPlans = async () => {
        setLoading(true);
        try {
            const result = await PlansApi.getMyPlan();

            if (result && Array.isArray(result.planes)) {
                setActivePlans(result.planes);
                setIsUserExpired(!result.tienePlan);
            } else {
                setActivePlans([]);
                setIsUserExpired(true);
            }
        } catch (err) {
            console.error("Error al cargar mis planes:", err);
            setError("No se pudo cargar la información de tus planes.");
        } finally {
            setLoading(false);
        }
    };

    return {
        activePlans,
        isUserExpired,
        loading,
        error,
        fetchMyPlans
    };
};