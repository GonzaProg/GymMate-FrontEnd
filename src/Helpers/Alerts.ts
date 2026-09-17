import Swal from 'sweetalert2';

const commonCustomClass = {
    popup: 'border border-gray-700 shadow-2xl rounded-2xl',
    container: 'z-[10000]' // Asegura que las alertas estén por encima de otros elementos
};

const baseMixin = Swal.mixin({
    background: '#1f2937',
    color: '#e5e7eb',
    customClass: commonCustomClass,
    buttonsStyling: false
});

export const showSuccess = (message: string) => {
    return baseMixin.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: message,
        confirmButtonText: 'Aceptar',
        customClass: {
            ...commonCustomClass,
            confirmButton: 'bg-green-500/20 text-green-400 border border-green-500/80 hover:bg-green-500/30 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm'
        }
    });
};

export const showError = (message: string) => {
    return baseMixin.fire({
        icon: 'error',
        title: 'Ocurrió un error',
        text: message,
        confirmButtonText: 'Entendido',
        customClass: {
            ...commonCustomClass,
            confirmButton: 'bg-red-500/20 text-red-400 border border-red-500/80 hover:bg-red-500/30 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm'
        }
    });
};

export const showConfirmDelete = async (title: string, text: string) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#e5e7eb',
        customClass: {
            ...commonCustomClass,
            actions: 'flex gap-4',
            confirmButton: 'bg-red-900/30 text-red-400 border border-red-500/80 hover:bg-red-500/30 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm',
            cancelButton: 'bg-[#1a1a1a] text-white hover:bg-white/10 border border-white/10 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm'
        },
        buttonsStyling: false
    });
    return result;
};

export const showConfirmSuccess = async (title: string, text: string) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Confirmar',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#e5e7eb',
        customClass: {
            ...commonCustomClass,
            actions: 'flex gap-4',
            confirmButton: 'bg-green-500/20 text-green-400 border border-green-500/80 hover:bg-green-500/30 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm',
            cancelButton: 'bg-[#1a1a1a] text-white hover:bg-white/10 border border-white/10 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm'
        },
        buttonsStyling: false
    });
    return result;
};

export const showPasswordPrompt = async (title: string, text: string) => {
    return Swal.fire({
        title: title,
        text: text,
        input: 'password',
        inputPlaceholder: 'Ingrese su contraseña',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#e5e7eb',
        customClass: {
            ...commonCustomClass,
            actions: 'flex gap-4',
            confirmButton: 'bg-blue-500/20 text-blue-400 border border-blue-500/80 hover:bg-blue-500/30 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm',
            cancelButton: 'bg-[#1a1a1a] text-white hover:bg-white/10 border border-white/10 font-bold py-3 px-6 rounded-xl transition-colors shadow-sm',
            input: 'bg-black/40 border border-white/10 text-white rounded-xl focus:border-blue-500/50 transition-colors px-4 py-3 text-center !w-3/4 mx-auto'
        },
        buttonsStyling: false,
        inputValidator: (value) => {
            if (!value) {
                return '¡Necesitas escribir la contraseña!';
            }
            return null;
        }
    });
};

export const showEditNotePrompt = async (conceptoActual: string) => {
    return Swal.fire({
        title: 'Modificar Nota',
        html: `
            <div style="text-align: left; margin-top: 10px;">
                <label style="color: #9ca3af; font-size: 14px; margin-bottom: 5px; display: block;">Concepto</label>
                <textarea id="swal-input-concepto" class="swal2-textarea" style="width: 100%; margin: 0; box-sizing: border-box;">${conceptoActual}</textarea>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        background: '#1f2937',
        color: '#e5e7eb',
        customClass: commonCustomClass,
        preConfirm: () => {
            const concepto = (document.getElementById('swal-input-concepto') as HTMLTextAreaElement).value;
            if (!concepto.trim()) {
                Swal.showValidationMessage('El concepto no puede estar vacío');
                return false;
            }
            return { concepto };
        }
    });
};