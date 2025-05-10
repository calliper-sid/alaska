import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X } from 'lucide-react';

const Toast = () => {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  const { message, type } = toast;

  const toastClasses = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`${toastClasses[type]} text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between max-w-md`}>
        <p>{message}</p>
        <button 
          onClick={hideToast}
          className="ml-4 text-white focus:outline-none"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;