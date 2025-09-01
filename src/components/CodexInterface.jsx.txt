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
 
const CodexDemo = () => {
  const [selectedCodexTab, setSelectedCodexTab] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  // Mock data matching your app structure
  const advisors = {
    'dr-kai': {
      name: 'Dr. Kai',
      title: 'Executive Life Coach',
      emoji: '🧠',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      active: true
    },
    'maya': {
      name: 'Maya',
      title: 'Integrated Life Alchemist',
      emoji: '🔥',
      gradient: 'from-orange-400 via-orange-500 to-red-600',
      active: false
    },
    'michael': {
      name: 'Michael',
      title: 'Business Warrior',
      emoji: '⚔️',
      gradient: 'from-gray-500 via-slate-600 to-gray-700',
      active: false
    },
    'giselle': {
      name: 'Giselle',
      title: 'Strategic Visionary',
      emoji: '👁️',
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      active: false
    },
    'jasmine': {
      name: 'Jasmine',
      title: 'Creative Catalyst & Storyteller',
      emoji: '✨',
      gradient: 'from-purple-500 to-fuchsia-600',
      active: false
    },
    'sensei': {
      name: 'Sensei',
      title: 'The Wisdom Whisperer',
      emoji: '🕉️',
      gradient: 'from-purple-500 to-purple-300',
      active: false
    }
  };
 
  const codexData = {
    'morning-rituals': [
      {
        id: 1,
        title: 'Cacao Igniter Stack',
        category: 'Morning Ritual | Nutrition',
        description: 'Ignites energy, stabilizes cortisol rhythm, and primes metabolism.',
        ingredients: [
          '1 tbsp raw cacao',
          '5g creatine monohydrate',
          '1-2 tsp maca powder',
          '250-500 mg green tea extract'
        ],
        timing: 'Take within 1 hr of waking, ideally before training.',
        dateAdded: 'Added 3 days ago'
      },
      {
        id: 2,
        title: '10-20 Min Post-Breakfast Walk',
        category: 'Morning Ritual | Movement',
        description: 'Aids digestion, stabilizes glucose, and enhances mental clarity.',
        steps: [
          'Walk at comfortable pace outdoors',
          'Focus on breathing deeply',
          'Optional: Listen to educational content',
          'Track glucose response if monitoring'
        ],
        timing: '15-30 minutes after breakfast',
        dateAdded: 'Added 1 week ago'
      },
      {
        id: 3,
        title: "Builder's Reset Ritual",
        category: 'Morning Ritual | Mindset',
        description: 'Mental preparation and intention setting for peak performance.',
        steps: [
          '5 minutes of breathing meditation',
          'Review top 3 priorities for the day',
          'Visualize successful completion',
          'Set energy and focus intentions'
        ],
        timing: 'After Cacao Stack, before work begins',
        dateAdded: 'Added 5 days ago'
      }
    ],
    'evening-rituals': [
      {
        id: 1,
        title: 'Cacao Recovery Elixir',
        category: 'Evening Ritual | Nutrition',
        description: 'Calms the nervous system, lowers cortisol, and primes growth hormone release.',
        ingredients: [
          '1 tbsp cacao',
          '200-300mg magnesium glycinate',
          '2g glycine',
          'Pinch cinnamon + ginger'
        ],
        timing: '60-90 min before bed',
        dateAdded: 'Added 4 days ago'
      },
      {
        id: 2,
        title: 'Gratitude Reflection',
        category: 'Evening Ritual | Mindset',
        description: 'Write down 3 things you are grateful for.',
        timing: 'Before sleep',
        dateAdded: 'Added 1 week ago'
      },
      {
        id: 3,
        title: 'Digital Detox Window',
        category: 'Evening Ritual | Recovery',
        description: 'Power down screens 60 min before sleep.',
        timing: '60 minutes before bed',
        dateAdded: 'Added 5 days ago'
      }
    ],
    'nutrition': [
      {
        id: 1,
        title: 'Performance Hydration Protocol',
        category: 'Nutrition | Hydration',
        description: 'Optimized electrolyte balance for sustained energy and recovery.',
        ingredients: [
          '16-20oz filtered water',
          '1/4 tsp Celtic sea salt',
          '1 tbsp raw honey',
          'Squeeze of fresh lemon'
        ],
        timing: 'First thing upon waking, then every 2-3 hours',
        dateAdded: 'Added 2 weeks ago'
      },
      {
        id: 2,
        title: 'Recovery Meal Template',
        category: 'Nutrition | Post-Workout',
        description: 'Balanced macro profile for optimal recovery and muscle synthesis.',
        components: [
          'Protein: 25-35g (grass-fed beef, wild salmon, or organic eggs)',
          'Carbs: 30-50g (sweet potato, white rice, or fruit)',
          'Fats: 10-15g (avocado, olive oil, or nuts)',
          'Micronutrients: Dark leafy greens and colorful vegetables'
        ],
        timing: 'Within 60 minutes post-workout',
        dateAdded: 'Added 1 week ago'
      }
    ],
    'exercise': [
      {
        id: 1,
        title: 'Strength Training – Push Day',
        category: 'Exercise | Training Split',
        description: 'Focus: Chest, shoulders, triceps.',
        components: [
          'Bench press 4×8',
          'Overhead press 3×10',
          'Dips 3×12',
          'Push-ups 2×AMRAP'
        ],
        timing: '3x per week',
        dateAdded: 'Added 3 days ago'
      },
      {
        id: 2,
        title: 'Mini Fascia Flow Series',
        category: 'Exercise | Recovery',
        description: '10-12 min routine to reset fascia and nervous system.',
        steps: [
          'Neck rolls (1 min)',
          'Cat-cow stretch (2 min)',
          'Hip openers (2 min)',
          'Forward fold hang (2 min)',
          'Spinal twist (2 min)'
        ],
        timing: 'Evening or rest day',
        dateAdded: 'Added 1 week ago'
      },
      {
        id: 3,
        title: '10-20 Min Walks (Glucose Reset)',
        category: 'Exercise | Metabolic Health',
        description: 'Post-meal walk to stabilize glucose and aid digestion.',
        timing: 'After main meals',
        dateAdded: 'Added 2 weeks ago'
      }
    ],
    'personal-doctrine': [
      {
        id: 1,
        title: 'The Ocean Principle',
        category: 'Personal Doctrine | Resilience',
        description: '"The ocean doesn\'t stop being the ocean because a storm passes through."',
        context: 'Learned during a particularly challenging business quarter when everything seemed to be falling apart.',
        application: 'Remember that temporary setbacks don\'t change your fundamental nature and capabilities.',
        dateAdded: 'Added 1 month ago'
      },
      {
        id: 2,
        title: 'Energy as Currency',
        category: 'Personal Doctrine | Resource Management',
        description: 'Treat energy as your most valuable currency - invest it wisely, protect it fiercely.',
        context: 'Realization that came after tracking energy levels and their correlation with decision quality.',
        application: 'Before saying yes to anything, ask: "Is this the highest and best use of my energy right now?"',
        dateAdded: 'Added 2 weeks ago'
      },
      {
        id: 3,
        title: 'Progress Over Perfection',
        category: 'Personal Doctrine | Growth',
        description: 'Consistent small improvements compound into extraordinary results.',
        context: 'Breakthrough insight from Dr. Kai about sustainable habit formation.',
        application: 'Focus on 1% better each day rather than dramatic overhauls that don\'t stick.',
        dateAdded: 'Added 1 week ago'
      }
    ],
    'protocols': [
      {
        id: 1,
        title: 'Metabolic Recovery Meal Protocol',
        category: 'Protocol | Nutrition',
        description: 'Post-workout meal stack designed for muscle growth and glucose balance.',
        ingredients: [
          'Transformation Protein',
          '5g creatine',
          '½ banana',
          '½ tsp Ceylon cinnamon',
          '600-1200mg aged garlic extract'
        ],
        timing: 'Within 1 hr of training',
        dateAdded: 'Added 6 days ago'
      },
      {
        id: 2,
        title: 'Nocturnal Nirvana Protocol',
        category: 'Protocol | Sleep Optimization',
        description: 'Structured flow to deepen rest.',
        steps: [
          'Herbal tea (ginger, chamomile, lavender)',
          '432Hz audio track',
          'Journaling 5 min',
          'Lights out by 10:30pm'
        ],
        timing: 'Evening routine',
        dateAdded: 'Added 1 week ago'
      },
      {
        id: 3,
        title: 'Travel Day Resilience Protocol',
        category: 'Protocol | Environment',
        description: 'How to stay optimized during flights.',
        components: [
          'Airport Snack Plan (chicken + broccoli + olive oil)',
          'Hydration rhythm (electrolytes every 2-3 hrs)',
          'Post-flight walk/stretch routine'
        ],
        timing: 'Day of travel',
        dateAdded: 'Added 4 days ago'
      }
    ]
  };
 
  const codexSections = [
    { id: 'morning-rituals', title: 'Morning Rituals', emoji: '☀️', description: 'Start your day with intention' },
    { id: 'evening-rituals', title: 'Evening Rituals', emoji: '🌙', description: 'Wind down and reflect' },
    { id: 'nutrition', title: 'Nutrition', emoji: '🥗', description: 'Fuel your performance' },
    { id: 'exercise', title: 'Exercise', emoji: '💪', description: 'Movement and training' },
    { id: 'personal-doctrine', title: 'Personal Doctrine', emoji: '📜', description: 'Core principles and wisdom' },
    { id: 'protocols', title: 'Protocols', emoji: '⚙️', description: 'Systems and procedures' }
  ];
 
  const CodexInterface = () => {
    if (selectedCodexTab) {
      const sectionData = codexData[selectedCodexTab] || [];
      const sectionInfo = codexSections.find(s => s.id === selectedCodexTab);
 
      return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative font-avenir">
          <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-30">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                THE MASTER MIND COUNCIL™
              </div>
              <div className="text-sm font-medium text-white/80">
                {sectionInfo?.title} -- Council Codex
              </div>
            </div>
            <button
              onClick={() => setSelectedCodexTab(null)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
 
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">{sectionInfo?.emoji}</div>
                <h1 className="text-3xl font-semibold mb-2 text-white">{sectionInfo?.title}</h1>
                <p className="text-gray-400">{sectionInfo?.description}</p>
              </div>
 
              <div className="space-y-4 mb-8">
                {sectionData.map((item) => (
                  <div key={item.id} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="w-full p-6 text-left hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                          <div className="text-xs text-purple-400 mb-2">{item.category}</div>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                        <div className="text-gray-400 ml-4">
                          {expandedItem === item.id ? '−' : '+'}
                        </div>
                      </div>
                    </button>
 
                    {expandedItem === item.id && (
                      <div className="px-6 pb-6 border-t border-white/10 mt-4 pt-4">
                        {item.ingredients && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Ingredients:</h4>
                            <ul className="space-y-1">
                              {item.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="text-gray-300 text-sm">• {ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        )}
 
                        {item.steps && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Steps:</h4>
                            <ol className="space-y-1">
                              {item.steps.map((step, idx) => (
                                <li key={idx} className="text-gray-300 text-sm">{idx + 1}. {step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
 
                        {item.components && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Components:</h4>
                            <ul className="space-y-1">
                              {item.components.map((component, idx) => (
                                <li key={idx} className="text-gray-300 text-sm">• {component}</li>
                              ))}
                            </ul>
                          </div>
                        )}
 
                        {item.context && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Context:</h4>
                            <p className="text-gray-300 text-sm">{item.context}</p>
                          </div>
                        )}
 
                        {item.application && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Application:</h4>
                            <p className="text-gray-300 text-sm">{item.application}</p>
                          </div>
                        )}
 
                        {item.timing && (
                          <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">Timing:</h4>
                            <p className="text-cyan-400 text-sm">{item.timing}</p>
                          </div>
                        )}
 
                        <div className="text-xs text-gray-500 mt-4">{item.dateAdded}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
 
              <button className="w-full p-4 bg-purple-600/10 border-2 border-dashed border-purple-500/30 rounded-2xl text-purple-400 hover:bg-purple-600/15 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300 flex items-center justify-center gap-3 font-medium transform hover:-translate-y-1">
                <span className="text-xl">+</span>
                <span>Add New {sectionInfo?.title.slice(0, -1) || 'Entry'}</span>
              </button>
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
              <h1 className="text-3xl font-semibold mb-4 text-white">Council Codex</h1>
              <p className="text-gray-400">Your Personal Playbook</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {codexSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    if (['morning-rituals', 'evening-rituals', 'nutrition', 'exercise', 'personal-doctrine', 'protocols'].includes(section.id)) {
                      setSelectedCodexTab(section.id);
                    }
                  }}
                  className={`p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-105 text-left ${
                    ['morning-rituals', 'evening-rituals', 'nutrition', 'exercise', 'personal-doctrine', 'protocols'].includes(section.id)
                      ? 'hover:border-purple-500/50 hover:bg-white/10 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-4xl mb-4">{section.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                  {!['morning-rituals', 'evening-rituals', 'nutrition', 'exercise', 'personal-doctrine', 'protocols'].includes(section.id) && (
                    <div className="text-xs text-purple-400 mt-3">Coming Soon</div>
                  )}
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
      <CodexInterface />
    </>
  );
};
 
export default CodexDemo;
