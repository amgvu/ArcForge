import { forwardRef } from 'react';
import { inputContainerStyles, inputLabelStyles, inputStyles } from '../Input/Input.styles';
import { useDraggable } from '@dnd-kit/core';

interface DraggableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const DSDraggableInput = forwardRef<HTMLInputElement, DraggableInputProps>(({ label, className, ...props }, ref) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'draggable-input' });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={inputContainerStyles(className)}
      {...listeners}
      {...attributes}
    >
      {label && <label className={inputLabelStyles}>{label}</label>}
      <input ref={ref} className={inputStyles} {...props} />
    </div>
  );
});

DSDraggableInput.displayName = 'DSDraggableInput';

export default DSDraggableInput;
