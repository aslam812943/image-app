import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20 transform animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            {confirmLabel}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
