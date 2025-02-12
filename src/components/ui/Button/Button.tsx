import { Button } from "@headlessui/react";
import { buttonStyles } from "./Button.styles";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const DSButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonStyles(disabled)} ${className}`}
    >
      {children}
    </Button>
  );
};

export default DSButton;
