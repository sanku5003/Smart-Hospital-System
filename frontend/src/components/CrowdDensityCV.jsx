import React, { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function CrowdDensityCV() {
  const [digitalQueueCount, setDigitalQueueCount] = useState(14);
  const [detectedPhysicalCount, setDetectedPhysicalCount] = useState(16);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Simulated waiting room CCTV background and dynamic bounding boxes
    let people = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * (canvas.width - 60) + 30,
      y: Math.random() * (canvas.height - 60) + 30,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      id: `P-${100 + i}`,
      hasToken: i < 14
    }));

    const render = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waiting room grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw CCTV overlay header
      ctx.fillStyle = '#10b981';
      ctx.font = '11px sans-serif';
      ctx.fillText(`● REC [LIVE FEED] - WAITING ROOM CAM 04 - AI COMPUTER VISION`, 15, 25);

      // Update and draw bounding boxes for each person
      people.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 20 || p.x > canvas.width - 40) p.dx *= -1;
        if (p.y < 40 || p.y > canvas.height - 40) p.dy *= -1;

        // Bounding box
        ctx.strokeStyle = p.hasToken ? '#14b8a6' : '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, 35, 50);

        // Person Head dot
        ctx.fillStyle = p.hasToken ? '#2dd4bf' : '#fb7185';
        ctx.beginPath();
        ctx.arc(p.x + 17.5, p.y + 15, 8, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = p.hasToken ? '#ccfbf1' : '#ffe4e6';
        ctx.font = '9px sans-serif';
        ctx.fillText(p.hasToken ? `TOKEN DETECTED` : `NO TOKEN!`, p.x - 5, p.y - 5);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const disparity = detectedPhysicalCount - digitalQueueCount;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Computer Vision Crowd Density Cross-Check</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              CCTV Crowd Density vs Digital Queue Disparity Checker
            </h2>
            <p className="text-xs text-slate-400">
              Validates that physical waiting room crowd matches digital token count to prevent un-ticketed crowding.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
            <span className="text-xs text-slate-400 font-semibold">Digital Queue Count</span>
            <div className="text-2xl font-bold text-teal-400 mt-1">{digitalQueueCount} Patients</div>
            <p className="text-[11px] text-slate-500">Active tokens checked in</p>
          </div>

          <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
            <span className="text-xs text-slate-400 font-semibold">CCTV CV Physical Count</span>
            <div className="text-2xl font-bold text-purple-400 mt-1">{detectedPhysicalCount} Persons</div>
            <p className="text-[11px] text-slate-500">AI Bounding Box detections</p>
          </div>

          <div className="p-4 rounded-xl bg-darkbg border border-darkborder">
            <span className="text-xs text-slate-400 font-semibold">Disparity Status</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">+{disparity} Unregistered</div>
            <p className="text-[11px] text-rose-400/80 font-medium">⚠️ 2 physical visitors have no token</p>
          </div>
        </div>

        {/* CCTV Canvas Viewport */}
        <div className="relative rounded-2xl overflow-hidden border border-darkborder bg-black flex justify-center">
          <canvas ref={canvasRef} width={800} height={380} className="w-full h-auto max-h-[420px]" />
        </div>
      </div>
    </div>
  );
}
