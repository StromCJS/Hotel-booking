import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const AnimatedButton = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: AnimatedButtonProps) => {
  const baseStyles = `
    relative px-8 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out
    overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[#1A2517] text-white border-2 border-[#1A2517]
      hover:bg-transparent hover:text-[#1A2517]
      before:absolute before:inset-0 before:bg-white before:translate-x-[-100%]
      before:transition-transform before:duration-300 before:ease-in-out
      hover:before:translate-x-0
    `,
    secondary: `
      bg-[#ACC8A2] text-[#1A2517] border-2 border-[#ACC8A2]
      hover:bg-transparent hover:border-[#ACC8A2]
      before:absolute before:inset-0 before:bg-white before:translate-x-[-100%]
      before:transition-transform before:duration-300 before:ease-in-out
      hover:before:translate-x-0
    `,
    outline: `
      bg-transparent text-[#1A2517] border-2 border-[#1A2517]
      hover:bg-[#1A2517] hover:text-white
      before:absolute before:inset-0 before:bg-[#1A2517] before:translate-y-[100%]
      before:transition-transform before:duration-300 before:ease-in-out
      hover:before:translate-y-0
    `
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
