import { Button } from '@headlessui/react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm font-medium shadow-inner shadow-white/10 focus:outline-none transition duration-150 ease-in-out ${
        disabled 
          ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' 
          : 'bg-[#9F6BF7] text-zinc-10 hover:bg-[#B088FF] hover:text-zinc-100 active:bg-zinc-100 active:text-zinc-950'
      }`}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;