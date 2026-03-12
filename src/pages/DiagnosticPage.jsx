import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronLeft, AlertCircle, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

const dimensions = [
  { 
    id: 'signal', 
    name: 'Signal Detection', 
    questions: [
      "How quickly does your leadership team recognize when external conditions are changing?",
      "How frequently do leaders discuss early signals such as competitor moves, new technologies, or regulatory changes?",
      "When new information emerges, how quickly is it incorporated into leadership discussions?",
      "How confident are you that your leadership team identifies meaningful signals before they become major disruptions?"
    ] 
  },
  { 
    id: 'emotional', 
    name: 'Emotional Framing', 
    questions: [
      "When unexpected change occurs, how often do leaders treat it as an opportunity rather than a threat?",
      "When plans stop matching reality, how open are leaders to questioning their assumptions?",
      "How comfortable is your leadership team with experimenting in uncertain situations?",
      "When facing disruption, how quickly do leaders move from concern to constructive problem-solving?"
    ] 
  },
  { 
    id: 'resource', 
    name: 'Resource Reallocation', 
    questions: [
      "When priorities change, how quickly does the organization reallocate budget or resources?",
      "How often are outdated initiatives stopped when they no longer support strategy?",
      "When new opportunities emerge, how quickly can resources be redirected toward them?",
      "How confident are you that most resources in your organization support current strategic priorities?"
    ] 
  },
  { 
    id: 'decision', 
    name: 'Decision Alignment', 
    questions: [
      "When leadership agrees on a strategic shift, how consistently do leaders reinforce that direction in their decisions?",
      "How often do different departments pursue competing priorities after leadership discussions?", // Reverse mapped
      "How clearly are leadership decisions aligned with the organization's evolving strategy?",
      "When conditions change, how quickly do leadership decisions converge around a shared response?"
    ] 
  },
  { 
    id: 'execution', 
    name: 'Execution Responsiveness', 
    questions: [
      "Once leadership decisions change, how quickly do operational teams adjust their actions?",
      "How often do outdated processes continue after strategy has shifted?", // Reverse mapped
      "How effectively does your organization translate strategic changes into operational changes?",
      "When the environment changes, how quickly does execution across teams adjust?"
    ] 
  }
];

