import { useState } from 'react';
import { DSButton, DSInput} from '@/components'

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

  const closeDialog = () => {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.close();
    onClose();
  };

  return (
    <>
      <DSButton
        className="" 
        onClick={() => {
          const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
          dialog.showModal();
        }}
      >
        Open Modal
        </DSButton>
      <dialog 
        id="my_modal_1" 
        className="modal" 
        open={isOpen}
        onClose={closeDialog}
      >
        <div className="modal-box bg-neutral-800">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="mt-4">
            <DSInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-neutral-700"
              disabled={isLoading}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <DSButton
              className=""
              onClick={closeDialog}
            >
              Cancel
            </DSButton>
            <DSButton
              className=""
              onClick={handleGenerate}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </DSButton>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DSInputDialog;

