export const buttonStyles = (disabled: boolean) => {
    const baseStyles =
      'inline-flex items-center gap-2 rounded-lg py-1.5 px-3 mb-6 text-sm font-medium shadow-inner shadow-white/10 focus:outline-hidden transition duration-150 ease-in-out';
  
    const disabledStyles = 'bg-zinc-900 text-zinc-400 cursor-not-allowed';
    const enabledStyles =
      'bg-neutral-100 text-neutral-950 hover:bg-green-400 hover:text-zinc-100 active:bg-zinc-100 active:text-zinc-950';
  
    return `${baseStyles} ${disabled ? disabledStyles : enabledStyles}`;
  };