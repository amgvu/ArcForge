import { forwardRef } from 'react';
import { inputContainerStyles, inputLabelStyles, inputStyles } from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const DSInput = forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => {
  return (
    <div className={inputContainerStyles(className)}>
      {label && <label className={inputLabelStyles}>{label}</label>}
      <input ref={ref} className={inputStyles} {...props} />
    </div>
  );
});

DSInput.displayName = 'Input';

export default DSInput;