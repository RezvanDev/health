import React from 'react';
import { Users, MessageSquare, Award, ThumbsUp, Clock, Target, Calendar } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  comments: number;
  likes: number;
  reward: string;
  image: string;
  duration: string;
  startDate: string;
  type: 'weekly' | 'monthly';
  xp: number;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: '30 дней медитации',
    description: 'Присоединяйтесь к челленджу по ежедневной медитации. Развивайте осознанность и улучшайте концентрацию.',
    participants: 1234,
    comments: 89,
    likes: 432,
    reward: 'Золотой значок медитации',
    image: '/api/placeholder/800/400',
    duration: '30 дней',
    startDate: '1 апреля',
    type: 'monthly',
    xp: 1000
  },
  {
    id: '2',
    title: 'Книжный марафон',
    description: 'Читайте по одной книге в неделю вместе с сообществом. Обсуждайте и делитесь впечатлениями.',
    participants: 856,
    comments: 156,
    likes: 367,
    reward: 'Значок книжного червя',
    image: '/api/placeholder/800/400',
    duration: '7 дней',
    startDate: '5 апреля',
    type: 'weekly',
    xp: 500
  }
];

export function Community() {
  const [activeTab, setActiveTab] = React.useState<'weekly' | 'monthly'>('weekly');

  const filteredChallenges = challenges.filter(
    challenge => challenge.type === activeTab
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Челленджи</h1>
        <div className="flex items-center space-x-4">
          {/* Переключатель */}
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'weekly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Недельные
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Месячные
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="aspect-[2/1] relative overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          <p className="mt-2 text-white/80 text-sm line-clamp-2">{challenge.description}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Информация о челлендже */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Участники</div>
            <div className="font-semibold flex items-center justify-center text-blue-600">
              <Users size={16} className="mr-1" />
              {challenge.participants}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Длительность</div>
            <div className="font-semibold flex items-center justify-center text-purple-600">
              <Clock size={16} className="mr-1" />
              {challenge.duration}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Награда</div>
            <div className="font-semibold flex items-center justify-center text-amber-500">
              <Award size={16} className="mr-1" />
              {challenge.xp} XP
            </div>
          </div>
        </div>

        {/* Детали и дата */}
        <div className="flex justify-between items-center text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <Calendar size={16} className="mr-1" />
              Старт: {challenge.startDate}
            </div>
            <div className="flex items-center text-gray-500">
              <Target size={16} className="mr-1" />
              {challenge.reward}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gray-500">
              <MessageSquare size={16} className="mr-1" />
              {challenge.comments}
            </span>
            <span className="flex items-center text-gray-500">
              <ThumbsUp size={16} className="mr-1" />
              {challenge.likes}
            </span>
          </div>
        </div>

        {/* Кнопка действия */}
        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
          <Users size={20} />
          <span>Присоединиться к челленджу</span>
        </button>
      </div>
    </div>
  );
}

export default Community;