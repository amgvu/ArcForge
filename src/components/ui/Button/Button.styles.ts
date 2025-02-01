export const buttonStyles = (disabled: boolean) => {
    const baseStyles =
      'inline-flex items-center gap-2 rounded-lg py-1.5 px-3 mb-6 text-sm font-medium shadow-inner shadow-white/10 focus:outline-hidden transition duration-150 ease-in-out';
  
    const disabledStyles = 'bg-neutral-800 text-neutral-400 border border-neutral-600 cursor-not-allowed'
    const enabledStyles =
      'bg-neutral-800 border border-neutral-500 text-neutral-100 cursor-pointer hover:bg-neutral-700 hover:text-neutral-100 active:bg-neutral-100 active:text-neutral-950';
  
    return `${baseStyles} ${disabled ? disabledStyles : enabledStyles}`;
  };