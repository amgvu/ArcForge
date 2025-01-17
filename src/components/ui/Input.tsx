import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <label className="text-sm font-medium text-zinc-100">{label}</label>}
      <input
        ref={ref}
        className="rounded-md bg-zinc-700 py-2.5 px-3 text-sm text-white shadow-inner shadow-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-100 transition duration-150 ease-in-out w-full"
        {...props}
      />
    </div>
  );
});

InputComponent.displayName = 'Input';

export default InputComponent;