import React, { useState, useEffect, Component } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Database, Zap, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Dashboard caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-8 pt-24 font-['Inter'] flex items-center justify-center">
                    <div className="max-w-md w-full bg-red-950/30 border border-red-500/30 rounded-2xl p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Initialization Error</h2>
                        <p className="text-slate-400 text-sm mb-4">A critical error occurred while rendering the dashboard.</p>
                        <p className="font-mono text-xs text-red-400 bg-red-900/20 p-2 rounded max-h-32 overflow-auto">{this.state.error?.message || 'Unknown render error'}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                        >
                            Reload Dashboard
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const DevStatusContent = () => {
    const [health, setHealth] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const fetchHealth = () => {
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                setHealth(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Health check failed', err);
                setHealth({ status: 'error', message: err.message });
                setLoading(false);
            });
    };

    const fetchLogs = () => {
        fetch('/api/scraper-logs')
            .then(res => res.json())
            .then(data => setLogs(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to fetch logs', err));
    };

    useEffect(() => {
        fetchHealth();
        fetchLogs();
        const interval = setInterval(() => {
            fetchHealth();
            fetchLogs();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const runSmokeTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('/.netlify/functions/system-test-background', { method: 'POST' });
            if (res.ok) {
                setTestResult({ status: 'success', message: 'Smoke Test Triggered. Pipeline is running...' });
                setTimeout(fetchLogs, 5000); // Polling delay
            } else {
                setTestResult({ status: 'error', message: `Trigger Failed (${res.status})` });
            }
        } catch (e) {
            setTestResult({ status: 'error', message: e.message });
        }
        setTesting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0c10] text-slate-200 flex flex-col items-center justify-center font-['Inter']">
                <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                <h2 className="text-xl font-bold text-white">Connecting to Orion Scout...</h2>
                <p className="text-slate-500 mt-2">Initializing System Integrity Dashboard</p>
            </div>
        );
    }

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
                        {health && health.status === 'ok' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">Database Connection</span>
                                    {health.env?.has_url ? <span className="text-emerald-400 font-mono text-sm">CONNECTED</span> : <span className="text-red-400 font-mono text-sm">OFFLINE</span>}
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">API Gateway</span>
                                    <span className="text-emerald-400 font-mono text-sm">READY (v{health.version || '1.1.0'})</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">Pipeline Status</span>
                                    <span className={`font-mono text-sm ${health.pipeline?.status === 'nominal' ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`}>
                                        {health.pipeline?.status?.toUpperCase() || '--'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                    <span className="text-slate-400">Last Ping</span>
                                    <span className="text-slate-500 font-mono text-xs">{new Date(health.timestamp || Date.now()).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ) : health && health.status === 'error' ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5 mb-2" />
                                    Backend Check Failed: {health.message}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <div className="h-10 bg-slate-800/50 rounded-lg"></div>
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
                            {health?.status === 'ok' && health?.tables ? Object.entries(health.tables).map(([name, status]) => (
                                <div key={name} className="p-4 bg-black/20 rounded-xl border border-slate-800/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-sm font-bold text-slate-300">{name}</span>
                                        {status?.exists ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {status?.exists ? (
                                            status?.ok ? 'Schema Validated (All keys found)' : `Missing: ${status?.missing_columns?.join(', ')}`
                                        ) : 'Table Not Found'}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-slate-600 text-sm text-center py-4">Database checks unavailable.</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#12161e] rounded-2xl p-6 border border-slate-800/50 col-span-3">
                        <h3 className="text-lg font-bold text-white mb-6">Recent System & Research Audit</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-4 font-medium">Timestamp</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Code</th>
                                        <th className="pb-4 font-medium">Summary</th>
                                        <th className="pb-4 font-medium">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm border-t border-slate-800/50">
                                    {logs?.map((log, i) => (
                                        <tr key={i} className="border-b border-slate-800/30">
                                            <td className="py-4 text-slate-500 text-xs whitespace-nowrap">
                                                {log?.created_at ? new Date(log.created_at).toLocaleString() : '--'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                                    log?.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                    log?.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {log?.status?.toUpperCase() || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="py-4 font-mono text-xs text-slate-400">{log?.error_code || '--'}</td>
                                            <td className="py-4 text-slate-300 max-w-md truncate" title={log?.summary}>{log?.summary || '--'}</td>
                                            <td className="py-4 text-slate-500 text-xs">{log?.duration_ms ? `${log.duration_ms}ms` : '--'}</td>
                                        </tr>
                                    ))}
                                    {(!logs || logs.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-600">No audit logs detected. Run a smoke test to verify.</td>
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

const DevStatus = () => (
    <ErrorBoundary>
        <DevStatusContent />
    </ErrorBoundary>
);

export default DevStatus;
