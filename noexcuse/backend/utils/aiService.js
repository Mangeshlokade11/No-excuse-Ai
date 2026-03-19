const generateDailySummary = async (user, log, allHabits) => {
  const completed = log ? log.completedHabits.map(c => c.habit?.name || 'Unknown') : [];
  const missed    = allHabits.filter(h => !completed.includes(h.name)).map(h => h.name);
  const rate      = allHabits.length > 0 ? Math.round((completed.length / allHabits.length) * 100) : 0;

  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are an elite life coach analyzing habit data for ${user.name}.
Level: ${user.level}, XP: ${user.xp}, Streak: ${user.currentStreak} days
Completion: ${completed.length}/${allHabits.length} (${rate}%)
Completed: ${completed.join(', ') || 'None'}
Missed: ${missed.join(', ') || 'None'}
Respond ONLY with valid JSON: {"performance":"2-3 sentence analysis","advice":"2-3 actionable sentences","motivation":"1 powerful sentence"}`;
      const r = await client.chat.completions.create({ model:'gpt-3.5-turbo', messages:[{role:'user',content:prompt}], max_tokens:300, temperature:0.7 });
      return JSON.parse(r.choices[0].message.content.trim());
    } catch (err) { console.error('OpenAI error:', err.message); }
  }

  const perfs = [
    `You completed ${completed.length} of ${allHabits.length} habits today — a ${rate}% completion rate. ${rate>=80?'Outstanding consistency. Your future self thanks you.':rate>=50?'Solid effort. Half the battle is showing up.':'Every habit missed is a vote against the person you want to become.'}`,
    `${user.name}, Day ${user.currentStreak} of your streak. ${rate}% execution today. ${completed.length>0?'You showed up. That\'s what separates winners.':'Tomorrow is a clean slate — use it.'}`,
  ];
  const advices = [
    missed.length > 0 ? `Focus on "${missed[0]}" first tomorrow morning — tackle your hardest habit before checking your phone.` : 'Perfect execution today. Now set a harder challenge for tomorrow to keep growing.',
    `Habit stacking works: complete habits in the same sequence daily until the chain becomes automatic.`
  ];
  const motivations = [
    "Your future self is being built one habit at a time — make today's bricks count.",
    "The secret of your future is hidden in your daily routine. Keep building.",
    "Discipline is the bridge between goals and accomplishment.",
    "Every morning you wake up is a new chance to become who you're supposed to be."
  ];
  return {
    performance: perfs[Math.floor(Math.random()*perfs.length)],
    advice:      advices[Math.floor(Math.random()*advices.length)],
    motivation:  motivations[Math.floor(Math.random()*motivations.length)]
  };
};

module.exports = { generateDailySummary };
