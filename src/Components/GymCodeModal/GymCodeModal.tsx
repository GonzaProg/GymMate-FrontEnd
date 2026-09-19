import { useState, useEffect } from "react";
import { Card } from "../UI/Card";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { AppStyles } from "../../Styles/AppStyles";
import { LoginStyles } from "../../Styles/LoginStyles";
import { useGymConfig } from "../../Context/GymConfigContext";

interface GymCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeChange: (newCode: string) => void;
}

export const GymCodeModal = ({ isOpen, onClose, onCodeChange }: GymCodeModalProps) => {
  const { gymCode } = useGymConfig();
  const [tempCode, setTempCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTempCode(gymCode || "");
    }
  }, [isOpen, gymCode]);

  const handleSave = () => {
    if (tempCode.trim()) {
      onCodeChange(tempCode.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setTempCode(gymCode || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-[#0071BC]">Gym</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#d3932b]">Mate</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Configura el código de tu gimnasio para acceder a las funciones específicas
            </p>
          </div>

          {/* Current Code Display */}
          {gymCode && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Código actual:</p>
              <p className="text-green-400 font-mono font-semibold">{gymCode}</p>
            </div>
          )}

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nuevo Código
            </label>
            <Input
              type="text"
              placeholder="Ingresa el código de tu gimnasio"
              value={tempCode}
              onChange={(e) => setTempCode(e.target.value.toUpperCase())}
              className={`${LoginStyles.inputDark} uppercase`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCancel}
              className={AppStyles.btnSecondary}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!tempCode.trim()}
              className={AppStyles.btnPrimary}
            >
              Guardar Código
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
