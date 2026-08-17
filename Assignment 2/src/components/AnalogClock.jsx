import React, { useEffect, useRef } from 'react';

export default function AnalogClock({ time, label = 'Local' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function renderClock() {
      ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Outer Dial Ring
      ctx.beginPath();
      ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);
      ctx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isDarkMode ? '#1e293b' : '#cbd5e1';
      ctx.stroke();

      // Hour Numbers
      for (let num = 1; num <= 12; num++) {
        let angle = (num * Math.PI) / 6;
        ctx.rotate(angle);
        ctx.translate(0, -radius + 26);
        ctx.rotate(-angle);
        ctx.fillStyle = isDarkMode ? '#94a3b8' : '#475569';
        ctx.font = '600 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(angle);
        ctx.translate(0, radius - 26);
        ctx.rotate(-angle);
      }

      // Time Calculations
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();

      // Hour Hand
      const hAngle = ((hours % 12) * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60);
      drawHand(ctx, hAngle, radius * 0.45, 5, isDarkMode ? '#f8fafc' : '#0f172a');

      // Minute Hand
      const mAngle = (minutes * Math.PI) / 30 + (seconds * Math.PI) / (30 * 60);
      drawHand(ctx, mAngle, radius * 0.65, 3, isDarkMode ? '#cbd5e1' : '#334155');

      // Second Hand
      const sAngle = (seconds * Math.PI) / 30;
      drawHand(ctx, sAngle, radius * 0.8, 2, '#0d9488');

      // Pivot Pin
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#0d9488';
      ctx.fill();
    }

    function drawHand(ctx, pos, length, width, color) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(0, 0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
    }

    ctx.save();
    renderClock();
    ctx.restore();

    return () => {
      ctx.translate(-radius, -radius);
    };
  }, [time]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">
        {label}
      </span>
      <canvas ref={canvasRef} width={220} height={220} />
    </div>
  );
}