'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Send, Upload, Menu, X, Mic, MicOff, Play, Pause, Leaf, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// NEW: Token batching hook to prevent excessive re-renders
const useStreamBuffer = () => {
  const [value, setValue] = useState("");
  const bufferRef = useRef("");
  const rafRef = useRef(null);

  const append = useCallback((chunk) => {
    bufferRef.current += chunk;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const next = bufferRef.current;
        bufferRef.current = "";
        setValue(prev => prev + next);
      });
    }
  }, []);

  const reset = useCallback((initial = "") => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    bufferRef.current = "";
    setValue(initial);
  }, []);

  return { value, append, reset };
};

// Cosmic particle system component
const CosmicParticles = ({ count = 600 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? Math.floor(count * 0.7) : count;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
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
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* NEW: Scroll anchoring rules to prevent shaking */
        .chat-messages {
          overflow-anchor: none;
          scroll-behavior: auto;
        }
  
        .message-row {
         overflow-anchor: none;
         contain: content;
        }
  
        .bottom-anchor {
         overflow-anchor: auto;
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


// Breathing avatar component
const BreathingAvatar = ({ emoji, gradient, size = 'lg', active = false }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl'
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center relative transform transition-all duration-[4000ms] ease-in-out ${active ? 'animate-pulse' : ''}`}
        style={{
          animation: active ? 'breathe 4s ease-in-out infinite' : 'none',
          boxShadow: active ? `0 0 30px rgba(139, 92, 246, 0.3)` : 'none'
        }}
      >
        <span className="relative z-10" style={{ animation: 'none' }}>
          {emoji}
        </span>
      </div>
    </div>
  );
};

const MasterMindCouncil = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [communicationType, setCommunicationType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const stream = useStreamBuffer();

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form state
  const [showPassword, setShowPassword] = useState(false);

  const messagesEndRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const chatInputRef = useRef(null);

// Auto-scroll to top when screen changes
useEffect(() => {
  window.scrollTo(0, 0);
}, [currentScreen]);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('mmc_token');
    const userData = localStorage.getItem('mmc_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setCurrentScreen('features-welcome');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('mmc_token');
        localStorage.removeItem('mmc_user');
      }
    }
  }, []);

  // Reset input when changing screens
  useEffect(() => {
    if (currentScreen !== 'text-interface') {
      if (!conversationLoaded) {
        setMessages([]);
      }
    }
  }, [currentScreen, conversationLoaded]);

  // Handle password toggle without losing input values
  const handlePasswordToggle = () => {
    const currentEmail = emailRef.current?.value || '';
    const currentPassword = passwordRef.current?.value || '';
    
    setShowPassword(!showPassword);
    
    setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.value = currentEmail;
      }
      if (passwordRef.current) {
        passwordRef.current.value = currentPassword;
      }
    }, 0);
  };

  // Handle login form submission with real API
  const handleLogin = async () => {
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    
    if (!email || !password) {
      setAuthError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('mmc_token', data.token);
      localStorage.setItem('mmc_user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setCurrentScreen('features-welcome');
      
      // Clear form
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';

    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('mmc_token');
    localStorage.removeItem('mmc_user');
    setUser(null);
    setCurrentScreen('login');
    setMessages([]);
    setConversationLoaded(false);
  };

  // Handle Enter key on login form
  const handleLoginKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'email') {
        passwordRef.current?.focus();
      } else if (field === 'password') {
        handleLogin();
      }
    }
  };

 
  const scrollToUserMessage = () => {
  setTimeout(() => {
    const messagesContainer = document.querySelector('.chat-messages');
    console.log('Container found:', messagesContainer);
    if (messagesContainer) {
      console.log('Scrolling to top');
      // Use scrollTop directly instead of scrollTo with smooth behavior
      messagesContainer.scrollTop = 0;
    }
  }, 200);
};

// Update the streaming message with buffered content
useEffect(() => {
  if (!stream.value) return;
  
  setMessages(prev => {
    const last = prev[prev.length - 1];
    if (!last || last.sender !== 'assistant') return prev;
    
    return prev.slice(0, -1).concat([{ ...last, text: stream.value }]);
  });
}, [stream.value]);
  
  // Handle sending messages with OpenAI API integration
  const handleSendMessage = async () => {
    const inputElement = chatInputRef.current;
    if (!inputElement) return;
    
    const messageText = inputElement.value.trim();
    if (!messageText) return;
    
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsTyping(true);
    setMessages(prev => [...prev, userMessage]);
    inputElement.value = '';
    inputElement.focus();

    // Scroll to top and lock there during streaming
   scrollToUserMessage();
    
    try {
      // Call our streaming API endpoint with auth token
      const token = localStorage.getItem('mmc_token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-10), // Last 10 messages for context
          mode: selectedMode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();

// Create assistant message that we'll build up
const assistantMessage = {
  id: Date.now() + 1,
  text: '',
  sender: 'assistant',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

setMessages(prev => [...prev, assistantMessage]);
setIsTyping(false);

// Reset stream buffer for new message
stream.reset('');

// Read the streaming response
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') {
        break;
      }
      
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content || '';
        
      if (content) {
        console.log('Token received:', content); // Debug what tokens are coming through
        stream.append(content);
      }
      } catch (e) {
        // Skip malformed JSON
      }
    }
  }
}    
    } catch (error) {
      setIsTyping(false);
      console.error('Error:', error);
      
      // Fallback message on error
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };



  
  // Advisor configuration
  const advisors = {
    'dr-kai': {
      name: 'Dr. Kai',
      title: 'Executive Life Coach',
      emoji: '🧬',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      active: true
    },
    'maya': {
      name: 'Maya',
      title: 'Integrated Life Alchemist',
      emoji: '🌿',
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
      emoji: '💎',
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
      emoji: '🙏🏽',
      gradient: 'from-purple-500 to-purple-300',
      active: false
    }
  };

  // Mode configuration
  const modes = {
    catalyst: { name: 'Catalyst', emoji: '⚡', description: 'Push toward action', color: 'text-yellow-400' },
    balanced: { name: 'Balanced', emoji: '⚖️', description: 'Thoughtful guidance', color: 'text-green-400' },
    nurture: { name: 'Nurture', emoji: '🌱', description: 'Gentle support', color: 'text-purple-400' }
  };

  // Only auto-scroll when not in a conversation and not typing
useEffect(() => {
  if (!isTyping && messages.length === 0) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, isTyping]);

  // Login Screen with Real Authentication
  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CosmicParticles count={160} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal mb-2 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            THE MASTER MIND COUNCIL™
          </h1>
          <p className="text-gray-400">Your Personal Dream Team</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {authError}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                onKeyPress={(e) => handleLoginKeyPress(e, 'email')}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onKeyPress={(e) => handleLoginKeyPress(e, 'password')}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all pr-16"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                onClick={handlePasswordToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm"
                type="button"
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FeaturesWelcomeScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: 'linear-gradient(90deg, #000000 0%, #000000 33%, #1e3a8a 66%, #581c87 100%)'
    }}>
      <CosmicParticles count={120} />
      
      <div className="w-full max-w-4xl relative z-10 text-center">
     
        <h1 className="text-4xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent leading-tight">
  Welcome, {user?.name}!<br />Your Personal Dream Team Awaits
        </h1>

        <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Six world-class DI advisors, each with unique expertise and personality
        </p>

        <p className="text-gray-400 mb-12 max-w-lg mx-auto">
          From executive life coaching to business strategy, creative catalysis to spiritual guidance - your council is ready to help you achieve breakthrough results.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Audio-First Conversations</h3>
            <p className="text-gray-400 text-sm">
              Natural voice interactions that feel like talking to a trusted advisor, not a chatbot
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Specialized Expertise</h3>
            <p className="text-gray-400 text-sm">
              Each advisor brings deep knowledge in their domain, from holistic health to masterful business strategy
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
            <p className="text-gray-400 text-sm">
              Choose conversation modes that match your energy and goals - catalyst, balanced, or nurture
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('welcome')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
        >
          <span>GET STARTED</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: 'linear-gradient(90deg, #000000 0%, #000000 33%, #581c87 100%)'
    }}>
      <CosmicParticles count={60} />
      
      <div className="w-full max-w-4xl relative z-10 text-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-light mb-4 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent leading-tight">
            THE MASTER MIND COUNCIL™
          </h1>
          <p className="text-xl text-gray-300">Your Personal Dream Team</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
  <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl p-1">
    <div className="bg-black/80 backdrop-blur-lg rounded-2xl overflow-hidden">
     <div className="flex flex-col h-[600px] lg:h-[700px]">
  {/* Photo Section - 70% */}
  <div className="w-full relative h-[70%]">
    <img 
      src="/images/dr-kai.png" 
      alt="Dr. Kai"
      className="w-full h-full object-cover object-top"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
  </div>
  
  {/* Content Section - 30% */}
  <div className="w-full h-[30%] p-4 text-center flex flex-col justify-center">
    <BreathingAvatar
      emoji="🧬"
      gradient="from-cyan-400 via-blue-500 to-purple-600"
      size="sm"
      active={true}
    />
    <h2 className="text-2xl font-semibold mt-2 mb-1">Dr. Kai</h2>
    <p className="text-cyan-300 text-base mb-4">Executive Life Coach</p>
    
    <button
      onClick={() => {
        setSelectedAdvisor('dr-kai');
        setCurrentScreen('mode-selection');
      }}
      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
    >
      Start Session with Dr. Kai
    </button>
  </div>
</div>
    </div>
  </div>
</div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-light text-gray-300 mb-2">Your full Master Mind Council is assembling…</h3>
          <p className="text-gray-400">Soon, the circle will be complete, and the power will be yours.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {Object.entries(advisors).filter(([key]) => key !== 'dr-kai').map(([key, advisor]) => (
            <div key={key} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-center">
            {['Maya', 'Michael', 'Giselle', 'Jasmine', 'Sensei'].includes(advisor.name) ? (
  <div className="w-full mx-auto mb-3 overflow-hidden rounded-lg">
    <img 
      src={`/images/${advisor.name.toLowerCase()}.png`} 
      alt={advisor.name}
      className="w-full h-auto object-contain" 
    />
  </div>
) : (
  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${advisor.gradient} flex items-center justify-center text-2xl mx-auto mb-3`}>
    {advisor.emoji}
  </div>
)}
                <h3 className="font-semibold mb-1">{advisor.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{advisor.title}</p>
                <div className="text-xs text-purple-400">Coming Soon</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentScreen('features-welcome')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Overview
        </button>
      </div>
    </div>
  );

  const ModeSelectionScreen = () => {
    const advisor = advisors[selectedAdvisor];

    // Get button gradient based on selected mode
    const getButtonGradient = () => {
      switch (selectedMode) {
        case 'catalyst':
          return 'from-orange-800 to-yellow-400';
        case 'nurture':
          return 'from-purple-800 to-purple-500';
        default:
          return 'from-green-800 to-green-500';
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <CosmicParticles count={60} />
        
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="absolute top-6 left-6 z-20 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-wide mb-3 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              THE MASTER MIND COUNCIL™
            </h1>
            <p className="text-gray-300 text-sm">Your Personal Dream Team</p>
          </div>

          <div className="text-center mb-8">
           <div className="relative flex items-center justify-center">
             <div className="w-24 h-24 rounded-full overflow-hidden">
               <img 
                 src="/images/dr-kai.png" 
                 alt="Dr. Kai"
                 className="w-full h-full object-cover"
              />
           </div>
          </div>
            <h3 className="text-lg font-semibold mt-3 mb-1">{advisor.name}</h3>
            <p className="text-gray-400 text-sm">{advisor.title}</p>
            <p className="text-gray-400 text-xs mt-1">Elite Performance • Holistic Health & Wellness</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-300 text-sm">Choose your conversation energy</p>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => setSelectedMode(key)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMode === key
                    ? key === 'catalyst' 
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
                      : key === 'balanced'
                      ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/25'
                      : 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{mode.emoji}</span>
                  <div className="text-left">
                    <div className={`font-semibold ${mode.color}`}>{mode.name}</div>
                    <div className="text-gray-400 text-sm">{mode.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('communication-choice')}
            className={`w-full py-4 bg-gradient-to-r ${getButtonGradient()} text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
            <span>Continue with {modes[selectedMode].name} Mode</span>
          </button>
        </div>
      </div>
    );
  };

  const CommunicationChoiceScreen = () => {
    const advisor = advisors[selectedAdvisor];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <CosmicParticles count={60} />
        
        <button
          onClick={() => setCurrentScreen('mode-selection')}
          className="absolute top-6 left-6 z-20 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-xl font-light tracking-wide mb-3 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              THE MASTER MIND COUNCIL™
            </h1>
            <p className="text-gray-300 text-sm">Your Personal Dream Team</p>
          </div>

          <div className="text-center mb-8">
            <div className="relative flex items-center justify-center">
             <div className="w-24 h-24 rounded-full overflow-hidden">
              <img 
              src="/images/dr-kai.png" 
              alt="Dr. Kai"
              className="w-full h-full object-cover"
            />
        </div>
      </div>
            <h3 className="text-lg font-semibold mt-3 mb-1">{advisor.name}</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                modes[selectedMode].emoji === '⚡' ? 'from-yellow-400 to-orange-400' :
                modes[selectedMode].emoji === '⚖️' ? 'from-green-400 to-emerald-400' :
                modes[selectedMode].emoji === '🌱' ? 'from-purple-500 to-purple-400' :
                'from-blue-400 to-cyan-400'
              }`}></div>
              <span>{modes[selectedMode].name} Mode</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-8">How would you like to connect?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setCommunicationType('talk');
                  setSelectedAdvisor(selectedAdvisor || 'dr-kai');
                  setCurrentScreen('voice-interface');
                }}
                className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">🎙️</div>
                <h3 className="text-xl font-semibold mb-3">TALK</h3>
                <p className="text-gray-400 text-sm mb-4">Live conversation with real-time audio</p>
                <p className="text-gray-500 text-xs italic">Best for: Deep exploration, complex topics, emotional connection</p>
              </button>

              <button
                onClick={() => {
                  setCommunicationType('text');
                  setSelectedAdvisor(selectedAdvisor || 'dr-kai');
                  setSidebarOpen(false);
                  setCurrentScreen('text-interface');
                }}
                className="p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-3">TEXT</h3>
                <p className="text-gray-400 text-sm mb-4">Written chat conversation</p>
                <p className="text-gray-500 text-xs italic">Best for: Quick questions, discrete communication, reference</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TextInterfaceComponent = () => {
    const advisor = advisors[selectedAdvisor] || advisors['dr-kai'];

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="text-lg font-normal mb-1 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  THE MASTER MIND COUNCIL™
                </button>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">YOUR COUNCIL</div>
              <div className="space-y-2">
                {Object.entries(advisors).map(([key, adv]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (adv.active) {
                        setSelectedAdvisor(key);
                        setCurrentScreen('dr-kai-archive');
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-sm relative ${
                      selectedAdvisor === key
                        ? 'bg-purple-500/30 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      key === 'dr-kai'
                        ? 'bg-cyan-400'
                        : key === 'sensei'
                        ? 'bg-purple-500'
                        : `bg-gradient-to-r ${adv.gradient}`
                    }`}>
                      {adv.emoji}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{adv.name}</div>
                      {!adv.active && <div className="text-xs text-gray-500">Coming Soon</div>}
                    </div>
                    {selectedAdvisor === key && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">SETTINGS</div>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">⚙️</div>
                  <span>Preferences</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">📊</div>
                  <span>Analytics</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">❓</div>
                  <span>Help & Support</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🚪</div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors flex flex-col gap-1 w-8 h-7 justify-center"
            >
              <div className="w-6 h-1 bg-current rounded-full"></div>
              <div className="w-4 h-1 bg-current rounded-full"></div>
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="text-sm md:text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent text-center">
              THE MASTER MIND COUNCIL™
            </div>
            <div className="text-sm font-medium text-white/80">
              {advisor.name} - {advisor.title}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
              modes[selectedMode].emoji === '⚡' ? 'from-yellow-400 to-orange-400' :
              modes[selectedMode].emoji === '⚖️' ? 'from-green-400 to-emerald-400' :
              modes[selectedMode].emoji === '🌱' ? 'from-purple-500 to-purple-400' :
              'from-blue-400 to-cyan-400'
            }`}></div>
            <span>{modes[selectedMode].name} Mode</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 relative z-10 chat-messages">
          {messages.length === 0 && !conversationLoaded && (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-4xl relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" style={{ animation: 'spin 8s linear infinite' }}></div>
                  <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden">
                    <img 
                      src="/images/dr-kai.png" 
                      alt="Dr. Kai"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-medium mt-4 mb-2">Ready to connect with {advisor.name}</h3>
              <p className="text-gray-400 text-sm">Start the conversation by typing a message below</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message-row flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'bg-white/10 backdrop-blur-lg text-white rounded-bl-md border border-white/10'
              }`}>
                <ReactMarkdown 
                  className="text-lg prose prose-invert max-w-none"
                  components={{
                    p: ({children}) => <p className="mb-2">{children}</p>,
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>
                  }}
                >
                  {message.text}
                </ReactMarkdown>                
                <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white/10 backdrop-blur-lg text-white rounded-2xl rounded-bl-md border border-white/10 px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="bottom-anchor" />
        </div>

        {/* Input Area */}
        <div className="p-4 px-2 sm:px-4 bg-black/30 border-t border-white/20">
          <div className="max-w-4xl mx-auto flex items-center gap-1 sm:gap-3">
            {/* Upload Button */}
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Input container with icons inside */}
            <div className="flex-1 relative flex items-end bg-white/10 border border-white/30 rounded-xl focus-within:border-purple-400 transition-colors">
              <textarea
                ref={chatInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-auto sm:flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 resize-none min-h-[48px] max-h-32 focus:outline-none text-sm"
                autoComplete="off"
                spellCheck="false"
                rows={1}
                style={{
                  minHeight: '48px',
                  maxHeight: '128px',
                  overflowY: 'auto'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              
              {/* Icons inside the input bubble */}
              <div className="flex items-center gap-2 pr-3 mb-1.5">
                {/* Voice/Waveform Button */}
                <button 
                  onClick={() => setCurrentScreen('voice-interface')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="10" width="2" height="4" rx="1"/>
                    <rect x="7" y="6" width="2" height="12" rx="1"/>
                    <rect x="11" y="8" width="2" height="8" rx="1"/>
                    <rect x="15" y="4" width="2" height="16" rx="1"/>
                    <rect x="19" y="7" width="2" height="10" rx="1"/>
                  </svg>
                </button>

                {/* Microphone Button */}
                <button 
                  onClick={() => setCurrentScreen('voice-interface')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                {/* Send Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="w-9 h-9 bg-purple-700 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                >
                  <svg className="w-5 h-5 -ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VoiceInterfaceComponent = () => {
    const advisor = advisors[selectedAdvisor] || advisors['dr-kai'];
    const [voiceState, setVoiceState] = useState('listening');

    useEffect(() => {
      const interval = setInterval(() => {
        setVoiceState(prev => prev === 'listening' ? 'responding' : 'listening');
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const getStatusText = () => {
      switch (voiceState) {
        case 'listening':
          return 'Listening...';
        case 'responding':
          return 'Dr. Kai is responding...';
        default:
          return 'Listening...';
      }
    };

    const getAdvisorStatus = () => {
      switch (voiceState) {
        case 'listening':
          return 'Listening';
        case 'responding':
          return 'Sharing';
        default:
          return 'Listening';
      }
    };

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative">
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-30">
          <div className="w-10"></div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <button 
              onClick={() => setCurrentScreen('login')}
              className="text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              THE MASTER MIND COUNCIL™
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
              modes[selectedMode].emoji === '⚡' ? 'from-yellow-400 to-orange-400' :
              modes[selectedMode].emoji === '⚖️' ? 'from-green-400 to-emerald-400' :
              modes[selectedMode].emoji === '🌱' ? 'from-purple-500 to-purple-400' :
              'from-blue-400 to-cyan-400'
            }`}></div>
            <span>{modes[selectedMode].name} Mode</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-block mb-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${advisor.gradient} flex items-center justify-center text-3xl relative`}>
                <div className="relative z-10 w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-2xl">
                  {advisor.emoji}
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">{advisor.name}</h3>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                voiceState === 'listening' ? 'bg-green-400' : 'bg-purple-400'
              }`}></div>
              <span className="text-gray-400">{getAdvisorStatus()}</span>
            </div>
          </div>

          <div className="mb-16">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              voiceState === 'listening' ? 'bg-green-500' : 'bg-purple-500'
            }`}>
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-white mb-2">{getStatusText()}</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => setCurrentScreen('text-interface')}
            className="w-12 h-12 rounded-full bg-gray-700/70 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const DrKaiArchiveComponent = () => {
    const handleLoadLifePrint3 = () => {
      const lifePrint3Messages = [
        {
          id: 1,
          text: "Good Morning, Doc! I am feeling a little off and sluggish since I didn't get my morning workout in but glucose is steady at 92mg/dL. Big stress and challenge today. Any suggestions?",
          sender: 'user',
          timestamp: '8:15 AM'
        },
        {
          id: 2,
          text: "Good Morning! You are trending exactly as we planned so I'm feeling good about the metabolic system regulation and balance. This will serve you well as you face today's challenge head on. Remember...\"The ocean doesn't stop being the ocean because a storm passes through.\" Now, let's start with some breathing to calibrate and reset your central nervous system. Then we will develop a plan of attack together to make today a major win for you.",
          sender: 'assistant',
          timestamp: '8:16 AM'
        }
      ];
      
      setSelectedAdvisor('dr-kai');
      setMessages(lifePrint3Messages);
      setConversationLoaded(true);
      setCurrentScreen('text-interface');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
        <CosmicParticles count={30} />

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
            <button
              onClick={() => setCurrentScreen('text-interface')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <button 
                onClick={() => setCurrentScreen('login')}
                className="text-lg font-normal tracking-wide bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                THE MASTER MIND COUNCIL™
              </button>
              <div className="text-sm font-medium text-white/80 mt-1">
                Dr. Kai - Executive Life Coach
              </div>
            </div>

            <div className="w-10"></div>
          </div>

          <div className="flex-1 p-8">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-5xl relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" style={{ animation: 'spin 8s linear infinite' }}></div>
                  <div className="relative z-10 w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center text-4xl">
                    🧬
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-semibold mb-2">Dr. Kai</h1>
              <p className="text-gray-400 text-lg">Executive Life Coach • Elite Performance • Holistic Health & Wellness</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Conversations with Dr. Kai</h2>
              
              <div className="space-y-4 mb-8">
                <div 
                  onClick={handleLoadLifePrint3}
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">💬</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Dr. Kai LifePrint 3.0</h3>
                    <p className="text-gray-400 text-sm">Good Morning, Doc! I am feeling a little off...</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>Today</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>2 messages</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>Text</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">💬</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Dr. Kai LifePrint 2.0</h3>
                    <p className="text-gray-400 text-sm">Thank you!...</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>Yesterday</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>23 messages</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>Voice & Text</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">💬</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Dr. Kai LifePrint 1.0</h3>
                    <p className="text-gray-400 text-sm">Thank you, Doc! 🙏</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>3 days ago</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>31 messages</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>Voice & Text</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedAdvisor('dr-kai');
                  setMessages([]);
                  setConversationLoaded(false);
                  setCurrentScreen('text-interface');
                }}
                className="w-full p-4 bg-purple-600/10 border-2 border-dashed border-purple-500/30 rounded-2xl text-purple-400 hover:bg-purple-600/15 hover:border-purple-500/50 hover:text-purple-300 transition-all duration-300 flex items-center justify-center gap-3 font-medium transform hover:-translate-y-1"
              >
                <span className="text-xl">+</span>
                <span>Start New Conversation with Dr. Kai</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'features-welcome':
        return <FeaturesWelcomeScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'mode-selection':
        return <ModeSelectionScreen />;
      case 'communication-choice':
        return <CommunicationChoiceScreen />;
      case 'text-interface':
        return <TextInterfaceComponent />;
      case 'voice-interface':
        return <VoiceInterfaceComponent />;
      case 'dr-kai-archive':
        return <DrKaiArchiveComponent />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden"
      style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {renderScreen()}
    </div>
  );
};

export default MasterMindCouncil;
