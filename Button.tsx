import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 text-center flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#1a160f] text-[#f5f2ed] border border-[#332c1e] shadow-xl hover:bg-[#332c1e] shadow-[#1a160f]/20 uppercase tracking-widest text-xs",
    secondary: "bg-[#f5f2ed] text-[#1a160f] border border-[#d1cbb8] shadow-md hover:bg-[#e6e2d6] uppercase tracking-widest text-xs",
    outline: "border border-[#332c1e] text-[#1a160f] bg-transparent uppercase tracking-widest text-xs",
    ghost: "bg-transparent text-slate-500 hover:text-[#1a160f] uppercase tracking-widest text-xs"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};