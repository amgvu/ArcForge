import { Button } from '@headlessui/react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ButtonComponent: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md bg-zinc-600 py-1.5 px-3 text-sm font-medium text-zinc-10 shadow-inner shadow-white/10 focus:outline-none transition duration-150 ease-in-out hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-100 active:text-zinc-950"
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;