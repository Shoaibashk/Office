import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {header && (
        <header className="flex-shrink-0 bg-white border-b border-gray-200">
          {header}
        </header>
      )}
      <div className="flex-1 flex overflow-hidden">
        {sidebar}
        <main className="flex-1 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};
