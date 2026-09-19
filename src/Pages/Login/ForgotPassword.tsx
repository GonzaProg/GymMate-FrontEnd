import { Link } from "react-router-dom";
import { PageLayout } from "../../Components/UI/PageLayout";
import { Card } from "../../Components/UI/Card";
import { Input } from "../../Components/UI/Input";
import { Button } from "../../Components/UI/Button";
import { AppStyles } from "../../Styles/AppStyles";
import { useRecoverPassword } from "../../Hooks/Login/useRecoverPassword";
import fondoLogin from "../../assets/Fondo-Login.jpg";
import { LoginStyles } from "../../Styles/LoginStyles";

export const ForgotPassword = () => {
  const { 
    step, setStep, loading, error, metodo, handleSelectMethod,
    dni, setDni, 
    code, setCode, 
    newPassword, setNewPassword, 
    confirmPassword, setConfirmPassword,
    destinoRecuperacion, 
    handleSendCode, handleChangePassword 
  } = useRecoverPassword();

  return (
    <PageLayout centered showNavbar={false} backgroundImage={fondoLogin}>
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className={AppStyles.glassCard}>
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">
                {step === 1 ? "Método de Recuperación" : step === 2 ? "Recuperar Acceso" : "Verificar Código"}
            </h2>
            <p className="text-gray-300 text-sm px-4">
              {step === 1 
                ? "¿Por dónde deseas recibir el código?" 
                : step === 2
                ? `Ingresa tu DNI para recibir un código por ${metodo === 'whatsapp' ? 'WhatsApp' : 'Correo'}.`
                : <span>Hemos enviado un código al destino <b className="text-green-400">{destinoRecuperacion}</b>.</span>
              }
            </p>
          </div>

          {/* Renderizado condicional según el paso */}
          {step === 1 ? (
             // PASO 1: SELECCIONAR METODO
             <div className="space-y-4">
               <Button onClick={() => handleSelectMethod('whatsapp')} className={`${AppStyles.btnPrimary} w-full flex items-center justify-center gap-2`}>
                  WhatsApp
               </Button>
               <Button onClick={() => handleSelectMethod('email')} className={`${AppStyles.btnPrimary} w-full flex items-center justify-center gap-2`}>
                  Email
               </Button>
            </div>
          ) : step === 2 ? (
            //  PASO 2: FORMULARIO DNI 
            <div className="space-y-6 animate-fade-in" onKeyDown={(e) => { if (e.key === 'Enter') handleSendCode(e as any); }}>
              <div>
                <label className={AppStyles.label}>DNI</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ingresa tu documento"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                  className={LoginStyles.inputDark}
                  autoFocus
                />
              </div>
              
              {error && <div className={AppStyles.errorBox}>{error}</div>}

              <Button type="button" onClick={handleSendCode} disabled={loading} className={`${AppStyles.btnPrimary} w-full`}>
                {loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
              </Button>
              
              <div className="text-center">
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                      Elegir otro método
                  </button>
              </div>
            </div>
          ) : (
            //  PASO 2: FORMULARIO CÓDIGO + NUEVA CLAVE 
            <div className="space-y-5 animate-fade-in" onKeyDown={(e) => { if (e.key === 'Enter') handleChangePassword(e as any); }}>
              <div>
                <label className={AppStyles.label}>Código de 6 dígitos</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className={`${LoginStyles.inputDark} text-center tracking-widest text-xl font-bold`}
                  autoFocus
                />
              </div>

              <div>
                <label className={AppStyles.label}>Nueva Contraseña</label>
                <Input
                  type="password"
                  placeholder="******"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className={LoginStyles.inputDark}
                />
              </div>

              {/* CAMPO DE CONFIRMACIÓN */}
              <div>
                <label className={AppStyles.label}>Confirmar Contraseña</label>
                <Input
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={LoginStyles.inputDark}
                />
              </div>

              {error && <div className={AppStyles.errorBox}>{error}</div>}

              <Button type="button" onClick={handleChangePassword} disabled={loading} className={`${AppStyles.btnPrimary} w-full`}>
                {loading ? "VALIDANDO..." : "CAMBIAR CONTRASEÑA"}
              </Button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-white/10 pt-4">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-all">
              ← Volver al Login
            </Link>
          </div>

        </Card>
      </div>
    </PageLayout>
  );
};