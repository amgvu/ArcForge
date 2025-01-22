import { Button } from '@headlessui/react';
import { buttonStyles } from './Button.styles';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({ children, onClick, disabled = false }) => {
  return (
    <Button onClick={onClick} disabled={disabled} className={buttonStyles(disabled)}>
      {children}
    </Button>
  );
};

export default ButtonComponent;