// components/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function Sidebar() {
  const { pathname } = useRouter();
  const [sidebarWidth, setSidebarWidth] = useState(224);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const sidebarRef = useRef(null);
  
  const linkBase = `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 
    transform hover:scale-[1.02] hover:translate-x-1 hover:shadow-lg
    active:scale-[0.98] relative overflow-hidden group
  `;
  const active = "bg-gray-800 text-white shadow-lg border-r-2 border-blue-500";
  const inactive = "text-gray-300 hover:bg-gray-800/50 hover:text-white";

  // Navigation items with iconify icons
  const navItems = [
    { 
      href: "/monitoring", 
      label: "Monitoring", 
      icon: "material-symbols:home-rounded",
      description: "Halaman utama aplikasi"
    },
    { 
      href: "/profile", 
      label: "Profile", 
      icon: "material-symbols:person-rounded",
      description: "Pengaturan profil pengguna"
    }
  ];

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 500) {
        setSidebarWidth(newWidth);
        setIsCollapsed(newWidth < 180);
      }
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleDoubleClickResize = () => {
    const newWidth = sidebarWidth < 200 ? 280 : 180;
    setSidebarWidth(newWidth);
    setIsCollapsed(newWidth < 180);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleMinimize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentWidth = isMinimized ? 80 : sidebarWidth;

  return (
    <>
      {/* Backdrop for mobile */}
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40 transition-opacity duration-300"
          onClick={toggleMinimize}
        />
      )}
      
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 bottom-0 bg-gray-900 text-gray-100 flex flex-col 
          select-none z-50 transition-all duration-300 ease-in-out
          ${isMinimized ? 'shadow-2xl' : 'shadow-xl'}
          border-r border-gray-800
        `}
        style={{ width: `${currentWidth}px` }}
        onMouseEnter={() => isMinimized && setIsMinimized(false)}
        onMouseLeave={() => currentWidth < 120 && setIsMinimized(true)}
      >
        {/* Header with animation */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-50" />
          <div className="relative px-6 py-5 flex items-center justify-between">
            <h1 className={`
              font-bold transition-all duration-300 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
              ${isCollapsed || isMinimized ? 'text-lg opacity-0 scale-75' : 'text-2xl opacity-100 scale-100'}
            `}>
              {isCollapsed || isMinimized ? "M" : "Menu"}
            </h1>
            
            {/* Toggle button with iconify */}
            <button
              onClick={toggleMinimize}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
              title={isMinimized ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            >
              <Icon 
                icon={isMinimized ? "material-symbols:chevron-right-rounded" : "material-symbols:chevron-left-rounded"} 
                className="w-4 h-4 text-gray-400 transition-transform duration-300" 
              />
            </button>
          </div>
        </div>

        {/* Navigation with enhanced interactions */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item, index) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`
                    ${linkBase} 
                    ${isActive ? active : inactive}
                    ${hoveredItem === index ? 'bg-gray-800/70' : ''}
                  `}
                >
                  {/* Icon with iconify */}
                  <Icon 
                    icon={item.icon} 
                    className={`
                      w-5 h-5 transition-all duration-300 
                      ${isActive ? 'scale-110 drop-shadow-lg text-blue-400' : 'group-hover:scale-110 group-hover:text-blue-300'}
                      ${isCollapsed || isMinimized ? 'mx-auto' : ''}
                    `}
                  />
                  
                  {/* Label with slide animation */}
                  <span className={`
                    font-medium transition-all duration-300
                    ${isCollapsed || isMinimized ? 'opacity-0 -translate-x-4 absolute' : 'opacity-100 translate-x-0'}
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Link>
                
                {/* Tooltip for collapsed state */}
                {(isCollapsed || isMinimized) && hoveredItem === index && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50">
                    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap animate-in slide-in-from-left-2 duration-200">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                      {/* Arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with status indicator */}
        <div className="p-4 border-t border-gray-800">
          <div className={`
            flex items-center gap-2 text-xs text-gray-500 transition-all duration-300
            ${isCollapsed || isMinimized ? 'justify-center opacity-0' : 'opacity-100'}
          `}>
            <Icon icon="material-symbols:circle" className="w-2 h-2 text-green-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Enhanced resize handle */}
        {!isMinimized && (
          <div
            className={`
              absolute right-0 top-0 bottom-0 w-1 cursor-col-resize 
              bg-gray-700 hover:bg-blue-500 active:bg-blue-600 
              transition-all duration-200 hover:w-2 group
              ${isResizing ? 'bg-blue-600 w-2' : ''}
            `}
            onMouseDown={startResizing}
            onDoubleClick={handleDoubleClickResize}
            title="Drag to resize, double-click to auto-size"
          >
            {/* Visual indicator with iconify */}
            <Icon 
              icon="material-symbols:drag-indicator" 
              className="absolute inset-y-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 text-gray-500 group-hover:text-white transition-colors duration-200 rotate-90" 
            />
          </div>
        )}

        {/* Loading bar animation on resize */}
        {isResizing && (
          <div className="absolute top-0 left-0 right-1 h-0.5 bg-blue-500 animate-pulse" />
        )}
      </aside>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
        Press Ctrl+B to toggle
      </div>
    </>
  );
}