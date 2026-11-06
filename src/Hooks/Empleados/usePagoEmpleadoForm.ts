import { useState } from "react";
import { EmpleadoApi, type EmpleadoDTO } from "../../API/Empleados/EmpleadoApi";
import { showSuccess, showError } from "../../Helpers/Alerts";

export const usePagoEmpleadoForm = (
    gymId: number, 
    empleado: EmpleadoDTO, 
    onSuccess: () => void
) => {
    const [monto, setMonto] = useState("");
    const [concepto, setConcepto] = useState("Sueldo Mensual");
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const getLocalISODate = () => {
        const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [fechaPago, setFechaPago] = useState(() => getLocalISODate());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
            showError('Ingrese un monto válido');
            return;
        }

        setLoading(true);
        try {
            await EmpleadoApi.asignarPago(gymId, empleado.id, {
                monto: Number(monto),
                concepto,
                metodoPago,
                fechaPago: fechaPago || undefined
            });
            
            showSuccess('Pago registrado correctamente.');
            onSuccess();
        } catch (error: any) {
            showError(error.response?.data?.error || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    return {
        monto,
        setMonto,
        concepto,
        setConcepto,
        metodoPago,
        setMetodoPago,
        fechaPago,
        setFechaPago,
        loading,
        handleSubmit
    };
};
