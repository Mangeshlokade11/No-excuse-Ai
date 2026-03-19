const cron     = require('node-cron');
const User     = require('../models/User');
const Habit    = require('../models/Habit');
const DailyLog = require('../models/DailyLog');
const { generateDailySummary }  = require('../utils/aiService');
const { sendDailySummaryEmail } = require('../emails/mailer');

const start = () => {
  cron.schedule('30 21 * * *', async () => {
    console.log('⏰ Daily summary cron running…');
    const today = new Date().toISOString().split('T')[0];
    let sent = 0, failed = 0;
    try {
      const users = await User.find({ emailNotifications: true });
      for (const user of users) {
        try {
          const allHabits = await Habit.find({ user: user._id, isActive: true });
          if (!allHabits.length) continue;
          const log     = await DailyLog.findOne({ user: user._id, date: today }).populate('completedHabits.habit');
          const summary = await generateDailySummary(user, log, allHabits);
          if (log) { log.aiSummary = { ...summary, generatedAt: new Date() }; await log.save(); }
          await sendDailySummaryEmail(user, log, summary, allHabits);
          sent++;
        } catch (err) { console.error(`❌ ${user.email}:`, err.message); failed++; }
      }
      console.log(`✅ Cron done — sent:${sent} failed:${failed}`);
    } catch (err) { console.error('❌ Cron fatal:', err); }
  });
  console.log('⏰ Cron scheduled: 9:30 PM daily');
};

module.exports = { start };
