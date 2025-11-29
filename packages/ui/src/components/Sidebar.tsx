import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  className = '',
  width = '250px'
}) => {
  return (
    <aside 
      className={`h-full bg-gray-50 border-r border-gray-200 overflow-y-auto ${className}`}
      style={{ width }}
    >
      {children}
    </aside>
  );
};

interface SidebarItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  active = false,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
