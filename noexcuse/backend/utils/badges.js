const User = require('../models/User');

const BADGES = [
  { name:'First Step',      description:'Complete your first habit',     icon:'🌱', condition: u => u.totalHabitsCompleted >= 1 },
  { name:'Week Warrior',    description:'7-day streak',                  icon:'🔥', condition: u => u.currentStreak >= 7 },
  { name:'Fortnight Force', description:'14-day streak',                 icon:'⚡', condition: u => u.currentStreak >= 14 },
  { name:'Month Master',    description:'30-day streak',                 icon:'👑', condition: u => u.currentStreak >= 30 },
  { name:'Century Club',    description:'100 habits completed',          icon:'💯', condition: u => u.totalHabitsCompleted >= 100 },
  { name:'Rising Star',     description:'Reach Level 5',                 icon:'⭐', condition: u => u.level >= 5 },
  { name:'Elite Performer', description:'Reach Level 10',                icon:'🏆', condition: u => u.level >= 10 },
  { name:'Iron Discipline', description:'90%+ discipline score',         icon:'🦾', condition: u => u.disciplineScore >= 90 },
  { name:'Connector',       description:'Follow 5 users',                icon:'🤝', condition: u => (u.following?.length||0) >= 5 },
  { name:'Half Century',    description:'50-day streak',                 icon:'🎯', condition: u => u.currentStreak >= 50 },
  { name:'Legend',          description:'Reach Level 20',                icon:'🌟', condition: u => u.level >= 20 },
  { name:'1K Club',         description:'1000 total XP',                 icon:'💎', condition: u => u.xp >= 1000 },
];

const checkAndAwardBadges = async (user, habit) => {
  const newBadges = [];
  for (const badge of BADGES) {
    const has = user.badges.some(b => b.name === badge.name);
    if (!has && badge.condition(user)) {
      user.badges.push({ name: badge.name, description: badge.description, icon: badge.icon, earnedAt: new Date() });
      newBadges.push(badge);
    }
  }
  if (newBadges.length > 0) await user.save();
  return newBadges;
};

module.exports = { checkAndAwardBadges, BADGES };
