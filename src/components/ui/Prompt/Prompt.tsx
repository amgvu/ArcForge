import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DSPromptProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DSPrompt = ({ isOpen, title, message, onConfirm, onCancel }: DSPromptProps) => (
  <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={onCancel}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2}}
      className="fixed inset-0 z-50 backdrop-blur-sm"
    >
      <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-neutral-900 p-6 border border-neutral-800 shadow-xl">
            <DialogTitle as="h3" className="text-lg font-semibold text-white">
              {title}
            </DialogTitle>
            <div className="mt-4 text-neutral-300">{message}</div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                className="px-4 py-2 text-sm font-medium cursor-pointer text-neutral-300 hover:text-white transition-colors"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          </DialogPanel>
      </div>
    </motion.div>
  </Dialog>
);

export default DSPrompt;

