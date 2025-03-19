import React, { useState } from 'react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Are you sure you want to proceed?", 
  title = "Confirmation", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default" 
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          header: 'bg-primary-100',
          button: 'bg-primary-500 hover:bg-primary-600 text-white'
        };
      case 'warning':
        return {
          header: 'bg-primary-50',
          button: 'bg-primary-400 hover:bg-primary-500 text-white'
        };
      case 'success':
        return {
          header: 'bg-accent-50',
          button: 'bg-accent-400 hover:bg-accent-500 text-white'
        };
      default:
        return {
          header: 'bg-neutral-50',
          button: 'bg-secondary-500 hover:bg-secondary-600 text-white'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className={`px-6 py-4 ${colors.header} rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-base text-neutral-700">{message}</p>
        </div>
        
        <div className="bg-neutral-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-md ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog