import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { DSInput } from '@/components'
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DSInputDialogProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  onGenerate: (input: string) => void;
  onClose: () => void;
}

export const DSInputDialog = ({ 
  isOpen, 
  title, 
  placeholder = "Enter your text...",
  initialValue = "",
  onGenerate, 
  onClose 
}: DSInputDialogProps) => {
  const [input, setInput] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      await onGenerate(input);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      as="div" 
      className="relative z-10 focus:outline-none" 
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-10 w-screen overflow-y-auto"
      >
        <div className="flex min-h-full bg-black/10 items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <DialogTitle as="h3" className="font-medium text-white">
              {title}
            </DialogTitle>
            
            <div className="mt-4">
              <DSInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="bg-neutral-700 rounded-lg"
                disabled={isLoading}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-neutral-700 py-1.5 px-3 text-sm text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-neutral-700"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-neutral-700 py-1.5 px-3 text-sm text-white shadow-inner shadow-white/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed data-[hover]:bg-neutral-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-neutral-700"
                onClick={handleGenerate}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default DSInputDialog;