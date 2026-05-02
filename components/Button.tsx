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
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
    secondary: "bg-slate-800 text-white",
    outline: "border-2 border-slate-200 text-slate-800 bg-transparent",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800"
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
