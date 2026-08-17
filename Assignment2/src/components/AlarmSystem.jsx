import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, Trash2 } from 'lucide-react';

export default function AlarmSystem({ currentTime }) {
  const [alarmList, setAlarmList] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleAddAlarm = (e) => {
    e.preventDefault();
    if (!timeInput) return;

    const item = {
      id: Date.now(),
      time: timeInput,
      tag: tagInput.trim() || 'Reminder',
      active: true,
    };

    setAlarmList([...alarmList, item]);
    setTimeInput('');
    setTagInput('');
  };

  const toggleAlarmStatus = (id) => {
    setAlarmList(
      alarmList.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const removeAlarm = (id) => {
    setAlarmList(alarmList.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const currentFormatted = currentTime.toTimeString().slice(0, 5);
    const seconds = currentTime.getSeconds();

    if (seconds === 0) {
      alarmList.forEach((alarm) => {
        if (alarm.active && alarm.time === currentFormatted) {
          alert(`⏰ AETHER ALERT: ${alarm.tag} (${alarm.time})`);
        }
      });
    }
  }, [currentTime, alarmList]);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
          Active Alarms
        </h3>
      </div>

      <form onSubmit={handleAddAlarm} className="flex flex-col gap-2 mb-6">
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          required
          className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
        />
        <input
          type="text"
          placeholder="Alarm Label (e.g. Daily Standup)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold p-2 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Save Alarm
        </button>
      </form>

      <div className="space-y-2">
        {alarmList.length === 0 ? (
          <p className="text-center font-mono text-xs text-slate-400 py-3">
            No alarms set
          </p>
        ) : (
          alarmList.map((alarm) => (
            <div
              key={alarm.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
            >
              <div>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                  {alarm.time}
                </span>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {alarm.tag}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAlarmStatus(alarm.id)}
                  className={`p-1.5 rounded-lg transition ${
                    alarm.active
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-slate-400 bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {alarm.active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeAlarm(alarm.id)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}