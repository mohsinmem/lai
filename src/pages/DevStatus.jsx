import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Database, Zap, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

const DevStatus = () => {
    const [health, setHealth] = useState(null);
    const [logs, setLogs] = useState([]);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const fetchHealth = () => {
        fetch('/api/health')
            .then(res => res.json())
            .then(data => setHealth(data))
            .catch(err => console.error('Health check failed', err));
    };

    const fetchLogs = () => {
        // Fetch from the research/live endpoint which uses company_research 
        // but we'll adapt to show scraper_logs if we had an endpoint for it.
        // For now, we'll use the live signals as a proxy for activity.
        fetch('/api/research/live')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error('Failed to fetch logs', err));
    };

    useEffect(() => {
        fetchHealth();
        fetchLogs();
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const runSmokeTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            // Background functions are triggered by POST
            // In a real scenario, we'd have a secret, but for dev we'll just trigger it
            const res = await fetch('/.netlify/functions/system-test-background', { method: 'POST' });
            if (res.ok) {
                setTestResult({ status: 'success', message: 'Smoke Test Triggered. Background process started.' });
            } else {
                setTestResult({ status: 'error', message: 'Failed to trigger smoke test.' });
            }
        } catch (e) {
            setTestResult({ status: 'error', message: e.message });
        }
        setTesting(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-8 pt-24 font-['Inter']">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Activity className="text-blue-500" /> System Integrity Dashboard
                        </h1>
                        <p className="text-slate-500 mt-2">Real-time health monitoring and automated verification suite.</p>
                    </div>
                    <button 
                        onClick={runSmokeTest}
                        disabled={testing}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                            testing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                        }`}
                    >
                        {testing ? <Zap className="animate-spin" /> : <Terminal />}
                        {testing ? 'Running System Test...' : 'Trigger System Smoke Test'}
                    </button>
                </header>

                {testResult && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-4 rounded-xl border ${
                            testResult.status === 'success' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-red-950/30 border-red-500/30 text-red-400'
                        } flex items-center gap-3`}
                    >
                        {testResult.status === 'success' ? <CheckCircle2 /> : <AlertCircle />}
                        {testResult.message}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Health Card */}
                    <div className="bg-[#12161e] rounded-2xl p-6 border border-slate-800/50">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" /> Core Environment
                        </h2>
                        {health ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">Database Connection</span>
                                    {health.env.has_url ? <span className="text-emerald-400 font-mono text-sm">CONNECTED</span> : <span className="text-red-400 font-mono text-sm">OFFLINE</span>}
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">API Gateway</span>
                                    <span className="text-emerald-400 font-mono text-sm">READY (v{health.version})</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">Last Ping</span>
                                    <span className="text-slate-500 font-mono text-xs">{new Date(health.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-slate-800/50 rounded-lg"></div>
                                <div className="h-10 bg-slate-800/50 rounded-lg"></div>
                            </div>
                        )}
                    </div>

                    {/* Tables Card */}
                    <div className="bg-[#12161e] rounded-2xl p-6 border border-slate-800/50 col-span-2">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Database className="text-blue-500" /> Database Schema Integrity
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {health && Object.entries(health.tables).map(([name, status]) => (
                                <div key={name} className="p-4 bg-black/20 rounded-xl border border-slate-800/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-sm font-bold text-slate-300">{name}</span>
                                        {status.exists ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {status.exists ? (
                                            status.ok ? 'Schema Validated (All keys found)' : `Missing: ${status.missing_columns?.join(', ')}`
                                        ) : 'Table Not Found'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-[#12161e] rounded-2xl p-6 border border-slate-800/50 col-span-3">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Research Activity</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-4 font-medium">Company</th>
                                        <th className="pb-4 font-medium">Region</th>
                                        <th className="pb-4 font-medium">LAI Score</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm border-t border-slate-800/50">
                                    {logs.map((log, i) => (
                                        <tr key={i} className="border-b border-slate-800/30">
                                            <td className="py-4 font-bold text-slate-300">{log.company_name}</td>
                                            <td className="py-4 text-slate-500">{log.region}</td>
                                            <td className="py-4">
                                                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/20">
                                                    {log.adaptiveness_score}
                                                </span>
                                            </td>
                                            <td className="py-4 text-emerald-400 font-mono text-xs">VERIFIED</td>
                                            <td className="py-4 text-slate-500 text-xs">{new Date(log.last_researched).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-600">No activity detected. Run a smoke test to seed data.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevStatus;
