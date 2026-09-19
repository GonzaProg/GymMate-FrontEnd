import { useState } from "react";
import { useGymConfig } from "../../Context/GymConfigContext";
import { PageLayout } from "../../Components/UI/PageLayout";
import { Card } from "../../Components/UI/Card";
import { Input } from "../../Components/UI/Input";
import { Button } from "../../Components/UI/Button";
import { AppStyles } from "../../Styles/AppStyles";
import fondoSetup from "../../assets/Fondo-Login.jpg";
import { Settings } from "lucide-react";

export const SetupScreen = () => {
  const { setGymLocal } = useGymConfig();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validación simple local (el backend validará realmente al intentar loguearse)
      if (code.trim().length < 3) throw new Error("Código muy corto.");
      
      // Guardamos la configuración y recargamos el contexto
      setGymLocal(code.trim().toUpperCase());
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout centered showNavbar={false} backgroundImage={fondoSetup}>
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className={AppStyles.glassCard}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 mb-4 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <Settings className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Configuración</h1>
            <p className="text-gray-300 mt-2 text-sm px-4">
              Esta terminal aún no está vinculada. Ingresa el <b>Código de Acceso</b> de tu gimnasio.
            </p>
          </div>

          <div className="space-y-6" onKeyDown={(e) => { if (e.key === 'Enter') handleSaveConfig(e as any); }}>
            <div>
              <label className={AppStyles.label}>Código del Gimnasio</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: IRON-GYM"
                className={`${AppStyles.inputDark} text-center tracking-widest font-bold text-lg`}
                autoFocus
                required
              />
            </div>

            {error && <div className={AppStyles.errorBox}>{error}</div>}

            <Button type="button" onClick={handleSaveConfig} disabled={loading} className={`${AppStyles.btnPrimary} w-full`}>
              {loading ? "VINCULANDO..." : "VINCULAR TERMINAL"}
            </Button>
          </div>
          
          <div className="mt-6 text-center">
             <p className="text-xs text-gray-500">
                Este código vincula esta PC con tu base de datos en la nube.
             </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};