const DiagnosticPage = () => {
  const [step, setStep] = useState(0); // 0: Start, 0.5: Pre-survey, 1: Questions, 2: Results
  const [meta, setMeta] = useState({ organization_name: '', industry: '', region: '' });
  const [currentDimIndex, setCurrentDimIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const totalQuestions = dimensions.reduce((acc, dim) => acc + dim.questions.length, 0);
  const currentGlobalIndex = currentDimIndex * 4 + currentQIndex;

  const handleAnswer = (value) => {
    const dimId = dimensions[currentDimIndex].id;
    const qKey = `${dimId}_${currentQIndex}`;
    
    // Reverse score for specific questions (14, 18 in 0-indexed: 15, 19 in 1-indexed)
    // 14 is dim 3 (decision), index 1
    // 17 is dim 4 (execution), index 1
    let scoredValue = value;
    if ((currentDimIndex === 3 && currentQIndex === 1) || (currentDimIndex === 4 && currentQIndex === 1)) {
      scoredValue = 11 - value;
    }

    setAnswers({ ...answers, [qKey]: scoredValue });

    if (currentQIndex < 3) {
      setCurrentQIndex(currentQIndex + 1);
    } else if (currentDimIndex < dimensions.length - 1) {
      setCurrentDimIndex(currentDimIndex + 1);
      setCurrentQIndex(0);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    const overallScore = parseFloat(getOverallScore());
    const resultData = {
      ...meta,
      overall_score: overallScore,
      signal_score: parseFloat(getDimScore('signal')),
      emotional_score: parseFloat(getDimScore('emotional')),
      resource_score: parseFloat(getDimScore('resource')),
      decision_score: parseFloat(getDimScore('decision')),
      execution_score: parseFloat(getDimScore('execution'))
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await fetch(`${API_BASE_URL}/api/diagnostic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
    } catch (err) {
      console.error('Failed to save result to backend:', err);
    }

    setIsFinished(true);
    setStep(2);
  };

  const getDimScore = (dimId) => {
    const dimAnswers = Object.keys(answers)
      .filter(key => key.startsWith(dimId))
      .map(key => answers[key]);
    if (dimAnswers.length === 0) return 0;
    const avg = dimAnswers.reduce((a, b) => a + b, 0) / dimAnswers.length;
    return (avg * 10).toFixed(1);
  };

  const getOverallScore = () => {
    const allScores = dimensions.map(d => parseFloat(getDimScore(d.id)));
    return (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(0);
  };

  return (
    <div className="diagnostic-page">
      <div className="container narrow">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="start"
              className="start-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="badge-center">Professional Assessment</div>
              <h1>Leadership Adaptiveness Diagnostic</h1>
              <p>A rapid behavioral assessment to measure how your leadership system responds to changing environments. (20 Questions • 5 Minutes)</p>
              <button onClick={() => setStep(0.5)} className="btn-start">
                Begin Assessment <ArrowRight />
              </button>
            </motion.div>
          )}

          {step === 0.5 && (
            <motion.div 
              key="meta"
              className="start-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="badge-center">Registration Data</div>
              <h2>Organization Details</h2>
              <p>This data helps us provide accurate benchmarking for your industry and region.</p>
              
              <div className="meta-form">
                <div className="form-group-diag">
                  <label>Organization Name</label>
                  <input 
                    type="text" 
                    value={meta.organization_name}
                    onChange={(e) => setMeta({...meta, organization_name: e.target.value})}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="form-group-diag">
                  <label>Industry</label>
                  <select 
                    value={meta.industry}
                    onChange={(e) => setMeta({...meta, industry: e.target.value})}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Energy">Energy</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group-diag">
                  <label>Region</label>
                  <select 
                    value={meta.region}
                    onChange={(e) => setMeta({...meta, region: e.target.value})}
                  >
                    <option value="">Select Region</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="APAC">APAC</option>
                    <option value="Middle East">Middle East</option>
                    <option value="LATAM">LATAM</option>
                    <option value="Africa">Africa</option>
                  </select>
                </div>
                
                <button 
                  disabled={!meta.organization_name || !meta.industry || !meta.region}
                  onClick={() => setStep(1)} 
                  className="btn-start"
                  style={{ marginTop: '2rem' }}
                >
                  Confirm and Start <ArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="questions"
              className="question-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentGlobalIndex / totalQuestions) * 100}%` }}></div>
              </div>

              <div className="dim-indicator">
                <span>Dimension {currentDimIndex + 1} of 5</span>
                <h3>{dimensions[currentDimIndex].name}</h3>
              </div>

              <motion.div 
                key={currentGlobalIndex}
                className="q-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="question-text">{dimensions[currentDimIndex].questions[currentQIndex]}</p>
                <div className="scale-container">
                  <div className="scale-labels">
                    <span>Rarely True</span>
                    <span>Sometimes</span>
                    <span>Consistently True</span>
                  </div>
                  <div className="scale-options">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button 
                        key={num} 
                        className="scale-btn"
                        onClick={() => handleAnswer(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <button className="btn-back" onClick={() => {
                if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
                else if (currentDimIndex > 0) {
                  setCurrentDimIndex(currentDimIndex - 1);
                  setCurrentQIndex(3);
                } else setStep(0);
              }}>
                <ChevronLeft size={16} /> Previous
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="results"
              className="results-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="results-header">
                <CheckCircle2 color="var(--teal)" size={48} />
                <h1>Diagnostic Complete</h1>
                <p>Your Leadership Adaptiveness Snapshot</p>
              </div>

              <div className="overall-score-card">
                <div className="score-circle">
                  <span className="score-num">{getOverallScore()}</span>
                  <span className="score-label">LAI SCORE</span>
                </div>
                <div className="score-desc">
                  <h3>{getOverallScore() >= 80 ? 'Highly Adaptive' : getOverallScore() >= 60 ? 'Moderately Adaptive' : 'Adaptiveness Risk'}</h3>
                  <p>Based on your responses, your leadership system demonstrating {getOverallScore() >= 80 ? 'exceptional' : 'moderate'} capacity to translate ENVIRONMENTAL awareness into ACTION.</p>
                </div>
              </div>

              <div className="dimension-breakdown">
                <h3>Dimension Breakdown</h3>
                <div className="dim-list">
                  {dimensions.map(dim => (
                    <div key={dim.id} className="dim-score-row">
                      <div className="dim-info">
                        <span className="dim-name">{dim.name}</span>
                        <span className="dim-val">{getDimScore(dim.id)}/100</span>
                      </div>
                      <div className="dim-bar-track">
                        <div className="dim-bar-fill" style={{ width: `${getDimScore(dim.id)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insight-box">
                <AlertCircle className="text-teal" />
                <div>
                  <h4>Key Insight</h4>
                  <p>Your profile suggests that while you are strong in {dimensions[0].name}, there is a potential bottleneck in {dimensions[2].name}. This is a common pattern in mature organizations.</p>
                </div>
              </div>

              <div className="conversion-moment">
                <Sparkles size={32} className="text-teal" />
                <h3>Observe Real Behavior</h3>
                <p>This assessment reflects perception-based data. To observe how your team actually behaves under strategic pressure, consider a behavioral simulation.</p>
                <div className="conversion-actions">
                  <button className="btn-primary">Request Simulation Demo</button>
                  <button className="btn-secondary">Download Full Report</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .diagnostic-page {
          padding: 8rem 0;
          min-height: 100vh;
          background: #fcfcfc;
        }

        .container.narrow {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .start-screen {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.03);
        }

        .badge-center {
          display: inline-block;
          color: var(--teal);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
        }

        .start-screen h1 { font-size: 3rem; margin-bottom: 1.5rem; }
        .start-screen p { font-size: 1.2rem; color: var(--slate); margin-bottom: 2.5rem; }

        .meta-form { text-align: left; max-width: 400px; margin: 0 auto; }
        .form-group-diag { margin-bottom: 1.5rem; }
        .form-group-diag label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--slate-light); margin-bottom: 0.5rem; }
        .form-group-diag input, .form-group-diag select { 
          width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 4px; font-size: 1rem; color: var(--navy); 
        }

        .btn-start {
          background: var(--navy);
          color: white;
          padding: 1.25rem 2.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0 auto;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-start:hover { background: var(--teal); transform: translateY(-2px); }

        /* Questions */
        .progress-bar { height: 4px; background: #edf2f7; border-radius: 2px; margin-bottom: 3rem; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--teal); transition: width 0.3s ease; }

        .dim-indicator { margin-bottom: 2rem; }
        .dim-indicator span { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--slate-light); }
        .dim-indicator h3 { font-size: 1.8rem; margin-top: 0.5rem; }

        .q-container { background: white; padding: 3rem; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 2rem; }
        .question-text { font-size: 1.4rem; color: var(--navy); font-weight: 500; margin-bottom: 3rem; min-height: 4rem; }

        .scale-options { display: grid; grid-template-columns: repeat(10, 1fr); gap: 0.5rem; }
        .scale-btn {
          aspect-ratio: 1; border: 1px solid var(--border-color); background: white; border-radius: 4px;
          font-weight: 600; color: var(--slate); cursor: pointer; transition: all 0.2s ease;
        }
        .scale-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
        .scale-labels { display: flex; justify-content: space-between; font-size: 0.7rem; text-transform: uppercase; color: var(--slate-light); margin-bottom: 0.75rem; font-weight: 700; }

        .btn-back { background: none; border: none; color: var(--slate-light); display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; }

        /* Results */
        .results-header { text-align: center; margin-bottom: 3rem; }
        .results-header h1 { margin-top: 1rem; }

        .overall-score-card {
          display: flex; align-items: center; gap: 3rem; background: var(--navy); color: white; padding: 3rem; border-radius: 12px; margin-bottom: 3rem;
        }
        .score-circle {
          width: 140px; height: 140px; border: 8px solid var(--teal); border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .score-num { font-size: 3rem; font-weight: 800; line-height: 1; }
        .score-label { font-size: 0.6rem; letter-spacing: 1px; }
        .score-desc h3 { color: white; font-size: 1.8rem; margin-bottom: 0.5rem; }
        .score-desc p { color: #cbd5e0; }

        .dimension-breakdown { background: white; border: 1px solid var(--border-color); padding: 2.5rem; border-radius: 12px; margin-bottom: 2rem; }
        .dim-list { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
        .dim-score-row { }
        .dim-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
        .dim-bar-track { height: 6px; background: #edf2f7; border-radius: 3px; }
        .dim-bar-fill { height: 100%; background: var(--teal); border-radius: 3px; }

        .insight-box {
          display: flex; gap: 1.5rem; background: rgba(49, 151, 149, 0.05); padding: 2rem; border-radius: 8px; border-left: 4px solid var(--teal); margin-bottom: 3rem;
        }
        .insight-box h4 { margin-top: 0; }

        .conversion-moment { text-align: center; padding: 4rem 2rem; border-top: 1px solid var(--border-color); }
        .conversion-moment h3 { font-size: 2rem; margin: 1rem 0; }
        .conversion-actions { display: flex; justify-content: center; gap: 1.5rem; margin-top: 2.5rem; }
        
        .btn-primary { background: var(--navy); color: white; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 700; cursor: pointer; }
        .btn-secondary { background: white; color: var(--navy); border: 1px solid var(--border-color); padding: 1rem 2rem; border-radius: 4px; font-weight: 700; cursor: pointer; }

        @media (max-width: 600px) {
          .overall-score-card { flex-direction: column; text-align: center; }
          .scale-options { grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default DiagnosticPage;
