import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
 
// Cosmic particle system component
const CosmicParticles = ({ count = 60 }) => {
  const [particles, setParticles] = useState([]);
 
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 2.5 + 0.5,
        brightness: Math.random() * 0.4 + 0.4,
        left: Math.random() * 100,
        initialTop: Math.random() * 130 - 10,
        duration: 20 + Math.random() * 25,
        delay: -(Math.random() * 50)
      });
    }
    setParticles(newParticles);
  }, [count]);
 
  return (
    <>
      <style>{`
        .floating-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: cosmicFloat linear infinite;
        }
        @keyframes cosmicFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        .font-avenir {
          font-family: 'Avenir', 'Avenir Next', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: `rgba(255,255,255,${particle.brightness})`,
              left: `${particle.left}%`,
              top: `${particle.initialTop}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
    </>
  );
};
 
const SnapshotsDemo = () => {
  const [selectedSnapshotTab, setSelectedSnapshotTab] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
 
  // Mock data for snapshots
  const snapshotsData = {
    'daily': [
      {
        id: 1,
        date: 'August 22, 2025',
        theme: 'Momentum Building',
        emoji: '🚀',
        metrics: {
          weight: '164.2 lbs',
          sleep: '7.5 hrs',
          workouts: '1 session',
          morningRituals: '✓ Completed',
          eveningRituals: '✓ Completed'
        },
        inputs: {
          mealsLogged: '3 entries',
          supplements: 'Cacao Igniter, Recovery Elixir'
        },
        reflection: "Energy felt sustainable all day. The morning stack is dialing in perfectly.",
        insight: "Consistency creates compound momentum.",
        dateAdded: 'Today'
      },
      {
        id: 2,
        date: 'August 21, 2025',
        theme: 'Recalibration Day',
        emoji: '⚖️',
        metrics: {
          weight: '164.4 lbs',
          sleep: '6.8 hrs',
          workouts: '0 sessions',
          morningRituals: '✓ Completed',
          eveningRituals: '✗ Skipped'
        },
        inputs: {
          mealsLogged: '2 entries',
          supplements: 'Cacao Igniter only'
        },
        reflection: "Felt off rhythm today. Need to prioritize evening ritual consistency.",
        insight: "Rest is recalibration, not regression.",
        dateAdded: 'Yesterday'
      },
      {
        id: 3,
        date: 'August 20, 2025',
        theme: 'Flow State Unlocked',
        emoji: '🌊',
        metrics: {
          weight: '164.1 lbs',
          sleep: '8.2 hrs',
          workouts: '2 sessions',
          morningRituals: '✓ Completed',
          eveningRituals: '✓ Completed'
        },
        inputs: {
          mealsLogged: '4 entries',
          supplements: 'Full stack + extras'
        },
        reflection: "Best training session in weeks. Everything felt effortless yet powerful.",
        insight: "Peak performance emerges from perfect preparation.",
        dateAdded: '2 days ago'
      }
    ],
    'weekly': [
      {
        id: 1,
        period: 'August 18–24, 2025',
        theme: 'Flight Without Fuel',
        emoji: '✨',
        metrics: {
          weight: '164.4 → 163.6 lbs',
          sleep: 'Avg 7.2 hrs',
          workouts: '4 sessions',
          morningRituals: '6/7 completed',
          eveningRituals: '5/7 completed',
          cgm: 'Avg 92 mg/dL'
        },
        inputs: {
          mealsLogged: '18 entries',
          supplements: 'Cacao Igniter (6x), Recovery Elixir (5x)',
          postMealWalks: '12/21 meals (~57%)'
        },
        reflection: "First time I felt tailwind without fuel. Energy is becoming autonomous.",
        insight: "Energy unlocked from alignment.",
        highlights: [
          'Breakthrough workout session Tuesday',
          'Sleep quality improved 15% from digital detox',
          'Glucose stability maintained despite travel day'
        ],
        dateAdded: 'This week'
      },
      {
        id: 2,
        period: 'August 11–17, 2025',
        theme: 'Foundations Solidifying',
        emoji: '🏗️',
        metrics: {
          weight: '165.1 → 164.4 lbs',
          sleep: 'Avg 6.9 hrs',
          workouts: '3 sessions',
          morningRituals: '7/7 completed',
          eveningRituals: '4/7 completed',
          cgm: 'Avg 94 mg/dL'
        },
        inputs: {
          mealsLogged: '15 entries',
          supplements: 'Cacao Igniter (7x), Recovery Elixir (3x)',
          postMealWalks: '9/21 meals (~43%)'
        },
        reflection: "Morning rituals are becoming automatic. Evening consistency needs work.",
        insight: "Strong foundations require patient repetition.",
        highlights: [
          'Perfect morning ritual streak established',
          'New PR in deadlifts despite lower volume',
          'Cacao tolerance optimized - no more jitters'
        ],
        dateAdded: 'Last week'
      },
      {
        id: 3,
        period: 'August 4–10, 2025',
        theme: 'Metabolic Awakening',
        emoji: '⚡',
        metrics: {
          weight: '165.8 → 165.1 lbs',
          sleep: 'Avg 7.4 hrs',
          workouts: '5 sessions',
          morningRituals: '5/7 completed',
          eveningRituals: '6/7 completed',
          cgm: 'Avg 96 mg/dL'
        },
        inputs: {
          mealsLogged: '20 entries',
          supplements: 'Cacao Igniter (5x), Recovery Elixir (6x)',
          postMealWalks: '16/21 meals (~76%)'
        },
        reflection: "First week with CGM data. Fascinating to see glucose patterns align with energy.",
        insight: "Data transforms intuition into precision.",
        highlights: [
          'CGM baseline established',
          'Post-meal walk correlation discovered',
          'Recovery elixir timing optimized'
        ],
        dateAdded: '2 weeks ago'
      }
    ],
    'monthly': [
      {
        id: 1,
        period: 'August 2025',
        theme: 'Alignment Creates Amplification',
        emoji: '🎯',
        metrics: {
          weight: '166.2 → 164.0 lbs (-2.2 lbs)',
          sleep: 'Avg 7.2 hrs/night',
          workouts: '14 sessions (10 strength, 4 recovery)',
          postMealWalks: '65/90 meals (~72%)',
          cgmAverage: '91 mg/dL (stable, narrow variability)'
        },
        inputs: {
          morningRituals: '27/31 completed (87%)',
          eveningRituals: '22/31 completed (71%)',
          nutritionConsistency: '85% adherence to LifePrint menu',
          supplementsAdherence: '90%+'
        },
        reflection: "First time I felt aligned strength and calm coexist. The system is becoming autonomous.",
        insight: "Don't force the future — flow with the frequency that matches it.",
        highlights: [
          'Energy breakthrough: sustainable high performance',
          'Obstacle: 1 week disrupted sleep due to travel',
          'Key adjustment: Digital Detox Window improved HRV + sleep depth'
        ],
        metabolicInsight: 'Glucose recovery now holds even without post-meal walks (autonomic anchor zone).',
        dateAdded: 'This month'
      },
      {
        id: 2,
        period: 'July 2025',
        theme: 'Systematic Integration',
        emoji: '⚙️',
        metrics: {
          weight: '167.8 → 166.2 lbs (-1.6 lbs)',
          sleep: 'Avg 6.8 hrs/night',
          workouts: '12 sessions (8 strength, 4 recovery)',
          postMealWalks: '58/93 meals (~62%)',
          cgmAverage: '94 mg/dL (moderate variability)'
        },
        inputs: {
          morningRituals: '24/31 completed (77%)',
          eveningRituals: '18/31 completed (58%)',
          nutritionConsistency: '78% adherence to LifePrint menu',
          supplementsAdherence: '82%'
        },
        reflection: "Learning to trust the process even when progress feels invisible. Systems > goals.",
        insight: "Patience with process creates permanent transformation.",
        highlights: [
          'First full month with CGM tracking',
          'Morning ritual consistency breakthrough',
          'Travel protocol developed and tested'
        ],
        metabolicInsight: 'Post-meal walks show clear glucose blunting effect. 15-20 point average reduction.',
        dateAdded: 'Last month'
      }
    ]
  };
 
  const snapshotSections = [
    { id: 'daily', title: 'Daily', emoji: '📅', description: 'Daily progress snapshots' },
    { id: 'weekly', title: 'Weekly', emoji: '📊', description: 'Weekly digest & insights' },
    { id: 'monthly', title: 'Monthly', emoji: '📈', description: 'Monthly themes & patterns' }
  ];
 
  const SnapshotsInterface = () => {
    if (selectedSnapshotTab) {
      const sectionData = snapshotsData[selectedSnapshotTab] || [];
      const sectionInfo = snapshotSections.find(s => s.id === selectedSnapshotTab);
 
      return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative font-avenir">
          <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-30">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                THE MASTER MIND COUNCIL™
              </div>
              <div className="text-sm font-medium text-white/80">
                {sectionInfo?.title} Snapshots
              </div>
            </div>
            <button
              onClick={() => setSelectedSnapshotTab(null)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
 
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">{sectionInfo?.emoji}</div>
                <h1 className="text-3xl font-semibold mb-2 text-white">{sectionInfo?.title} Snapshots</h1>
                <p className="text-gray-400">{sectionInfo?.description}</p>
              </div>
 
              <div className="space-y-6 mb-8">
                {sectionData.map((snapshot) => (
                  <div key={snapshot.id} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedItem(expandedItem === snapshot.id ? null : snapshot.id)}
                      className="w-full p-6 text-left hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{snapshot.emoji}</span>
                          <div>
                            <h3 className="font-semibold text-white text-xl">
                              {snapshot.period || snapshot.date}
                            </h3>
                            <div className="text-purple-400 text-sm font-medium">
                              Theme: {snapshot.theme}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xl">
                          {expandedItem === snapshot.id ? '−' : '+'}
                        </div>
                      </div>
 
                      {/* Quick metrics preview */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-1">⚖️ Weight</div>
                          <div className="text-white text-sm font-medium">
                            {typeof snapshot.metrics.weight === 'string' ? snapshot.metrics.weight : `${snapshot.metrics.weight} lbs`}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-1">💤 Sleep</div>
                          <div className="text-white text-sm font-medium">{snapshot.metrics.sleep}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-1">💪 Workouts</div>
                          <div className="text-white text-sm font-medium">{snapshot.metrics.workouts}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-1">🌅 Morning</div>
                          <div className="text-white text-sm font-medium">{snapshot.metrics.morningRituals}</div>
                        </div>
                      </div>
                    </button>
 
                    {expandedItem === snapshot.id && (
                      <div className="px-6 pb-6 border-t border-white/10 pt-6">
                        {/* Full Metrics Section */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📊</span> Metrics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(snapshot.metrics).map(([key, value]) => (
                              <div key={key} className="bg-white/5 rounded-lg p-4">
                                <div className="text-xs text-gray-400 mb-1 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </div>
                                <div className="text-white font-medium">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
 
                        {/* Inputs Section */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📝</span> Inputs
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(snapshot.inputs).map(([key, value]) => (
                              <div key={key} className="bg-white/5 rounded-lg p-4">
                                <div className="text-xs text-gray-400 mb-1 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </div>
                                <div className="text-white font-medium">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
 
                        {/* Highlights (for weekly/monthly) */}
                        {snapshot.highlights && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <span>⭐</span> Highlights
                            </h4>
                            <ul className="space-y-2">
                              {snapshot.highlights.map((highlight, idx) => (
                                <li key={idx} className="text-gray-300 text-sm">• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
 
                        {/* Metabolic Insight (monthly) */}
                        {snapshot.metabolicInsight && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <span>🧬</span> Metabolic Insight
                            </h4>
                            <p className="text-cyan-400 text-sm bg-cyan-400/10 rounded-lg p-4">
                              {snapshot.metabolicInsight}
                            </p>
                          </div>
                        )}
 
                        {/* Reflection */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span>💭</span> Reflection
                          </h4>
                          <div className="bg-purple-500/10 rounded-lg p-4">
                            <p className="text-gray-300 italic">"{snapshot.reflection}"</p>
                          </div>
                        </div>
 
                        {/* Insight */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <span>🔮</span> Insight
                          </h4>
                          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg p-4 border border-purple-500/30">
                            <p className="text-white font-medium text-center">{snapshot.insight}</p>
                          </div>
                        </div>
 
                        <div className="text-xs text-gray-500 text-right">{snapshot.dateAdded}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
 
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative font-avenir">
        <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-30">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              THE MASTER MIND COUNCIL™
            </div>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold mb-4 text-white">Snapshots</h1>
              <p className="text-gray-400">Your Progress Story</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {snapshotSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSnapshotTab(section.id)}
                  className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-105 text-left hover:border-purple-500/50 hover:bg-white/10 cursor-pointer"
                >
                  <div className="text-5xl mb-4">{section.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  return (
    <>
      <CosmicParticles count={30} />
      <SnapshotsInterface />
    </>
  );
};
 
export default SnapshotsDemo;
