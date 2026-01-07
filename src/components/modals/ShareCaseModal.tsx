import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Loader2 } from 'lucide-react';
import { procesoJudicialAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ShareCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  caseNumber?: string;
}

export const ShareCaseModal: React.FC<ShareCaseModalProps> = ({
  isOpen,
  onClose,
  caseId,
  caseNumber,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleShare = async () => {
    if (!recipientEmail) {
      toast.error('Por favor ingrese un correo electrónico');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Por favor ingrese un correo electrónico válido');
      return;
    }

    setLoading(true);
    try {
      const result = await procesoJudicialAPI.shareCase(
        caseId,
        recipientEmail,
        message || undefined
      );

      toast.success(result.message || 'Caso compartido exitosamente');
      
      // Reset form and close modal
      setRecipientEmail('');
      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Error sharing case:', error);
      const errorMsg = error.response?.data?.message || 'Error al compartir el caso';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartir Caso">
      <div className="space-y-6">
        {/* Case Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Caso:</span> {caseNumber || caseId}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            <span className="font-medium">Enviado por:</span> {currentUser.email || 'Usuario actual'}
          </p>
        </div>

        {/* Recipient Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo del destinatario <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="ejemplo@correo.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100"
            disabled={loading}
          />
        </div>

        {/* Optional Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensaje opcional
          </label>
          <textarea
            placeholder="Agregue un mensaje para el destinatario..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleShare}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compartiendo...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Compartir Caso
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
