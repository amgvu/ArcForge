export const inputContainerStyles = (className?: string) => {
    return `flex flex-col space-y-1 ${className || ''}`;
  };
  
  export const inputLabelStyles = 'text-md font-medium text-neutral-100';
  
  export const inputStyles =
    'py-1 cursor-pointer pl-2 focus:cursor-auto transition-all max-w-full text-md rounded-lg text-neutral-100 border-transparent shadow-white/10 focus:outline-hidden focus:ring-1 focus:ring-neutral-100 transition duration-150 ease-in-out w-full';