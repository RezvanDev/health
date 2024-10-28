import React, { useState, useEffect } from 'react';
import { Home, ListTodo, Users, Trophy, User } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { Community } from './components/Community';
import { Achievements } from './components/achievements/Achievements';
import { Profile } from './components/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Добавляем эффект для инициализации Telegram WebApp
  useEffect(() => {
    // Инициализируем Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      // Расширяем окно на весь экран
      window.Telegram.WebApp.expand();

      // Устанавливаем тему
      document.documentElement.className = window.Telegram.WebApp.colorScheme;
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'community':
        return <Community />;
      case 'achievements':
        return <Achievements />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Основной контент */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Нижняя навигация в стиле Telegram */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--tg-theme-bg-color)] border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <NavButton
              icon={<Home size={24} />}
              label="Главная"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavButton
              icon={<ListTodo size={24} />}
              label="Задачи"
              active={activeTab === 'tasks'}
              onClick={() => setActiveTab('tasks')}
            />
            <NavButton
              icon={<Users size={24} />}
              label="Сообщество"
              active={activeTab === 'community'}
              onClick={() => setActiveTab('community')}
            />
            <NavButton
              icon={<Trophy size={24} />}
              label="Достижения"
              active={activeTab === 'achievements'}
              onClick={() => setActiveTab('achievements')}
            />
            <NavButton
              icon={<User size={24} />}
              label="Профиль"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-1 p-1 transition-colors ${
        active ? 'text-[var(--tg-theme-button-color)]' : 'text-[var(--tg-theme-hint-color)]'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default App;