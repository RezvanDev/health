import React, { useState } from 'react';
import { Menu, Home, ListTodo, Users, Trophy, User, Bell, BookOpen, Settings } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Боковое меню */}
      <aside className="hidden md:flex w-64 flex-col fixed h-full bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Путь Развития</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Home size={20} />} label="Главная" active />
          <NavItem icon={<ListTodo size={20} />} label="Задачи" />
          <NavItem icon={<Users size={20} />} label="Сообщество" />
          <NavItem icon={<Trophy size={20} />} label="Достижения" />
          <NavItem icon={<BookOpen size={20} />} label="Рекомендации" />
          <NavItem icon={<Bell size={20} />} label="Уведомления" />
          <NavItem icon={<User size={20} />} label="Профиль" />
        </nav>
      </aside>

      {/* Мобильная шапка */}
      <div className="md:hidden fixed w-full bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            className="p-1 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Путь Развития</h1>
          <button className="p-1 rounded-lg hover:bg-gray-100">
            <Settings size={24} />
          </button>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200">
            <nav className="p-4 space-y-2">
              <NavItem icon={<Home size={20} />} label="Главная" active />
              <NavItem icon={<ListTodo size={20} />} label="Задачи" />
              <NavItem icon={<Users size={20} />} label="Сообщество" />
              <NavItem icon={<Trophy size={20} />} label="Достижения" />
              <NavItem icon={<BookOpen size={20} />} label="Рекомендации" />
              <NavItem icon={<Bell size={20} />} label="Уведомления" />
              <NavItem icon={<User size={20} />} label="Профиль" />
            </nav>
          </div>
        )}
      </div>

      {/* Основной контент */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Мобильная навигация */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="flex justify-around p-2">
          <MobileNavItem icon={<Home size={20} />} label="Главная" />
          <MobileNavItem icon={<ListTodo size={20} />} label="Задачи" />
          <MobileNavItem icon={<Users size={20} />} label="Сообщество" />
          <MobileNavItem icon={<User size={20} />} label="Профиль" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}