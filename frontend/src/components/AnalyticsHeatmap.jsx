import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Wind,
  Sun,
  AlertOctagon,
  Sparkles,
  Users,
  Brain
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { apiRequest } from '../utils/api';

export default function AnalyticsHeatmap() {
  const [season, setSeason] = useState('Monsoon');
  const [pollutionAQI, setPollutionAQI] = useState(240);
  const [festivalNear, setFestivalNear] = useState(true);
  const [outbreakAlert, setOutbreakAlert] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPredictiveData = async () => {
    setLoading(true);
    const data = await apiRequest(
      `/analytics/predictive?season=${season}&pollutionAQI=${pollutionAQI}&festivalNear=${festivalNear}&outbreakAlert=${outbreakAlert}`
    );
    if (data.success) {
      setAnalytics(data.analytics);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictiveData();
  }, [season, pollutionAQI, festivalNear, outbreakAlert]);

  return (
    <div className="space-y-6">
      {/* Top Header & Environmental Factor Simulator */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-darkborder pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Predictive Intelligence Engine</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">
              AI Time-Series Inflow & Resource Demand Forecasting
            </h2>
            <p className="text-xs text-slate-400">
              Anticipate patient surges a day in advance using historical data combined with seasonal, pollution, and festival parameters.
            </p>
          </div>

          <button
            onClick={fetchPredictiveData}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-darkbg font-bold rounded-xl text-xs flex items-center space-x-1 transition shadow-lg shadow-teal-500/20"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Recalculate AI Forecast</span>
          </button>
        </div>

        {/* Environmental Parameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Season Factor</span>
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="Monsoon">Monsoon (Dengue/Viral Risk +20%)</option>
              <option value="Winter">Winter (Respiratory Risk +15%)</option>
              <option value="Summer">Summer (Dehydration/Heatstroke +10%)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pollution Index (AQI)</span>
              </label>
              <span className="text-xs font-bold text-amber-400">{pollutionAQI} AQI</span>
            </div>
            <input
              type="range"
              min="50"
              max="450"
              value={pollutionAQI}
              onChange={(e) => setPollutionAQI(Number(e.target.value))}
              className="w-full accent-teal-400"
            />
          </div>

          <div className="flex items-center space-x-2 pt-5">
            <input
              type="checkbox"
              id="fest"
              checked={festivalNear}
              onChange={(e) => setFestivalNear(e.target.checked)}
              className="w-4 h-4 text-teal-500 bg-darkbg border-darkborder rounded"
            />
            <label htmlFor="fest" className="text-xs font-semibold text-slate-300">
              Upcoming Festival / Major Local Event (+15% Surge)
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-5">
            <input
              type="checkbox"
              id="outbreak"
              checked={outbreakAlert}
              onChange={(e) => setOutbreakAlert(e.target.checked)}
              className="w-4 h-4 text-rose-500 bg-darkbg border-darkborder rounded"
            />
            <label htmlFor="outbreak" className="text-xs font-bold text-rose-400">
              🚨 Regional Outbreak Alert (+35% Surge)
            </label>
          </div>
        </div>
      </div>

      {/* Main Forecast Graph */}
      <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-4">
        <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          <span>Hourly Patient Inflow Forecast Graph (Next 24 Hours)</span>
        </h3>

        {loading || !analytics ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Generating AI Time-Series Simulation...</div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.hourlyForecast}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPulmo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232d3f" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151c28', borderColor: '#232d3f', borderRadius: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="predictedInflow" name="Total Inflow" stroke="#14b8a6" fillOpacity={1} fill="url(#colorInflow)" />
                <Area type="monotone" dataKey="pulmonologyLoad" name="Pulmonology Load" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPulmo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AI Staff Reallocation Suggestions */}
      {analytics?.staffRecommendations && (
        <div className="glass-panel p-6 rounded-2xl border border-darkborder space-y-3">
          <h3 className="text-lg font-bold font-heading text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI Staff Reallocation & Operational Action Plan</span>
          </h3>

          <div className="space-y-2">
            {analytics.staffRecommendations.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-teal-500/20 text-xs text-slate-200 flex items-start space-x-2">
                <Users className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
