export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none';
  const variants = {
    primary: 'bg-[#1f3c88] text-white hover:bg-blue-900 active:scale-95',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95',
    danger: 'bg-[#d92d20] text-white hover:bg-red-700 active:scale-95',
    ghost: 'bg-transparent text-[#1f3c88] hover:bg-blue-50 active:scale-95',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
