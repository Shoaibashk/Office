import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tooltip?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  children,
  active = false,
  tooltip,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        active ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      } ${className}`}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  );
};

export const ToolbarDivider: React.FC = () => {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
};
