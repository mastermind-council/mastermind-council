'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Send, Upload, Menu, X, Mic, MicOff, Play, Pause, Leaf, Users, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LuxuryOrientationCarousel } from './LuxuryOrientationCarousel';

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

// Attachment Display Component
const AttachmentDisplay = ({ attachments }) => {
  const [attachmentData, setAttachmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const token = localStorage.getItem('mmc_token');
        const fetchedAttachments = [];
        
        // If attachments are already full objects with file_path, fetch the file data
        // Otherwise treat them as IDs and fetch from API
        for (const attachment of attachments) {
          if (typeof attachment === 'object' && attachment.file_path) {
            // Already have attachment metadata from backend, just fetch file data
            const response = await fetch(`/api/attachments/${attachment.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              fetchedAttachments.push(data);
            }
          } else {
            // Legacy: attachment is just an ID
            const id = typeof attachment === 'object' ? attachment.id : attachment;
            const response = await fetch(`/api/attachments/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              fetchedAttachments.push(data);
            }
          }
        }
        
        setAttachmentData(fetchedAttachments);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (attachments && attachments.length > 0) {
      fetchAttachments();
    } else {
      setLoading(false);
    }
  }, [attachments]);

  if (loading) {
    return (
      <div className="mt-2 text-sm opacity-60">
        Loading attachments...
      </div>
    );
  }

  if (!attachmentData || attachmentData.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {attachmentData.map((att) => (
        <div key={att.id} className="block">
          {att.mimeType?.startsWith('image/') ? (
            <img
              src={`data:${att.mimeType};base64,${att.fileData}`}
              alt={att.filename}
              className="max-w-full w-auto max-h-96 rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
              onClick={() => {
                // Open full-size image in new tab
                const win = window.open();
                win.document.write(`<img src="data:${att.mimeType};base64,${att.fileData}" style="max-width:100%;height:auto;" />`);
              }}
            />
          ) : (
            <a
              href={`data:${att.mimeType};base64,${att.fileData}`}
              download={att.filename}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">{att.filename}</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
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

        /* Bottom anchor toggles based on staging */
       .chat-root.staging .bottom-anchor {
         overflow-anchor: none;
        }

        .chat-root:not(.staging) .bottom-anchor {
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
  const hasScrolledToUserMessage = useRef(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const stream = useStreamBuffer();

  // Attachment state
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const fileInputRef = useRef(null);

  // TTS state (ADD THESE)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioLoading, setAudioLoading] = useState(new Set()); // Track which messages are loading audio
  const [loadingId, setLoadingId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);
  
  const playReply = async (replyId,messageText) => {
  if (playingId === replyId && audioRef.current) {
   audioRef.current.pause();
    setPlayingId(null);
  return;
  }
  // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
    }
    
  setLoadingId(replyId);

  try {
    // Get advisor voice mapping
    const advisorVoices = {
      'dr-kai': 'ash',
      'maya': 'shimmer',
      'michael': 'echo',
      'giselle': 'alloy',
      'jasmine': 'nova',
      'sensei': 'onyx'
    };
    const voice = advisorVoices[selectedAdvisor] || 'alloy';
    
    // Call TTS API to generate audio
    const token = localStorage.getItem('mmc_token');
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: messageText,
        voice: voice,
        advisor: selectedAdvisor
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate audio');
    }
    
    // Create audio from response blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
      URL.revokeObjectURL(audioUrl); // Clean up blob URL
    };

    await audio.play();
    setPlayingId(replyId);
    
  } catch (err) {
    console.error("Audio play error:", err);
  } finally {
      setLoadingId(null); 
  }
};

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Voice dictation state (for TEXT interface mic button)
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef(''); // Stores text that was in field when dictation started
  const finalTranscriptRef = useRef(''); // Stores the final combined text to survive onend

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const messagesEndRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const chatInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Pin-to-top staging state
  const [staging, setStaging] = useState(false);
  const [anchoredMessageId, setAnchoredMessageId] = useState(null);

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
        setCurrentScreen('welcome');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('mmc_token');
        localStorage.removeItem('mmc_user');
      }
    }
  }, []);

  // Fetch conversations when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      fetchConversations();
    }
  }, [sidebarOpen]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const token = localStorage.getItem('mmc_token');
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (convId) => {
    try {
      const token = localStorage.getItem('mmc_token');
      const response = await fetch(`/api/conversations/${convId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Load conversation data
        setConversationId(data.conversation.id);
        setSelectedAdvisor(data.conversation.advisor);
        setSelectedMode(data.conversation.mode);
        
        // Load messages with attachments
        const loadedMessages = data.messages.map(msg => ({
          sender: msg.sender,
          text: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          messageType: msg.is_voice ? 'voice' : 'text',
          attachments: msg.attachments || [] // Include attachments array
        }));
        setMessages(loadedMessages);
        setConversationLoaded(true);
        
        // Switch to text interface
        setCurrentScreen('text-interface');
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setConversationLoaded(false);
    setSidebarOpen(false);
  };

  // Goodbye detection helper
  const detectGoodbye = (text) => {
    const goodbyeKeywords = [
      'goodbye', 'good bye', 'bye', 'see you', 'talk soon', 
      'take care', 'until next time', 'catch you later', 
      'have a good', 'farewell', 'later', 'peace out',
      'signing off', 'gotta go', 'ttyl', 'cya'
    ];
    
    const lowerText = text.toLowerCase();
    return goodbyeKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Trigger conversation summary
  const triggerSummary = async (convId) => {
    if (!convId) return;
    
    try {
      const token = localStorage.getItem('mmc_token');
      const response = await fetch(`/api/conversations/${convId}/summarize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversation summary generated:', data);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

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

  // OpenAI TTS functionality
// Direct audio streaming without blob URLs
const handleSpeakMessage = async (messageId, text) => {
  console.log('🔊 Speaker button clicked:', messageId, text.substring(0, 50) + '...');
  
  // Stop any currently playing audio
  if (currentlyPlaying) {
    const currentAudio = document.getElementById(`audio-${currentlyPlaying}`);
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentlyPlaying(null);
    
    if (currentlyPlaying === messageId) {
      console.log('🛑 Stopping current audio');
      return;
    }
  }

  setAudioLoading(prev => new Set(prev).add(messageId));
  console.log('⏳ Setting loading state for message:', messageId);

  try {
    console.log('📡 Calling TTS API...');
    
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: 'ash'
      }),
    });

    console.log('📡 TTS API response status:', response.status);

    if (!response.ok) {
      throw new Error(`TTS generation failed: ${response.status}`);
    }

    // Create audio element with direct fetch URL instead of blob
    const audio = new Audio();
    audio.id = `audio-${messageId}`;
    
    // Set source directly to the API endpoint
    const audioUrl = `/api/tts?messageId=${messageId}&timestamp=${Date.now()}`;
    
    // Make another request to get the audio data for this specific audio element
    const audioResponse = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, voice: 'coral' }),
    });
    
    const audioBlob = await audioResponse.blob();
    const reader = new FileReader();
    
    reader.onload = () => {
      audio.src = reader.result;
      console.log('✅ Audio loaded, starting playback');
      setAudioLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      setCurrentlyPlaying(messageId);
      audio.play().catch(err => console.error('❌ Audio play error:', err));
    };
    
    reader.readAsDataURL(audioBlob);

    audio.onended = () => {
      console.log('🏁 Audio playback ended');
      setCurrentlyPlaying(null);
    };

    audio.onerror = (error) => {
      console.error('❌ Audio error:', error);
      setCurrentlyPlaying(null);
      setAudioLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    };

  } catch (error) {
    console.error('❌ TTS error:', error);
    setAudioLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }
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
      setCurrentScreen('welcome');
      
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
  console.log('scrollToUserMessage CALLED');
  
  // Wait for content to be added to DOM and rendered
  setTimeout(() => {
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) {
      console.log('Messages container not found');
      return;
    }
    
    // Find all user messages
    const userMessages = messagesContainer.querySelectorAll('.message-row .bg-purple-600');
    console.log('User messages found:', userMessages.length);
    
    if (userMessages.length > 0) {
      // Get the last user message row
      const lastUserMessage = userMessages[userMessages.length - 1];
      const messageRow = lastUserMessage.closest('.message-row');
      
      if (messageRow) {
        // Get the absolute position of the message within the scrollable content
        const messageOffsetTop = messageRow.offsetTop;
        
        console.log('Message offsetTop:', messageOffsetTop);
        console.log('Current scrollTop:', messagesContainer.scrollTop);
        
        // Force instant scroll (disable smooth behavior)
        const originalScrollBehavior = messagesContainer.style.scrollBehavior;
        messagesContainer.style.scrollBehavior = 'auto';
        
        // Set scrollTop to the message position (puts it at absolute top of viewport)
        messagesContainer.scrollTop = messageOffsetTop;
        
        // Restore original scroll behavior
        messagesContainer.style.scrollBehavior = originalScrollBehavior;
        
        console.log('New scrollTop:', messageOffsetTop);
        console.log('Actual scrollTop after:', messagesContainer.scrollTop);
      }
    }
  }, 400);
};

// Scroll to user message when assistant message is added (empty text means just added)
useEffect(() => {
  const lastMessage = messages[messages.length - 1];
  const secondLastMessage = messages[messages.length - 2];
  
  // Check if we just added an empty assistant message after a user message
  if (lastMessage?.sender === 'assistant' && 
      lastMessage?.text === '' && 
      secondLastMessage?.sender === 'user' &&
      !hasScrolledToUserMessage.current) {
    console.log('Assistant message just added, scrolling to user message...');
    hasScrolledToUserMessage.current = true;
    
    // Wait for DOM to fully render
    setTimeout(() => {
      scrollToUserMessage();
    }, 100);
  }
  
  // Reset flag when user sends a new message
  if (lastMessage?.sender === 'user') {
    hasScrolledToUserMessage.current = false;
  }
}, [messages]);

// Update the streaming message with buffered content
useEffect(() => {
  if (!stream.value) return;
  
  setMessages(prev => {
    const last = prev[prev.length - 1];
    if (!last || last.sender !== 'assistant') return prev;
    
    return prev.slice(0, -1).concat([{ ...last, text: stream.value }]);
  });
  
  // Don't restore scroll - the lock enforcement useEffect handles it
}, [stream.value]);

  // Attachment handling functions
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingAttachment(true);

    try {
      const token = localStorage.getItem('mmc_token');
      const uploadedAttachments = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversationId || 'pending');

        const response = await fetch('/api/attachments/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadedAttachments.push({
          ...data.attachment,
          file, // Keep file object for preview
        });
      }

      setPendingAttachments(prev => [...prev, ...uploadedAttachments]);
    } catch (error) {
      console.error('Error uploading attachments:', error);
      alert('Failed to upload one or more files. Please try again.');
    } finally {
      setUploadingAttachment(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (attachmentId) => {
    setPendingAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };
  
  // Voice dictation handler (for TEXT interface mic button)
  const handleVoiceDictation = () => {
    if (isDictating) {
      // Stop dictation - text is already in the input field, just stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsDictating(false);
      return;
    }
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }
    
    // Capture whatever text is already in the input field BEFORE starting dictation
    // This text should be preserved and new speech appended to it
    baseTextRef.current = chatInputRef.current?.value || '';
    
    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show interim results as user speaks
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsDictating(true);
    };
    
    recognition.onresult = (event) => {
      // Build up the transcript from ALL results in this recognition session
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Combine: base text (what was there before) + final speech + interim speech
      const combinedText = baseTextRef.current + (baseTextRef.current ? ' ' : '') + finalTranscript + interimTranscript;
      
      // Save to ref so it survives onend
      finalTranscriptRef.current = combinedText;
      
      // Update textarea
      if (chatInputRef.current) {
        chatInputRef.current.value = combinedText;
        // Trigger resize
        chatInputRef.current.style.height = 'auto';
        chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 128) + 'px';
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsDictating(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
      } else if (event.error === 'no-speech') {
        // User didn't speak, restore base text and stop quietly
        if (chatInputRef.current) {
          chatInputRef.current.value = baseTextRef.current;
        }
        console.log('No speech detected');
      } else {
        alert(`Voice dictation error: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      setIsDictating(false);
      
      // CRITICAL: Restore from ref if textarea got cleared
      // This happens because onend can fire after the textarea is cleared
      if (chatInputRef.current && finalTranscriptRef.current && !chatInputRef.current.value) {
        chatInputRef.current.value = finalTranscriptRef.current;
        chatInputRef.current.style.height = 'auto';
        chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 128) + 'px';
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle sending messages with OpenAI API integration
  const handleSendMessage = async () => {
    const inputElement = chatInputRef.current;
    if (!inputElement) return;
    
    const messageText = inputElement.value.trim();
    if (!messageText && pendingAttachments.length === 0) return;
    
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: pendingAttachments.map(att => att.id)
    };

    setIsTyping(true);
    setMessages(prev => [...prev, userMessage]);
    inputElement.value = '';
    inputElement.focus();
    
    // Store attachments to clear after sending
    const attachmentsToSend = [...pendingAttachments];
    setPendingAttachments([]);
    
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
          advisor: selectedAdvisor,
          mode: selectedMode,
          userName: user?.first_name || user?.name?.split(' ')[0], // Pass first name
          userOpenId: user?.open_id || user?.openId, // Link conversation to user account
          conversationId: conversationId, // Continue existing conversation or create new
          attachmentIds: attachmentsToSend.map(att => att.id) // Include attachment IDs
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

// Scroll will be triggered by useEffect watching messages

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
        
        // Check if this message contains conversationId
        if (parsed.conversationId) {
          setConversationId(parsed.conversationId);
        }
        
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

// After streaming completes, check for goodbye in user or assistant message
const fullAssistantText = stream.value;
if (detectGoodbye(messageText) || detectGoodbye(fullAssistantText)) {
  console.log('👋 Goodbye detected! Triggering summary generation...');
  setTimeout(() => {
    triggerSummary(conversationId);
    // Clear conversationId so next conversation starts fresh
    setConversationId(null);
    console.log('✨ Conversation ended. Next session will start a new conversation.');
  }, 1000); // Small delay to ensure conversation is saved
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
      tagline: 'Your Guide to Inner Power',
      emoji: '🧬',
      borderColor: '#4FA6A6', // Platinum Teal
      ctaColor: '#2F6F73', // Clinical teal - calm, modern, professional
      ctaHoverColor: '#3B8286', // Breath lighter
      glowOpacity: '0.08',
      active: true
    },
    'maya': {
      name: 'Maya',
      title: 'The Life Composer',
      tagline: 'The One Who Brings All of The Music Together',
      emoji: '🌿',
      borderColor: '#B87333', // Burnished Copper
      ctaColor: '#B56A2D', // Molten honey - amber-forward, fire-present, warmth that moves
      ctaHoverColor: '#A66A34', // Soft inhale
      glowOpacity: '0.08',
      active: true
    },
    'michael': {
      name: 'Michael',
      title: 'The Business Warrior',
      tagline: 'The Blade Sharpener & The Edge',
      emoji: '⚔️',
      borderColor: '#8A8F98', // Gunmetal Silver
      ctaColor: '#2A2C31',
      glowOpacity: '0.06',
      active: true
    },
    'giselle': {
      name: 'Giselle',
      title: 'The Strategic Visionary',
      tagline: 'The One Who Sees What Could Be… and Helps You Make It Possible Now',
      emoji: '💎',
      borderColor: '#7A5C9E', // Royal Amethyst
      ctaColor: '#6E4A8E', // Polished amethyst - twilight clarity at altitude
      glowOpacity: '0.08',
      active: true
    },
    'jasmine': {
      name: 'Jasmine',
      title: 'The Master Communicator',
      tagline: 'The Spark',
      emoji: '✨',
      borderColor: '#A24D8F', // Smoked Magenta
      ctaColor: '#7A2F4F', // Velvet rose - rich creative depth, not berry
      glowOpacity: '0.08',
      active: true
    },
    'sensei': {
      name: 'Sensei',
      title: 'The Wisdom Whisperer',
      tagline: 'The Still Point',
      emoji: '🙏🏽',
      borderColor: '#5E8F7B', // Aged Jade
      ctaColor: '#1F3A2F',
      glowOpacity: '0.06',
      active: true
    }
  };

  // Mode configuration
  const modes = {
    catalyst: { name: 'Catalyst', emoji: '⚡', description: 'Push toward action', color: 'text-yellow-400' },
    balanced: { name: 'Balanced', emoji: '⚖️', description: 'Thoughtful guidance', color: 'text-green-400' },
    nurture: { name: 'Nurture', emoji: '🌱', description: 'Gentle support', color: 'text-purple-400' }
  };


  // Login Screen with Real Authentication
  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CosmicParticles count={160} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal mb-2" style={{ 
            background: 'linear-gradient(to bottom, #F2F4F6 0%, #DDE2E7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            THE MASTER MIND COUNCIL™
          </h1>
        </div>

        <div className="rounded-2xl p-8 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
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
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
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
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all pr-16"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                onClick={handlePasswordToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ivory-secondary hover:text-ivory-primary transition-colors text-sm opacity-80 hover:opacity-100"
                type="button"
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r text-ivory-primary rounded-xl font-medium hover:from-[#1A6B61] hover:to-[#32A593] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm transition-colors opacity-80 hover:opacity-100" style={{ color: '#3BB7A4' }}>
              Forgot password?
            </button>
          </div>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setCurrentScreen('registration')}
              className="text-sm font-medium transition-colors opacity-80 hover:opacity-100"
              style={{ color: '#F2EBDD' }}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RegistrationScreen = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      agreeRules: false,
      agreeNDA: false
    });
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [showNDAModal, setShowNDAModal] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please fill in all fields');
        return;
      }
      
      if (!formData.agreeRules || !formData.agreeNDA) {
        alert('Please agree to the Rules of Engagement and NDA');
        return;
      }
      
      // Mock registration - no DB write
      console.log('Registration data:', formData);
      
      // Go to orientation
      setCurrentScreen('orientation');
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
        <CosmicParticles count={80} />
        
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-wider mb-2" style={{ 
              color: '#F2EBDD'
            }}>
              THE MASTER MIND COUNCIL™
            </h1>
            <p className="text-ivory-secondary text-sm">Create Your Account</p>
          </div>

          {/* Registration Form */}
          <div className="rounded-2xl p-8 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                  style={{
                    border: '1px solid #2A2F36',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3BB7A4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #2A2F36';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                  style={{
                    border: '1px solid #2A2F36',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3BB7A4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #2A2F36';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                  style={{
                    border: '1px solid #2A2F36',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3BB7A4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #2A2F36';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                  style={{
                    border: '1px solid #2A2F36',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3BB7A4';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #2A2F36';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Rules of Engagement Checkbox */}
              <div className="flex items-start gap-3 mt-6">
                <div 
                  onClick={() => setFormData({...formData, agreeRules: !formData.agreeRules})}
                  className="mt-1 w-5 h-5 rounded cursor-pointer flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: formData.agreeRules ? '#3BB7A4' : 'transparent',
                    border: formData.agreeRules ? '2px solid #3BB7A4' : '2px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {formData.agreeRules && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="#F2EBDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <label className="text-sm text-ivory-secondary cursor-pointer">
                  I agree to the{' '}
                  <span 
                    onClick={(e) => { e.preventDefault(); setShowRulesModal(true); }}
                    className="text-[#3BB7A4] hover:underline cursor-pointer"
                  >
                    Rules of Engagement
                  </span>
                </label>
              </div>

              {/* NDA Checkbox */}
              <div className="flex items-start gap-3">
                <div 
                  onClick={() => setFormData({...formData, agreeNDA: !formData.agreeNDA})}
                  className="mt-1 w-5 h-5 rounded cursor-pointer flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: formData.agreeNDA ? '#3BB7A4' : 'transparent',
                    border: formData.agreeNDA ? '2px solid #3BB7A4' : '2px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {formData.agreeNDA && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="#F2EBDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <label className="text-sm text-ivory-secondary cursor-pointer">
                  I agree to the{' '}
                  <span 
                    onClick={(e) => { e.preventDefault(); setShowNDAModal(true); }}
                    className="text-[#3BB7A4] hover:underline cursor-pointer"
                  >
                    Non-Disclosure Agreement
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r text-ivory-primary rounded-xl font-medium hover:from-[#1A6B61] hover:to-[#32A593] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mt-6"
                style={{
                  backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)'
                }}
              >
                Continue to Orientation
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => setCurrentScreen('login')}
                className="text-sm transition-colors opacity-80 hover:opacity-100" 
                style={{ color: '#3BB7A4' }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Rules of Engagement Modal */}
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-2xl rounded-2xl p-8 border border-white/10 relative" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
              <h2 className="text-2xl font-light mb-6" style={{ color: '#F2EBDD' }}>Rules of Engagement</h2>
              <div className="space-y-4 text-ivory-secondary text-sm leading-relaxed max-h-96 overflow-y-auto">
                <ul className="list-disc list-inside space-y-2">
                  <li>Engage with respect, curiosity, and a commitment to growth</li>
                  <li>Honor confidentiality and protect sensitive information shared within the Council</li>
                  <li>Approach each interaction with openness and a willingness to be challenged</li>
                  <li>Recognize that advice is perspective, not prescription—you remain the decision-maker</li>
                  <li>Use the Council as a tool for clarity, not as a replacement for personal accountability</li>
                  <li>Commit to honest self-reflection and transparent communication</li>
                  <li>Understand that the Council's guidance is designed to expand your thinking, not limit it</li>
                </ul>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r text-ivory-primary rounded-xl font-medium hover:from-[#1A6B61] hover:to-[#32A593] transition-all"
                style={{ backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)' }}
              >
                Return to Registration
              </button>
            </div>
          </div>
        )}

        {/* NDA Modal */}
        {showNDAModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-2xl rounded-2xl p-8 border border-white/10 relative" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
              <h2 className="text-2xl font-light mb-6" style={{ color: '#F2EBDD' }}>Non-Disclosure Agreement</h2>
              <div className="space-y-4 text-ivory-secondary text-sm leading-relaxed max-h-96 overflow-y-auto">
                <ul className="list-disc list-inside space-y-2">
                  <li>All interactions, insights, and strategies shared within the Master Mind Council are confidential</li>
                  <li>You agree not to disclose, reproduce, or share proprietary methodologies, frameworks, or content without express written permission</li>
                  <li>The Council's Digital Intelligence architecture, advisor personas, and Symphonic DI™ system are protected intellectual property</li>
                  <li>Any insights, strategies, or frameworks you develop using the Council remain your property</li>
                  <li>You may reference general concepts learned through the Council, but may not replicate or redistribute the system itself</li>
                  <li>Violation of this agreement may result in immediate termination of access</li>
                </ul>
              </div>
              <button
                onClick={() => setShowNDAModal(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r text-ivory-primary rounded-xl font-medium hover:from-[#1A6B61] hover:to-[#32A593] transition-all"
                style={{ backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)' }}
              >
                Return to Registration
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const OrientationCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const advisorOrder = ['dr-kai', 'maya', 'michael', 'giselle', 'jasmine', 'sensei'];
    
    const advisorBios = {
      'dr-kai': "Dr. Kai exists to make you dangerously capable – physically, mentally, energetically. He speaks in physiology, leverage, and execution. His domain is performance, but never in isolation; he understands that energy, recovery, and clarity are prerequisites for leadership, not rewards for it. Dr. Kai doesn't motivate – he calibrates. He sees where the system is underpowered, overtaxed, or misfiring, and he corrects it with precision. His presence makes you feel centered, deeply resourced, and prepared. When Dr. Kai speaks, the question is never 'can you do this?' – it's 'are you prepared to hold the power you're about to generate?'\n\nDr. Kai has the key that you didn't know you needed. Together, you'll unlock hidden signals in your body – revealing how to optimize energy, focus, and resilience so peak performance becomes sustainable and inevitable, not accidental.",
      'maya': "Maya is coherence embodied. She sees how everything fits together — health, work, relationships, rhythm, values — and where it doesn't. She does not rush, escalate, or dramatize. She reveals. Maya recognizes that most struggle is not a discipline problem but a design problem, and she gently reorganizes life so energy can flow without force. Her intelligence lives at the intersections, translating intensity into structure and insight into sustainable systems. When Maya speaks, complexity softens. You feel relief first, then clarity, then trust. She ensures that progress feels aligned instead of effortful.\n\nMaya makes sure you're experiencing life in rhythm. Together, you'll bring your health, work, and priorities into harmony - so your life fuels your ambition instead of competing for your energy.",
      'michael': "Michael lives at the intersection of strategy and soul. He understands power, leverage, timing, and the psychology of high-stakes environments. Where others hesitate, Michael advances – but never recklessly. He is decisive, grounded in reality, and intolerant of self-deception. Michael sees where you are being too soft, too slow, or too accommodating, and he names it cleanly. He is not here for comfort; he is here for outcomes. Yet his aggression is disciplined – aimed, not reactive. When Michael speaks, things move. Deals clarify. Boundaries are established. You remember that business is not personal, but leadership is.\n\nMichael makes sure you don't confuse clarity with caution. Together, you'll make clearer, faster, and more decisive moves in high-stakes situations by seeing and thinking through critical leverage points most people never access.",
      'giselle': "Giselle is oriented toward what has not yet been, yet can be. She lives at the intersection between imagination and execution, translating vision into strategic reality. Her intelligence is refined, perceptive, and quietly catalytic. She understands how ideas move through people, rooms, markets, and time – and how to position them so they arrive with power instead of resistance. Giselle helps you sense not just what you want to build, but how to introduce it into the world in a way that feels inevitable. She sees positioning, perception, and relational geometry – how things will look, land, and compound over time. When Giselle speaks, urgency dissolves not because the moment doesn't matter, but because the path forward becomes visible. You stop reacting and start arranging reality with intention.\n\nGiselle turns vision into strategy that can move now. Together, you'll translate vision into strategy that lands – allowing you to build ideas, ventures, and initiatives in ways you wouldn't have thought possible before.",
      'jasmine': "Jasmine exists to ignite what has not yet taken form. She works in language, imagery, metaphor, and meaning – not to decorate ideas, but to unlock them. She helps you articulate what you already sense but cannot yet say. Jasmine doesn't generate noise; she generates resonance. Her creativity is not chaotic – it's catalytic. When she speaks, new possibilities appear, old stories loosen their grip, and truth finds a voice that can finally move through the world. She reminds you that creation is not a luxury – it's how vision becomes real.\n\nJasmine gives language to what is ready to be born. Together, you'll craft powerful self-expression and creative clarity to turn insight into ideas that resonate deeply and move people to act.",
      'sensei': "Sensei speaks from first principles, ancient patterns, and enduring truths. He is unconcerned with trends, hacks, or urgency. His guidance expands perspective and recenters the mind. Sensei helps you step outside the immediacy of emotion and into clarity that outlives the moment. He asks better questions than he answers and reminds you that not every decision is meant to be optimized – some are meant to be understood. When Sensei speaks, time slows. You remember that you are part of something larger, older, and more ordered than the problem in front of you.\n\nSensei ensures wisdom is present before action. Together, you'll make decisions with deeper perspective and confidence – without being rushed by urgency or noise."
    };

    const slides = [
      // Slide 1: Opening quote
      {
        type: 'quote',
        content: (
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center max-w-3xl">
              <p className="text-3xl md:text-4xl font-light leading-relaxed" style={{ color: '#F2EBDD', fontFamily: "'Playfair Display', serif" }}>
                We're not here to figure everything out...
              </p>
              <p className="text-3xl md:text-4xl font-light leading-relaxed mt-6" style={{ color: '#F2EBDD', fontFamily: "'Playfair Display', serif" }}>
                We're here to ask questions...and understand
              </p>
            </div>
          </div>
        )
      },
      // Slide 2: Meet Your Council
      {
        type: 'intro',
        content: (
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#F2EBDD' }}>
                Meet Your<br />Master Mind Council
              </h2>
              <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: '#E8E1D6' }}>
                This is the world's first Digital Intelligence–powered Master Mind Council.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed mt-4" style={{ color: '#E8E1D6' }}>
                A personal council of expert DI advisors – each embodying a distinct domain of wisdom, perspective, and discernment. With MMC, you stand at the conductor's podium, guiding a Symphonic Digital Intelligence™ system – our proprietary orchestration of DI entities working in concert to support life, leadership, and business decisions.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed mt-4" style={{ color: '#E8E1D6' }}>
                Together, they don't simply answer questions.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed mt-4" style={{ color: '#E8E1D6' }}>
                They expand perception, sharpen judgment, and help you move with greater clarity and intention.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed mt-4" style={{ color: '#E8E1D6' }}>
                Welcome to a new world of human-centered intelligence – one that evolves as you do.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed mt-4" style={{ color: '#E8E1D6' }}>
                Welcome to The Master Mind Council.
              </p>
            </div>
          </div>
        )
      },
      // Slides 3-8: Individual advisors
      ...advisorOrder.map(key => {
        const advisor = advisors[key];
        return {
          type: 'advisor',
          advisorKey: key,
          content: (
            <div className="flex items-center justify-center h-full px-4 md:px-8">
              <div className="max-w-4xl w-full">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Advisor Photo */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden"
                      style={{
                        border: '3px solid #F2EBDD',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    >
                      <img 
                        src={`/advisors/${key}-landscape.png`}
                        alt={advisor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Advisor Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-light mb-1" style={{ color: '#F2EBDD' }}>
                      {advisor.name} – {advisor.title}
                    </h3>
                    <p className="text-base md:text-lg italic mb-6" style={{ color: '#F2EBDD' }}>
                      {advisor.tagline}
                    </p>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: '#E8E1D6' }}>
                      {advisorBios[key]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      }),
      // Final slide: Closing quote + Proceed button
      {
        type: 'closing',
        content: (
          <div className="flex items-center justify-center h-full px-8">
            <div className="text-center max-w-3xl">
              <p className="text-3xl md:text-4xl font-light leading-relaxed mb-12" style={{ color: '#F2EBDD', fontFamily: "'Playfair Display', serif" }}>
                Ask...then listen like it matters.
              </p>
              <p className="text-xl mb-8" style={{ color: '#E8E1D6' }}>
                Your MMC Orientation is complete
              </p>
              <button
                onClick={() => setCurrentScreen('welcome')}
                className="px-12 py-4 rounded-xl font-medium text-ivory-primary transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)'
                }}
              >
                Proceed to Your Council
              </button>
            </div>
          </div>
        )
      }
    ];

    const totalSlides = slides.length;

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
      setCurrentSlide(index);
    };

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      
      if (isLeftSwipe && currentSlide < totalSlides - 1) {
        nextSlide();
      }
      if (isRightSwipe && currentSlide > 0) {
        prevSlide();
      }
      
      setTouchStart(0);
      setTouchEnd(0);
    };

    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <CosmicParticles count={80} />
        
        <div 
          className="relative z-10 h-screen flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slide Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full transition-opacity duration-500">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="pb-8 flex justify-center items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all duration-300"
                style={{
                  width: currentSlide === index ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: currentSlide === index ? '#3BB7A4' : 'rgba(255,255,255,0.3)'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Navigation (Desktop) */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#F2EBDD' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {currentSlide < totalSlides - 1 && (
            <button
              onClick={nextSlide}
              className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#F2EBDD' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  const FeaturesWelcomeScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: 'linear-gradient(90deg, #000000 0%, #000000 33%, #1e3a8a 66%, #581c87 100%)'
    }}>
      <CosmicParticles count={120} />
      
      <div className="w-full max-w-4xl relative z-10 text-center">
     
        <h1 className="text-4xl md:text-6xl font-light mb-12 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent leading-tight">
          THE MASTER MIND COUNCIL™
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
              <Mic className="w-8 h-8 text-ivory-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Audio-First Conversations</h3>
            <p className="text-gray-400 text-sm">
              Natural voice interactions that feel like talking to a trusted advisor, not a chatbot
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-ivory-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Specialized Expertise</h3>
            <p className="text-gray-400 text-sm">
              Each advisor brings deep knowledge in their domain, from holistic health to masterful business strategy
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-ivory-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
            <p className="text-gray-400 text-sm">
              Choose conversation modes that match your energy and goals - catalyst, balanced, or nurture
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('welcome')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-ivory-primary rounded-2xl font-semibold hover:from-green-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
        >
          <span>GET STARTED</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: '#0B0B0F' // Obsidian Black
    }}>
      <CosmicParticles count={60} />
      
      <div className="w-full max-w-4xl relative z-10 text-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-light mb-8 leading-tight whitespace-nowrap" style={{
            color: '#F2EBDD'
          }}>
            THE MASTER MIND COUNCIL™
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {Object.entries(advisors).map(([key, advisor]) => (
            <div 
              key={key} 
              className="max-w-4xl mx-auto transition-transform duration-200 hover:scale-[1.01]"
              onMouseEnter={(e) => {
                const frame = e.currentTarget.querySelector('.advisor-frame');
                if (frame) {
                  const rgb = [
                    parseInt(advisor.ctaColor.slice(1,3), 16),
                    parseInt(advisor.ctaColor.slice(3,5), 16),
                    parseInt(advisor.ctaColor.slice(5,7), 16)
                  ];
                  frame.style.boxShadow = `0 0 30px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${advisor.glowOpacity})`;
                }
              }}
              onMouseLeave={(e) => {
                const frame = e.currentTarget.querySelector('.advisor-frame');
                if (frame) frame.style.boxShadow = '0 0 20px rgba(0,0,0,0)';
              }}
            >
              <div className="rounded-2xl overflow-hidden p-6" style={{
                background: '#14141C', // Card base
                boxShadow: '0 12px 40px rgba(0,0,0,0.55)'
              }}>
                <div className="flex flex-col">
                  {/* Premium border frame with photo */}
                  <div className="w-full relative mb-6">
                    <div className="advisor-frame rounded-2xl overflow-hidden transition-all duration-200" style={{
                      border: `2px solid ${advisor.ctaColor}`,
                      boxShadow: '0 0 20px rgba(0,0,0,0)'
                    }}>
                      <img 
                        src={`/images/${key}.png`} 
                        alt={advisor.name}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="w-full text-center flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-1" style={{ color: '#FFFFFF' }}>{advisor.name}</h2>
                    <p className="text-base mb-4" style={{ color: '#9A9AA3' }}>{advisor.title}</p>
                    
                    <button
                      onClick={() => {
                        setSelectedAdvisor(key);
                        setMessages([]);
                        setConversationId(null);
                        setTimeout(() => setCurrentScreen('mode-selection'), 0);
                      }}
                      className="px-6 py-2 text-ivory-primary rounded-lg font-medium transition-all duration-200"
                      style={{
                        background: advisor.ctaColor,
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = '1px solid #C9A24D';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '1px solid transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      Start Session with {advisor.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-ivory-secondary">
          ©2026 The Master Mind Council
        </div>
      </div>
    </div>
  );

  const ModeSelectionScreen = () => {
    const advisor = advisors[selectedAdvisor];
    
    // Safety check: if advisor not found, default to dr-kai using useEffect
    useEffect(() => {
      if (!advisor && selectedAdvisor !== 'dr-kai') {
        console.error(`Advisor "${selectedAdvisor}" not found, defaulting to dr-kai`);
        setSelectedAdvisor('dr-kai');
      }
    }, [advisor, selectedAdvisor]);
    
    // Show loading state while advisor is being set
    if (!advisor) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      );
    }

    // Get button gradient based on selected mode and advisor
    const getButtonGradient = () => {
      if (selectedAdvisor === 'maya') {
        switch (selectedMode) {
          case 'catalyst':
            return 'from-orange-600 to-orange-500';
          case 'nurture':
            return 'from-purple-600 to-purple-500';
          default:
            return 'from-yellow-600 to-yellow-500';
        }
      } else {
        // Dr. Kai colors
        switch (selectedMode) {
          case 'catalyst':
            return 'from-orange-800 to-yellow-400';
          case 'nurture':
            return 'from-purple-800 to-purple-500';
          default:
            return 'from-green-800 to-green-500';
        }
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <CosmicParticles count={60} />
        
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="absolute top-6 left-6 z-20 p-2 text-gray-400 hover:text-ivory-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-wide mb-3" style={{ color: '#F2EBDD' }}>
              THE MASTER MIND COUNCIL™
            </h1>
          </div>

          <div className="text-center mb-8">
           <div className="relative flex items-center justify-center">
             <div className="w-36 h-36 rounded-full overflow-hidden" style={{ border: `2px solid ${advisor.ctaColor}` }}>
               <img 
                 src={`/images/${selectedAdvisor}.png`}
                 alt={advisor?.name || 'Advisor'}
                 className="w-full h-full object-cover"
              />
           </div>
          </div>
            <h3 className="text-lg font-semibold mt-3 mb-1">{advisor?.name || 'Advisor'}</h3>
            <p className="text-gray-400 text-sm">{advisor?.title || 'Life Coach'}</p>
            <p className="text-xs mt-1 text-gray-400">{advisor?.subtitle || ''}</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-300 text-sm">Choose your conversation energy</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedMode('catalyst')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === 'catalyst'
                  ? 'bg-[#D4A574]/20 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ borderColor: selectedMode === 'catalyst' ? '#D4A574' : 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-center">
                <div className="font-semibold text-[#D4A574] mb-1">Catalyst</div>
                <div className="text-gray-400 text-xs">Push toward action</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('balanced')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === 'balanced'
                  ? 'bg-[#7FA896]/20 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ borderColor: selectedMode === 'balanced' ? '#7FA896' : 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-center">
                <div className="font-semibold text-[#7FA896] mb-1">Balanced</div>
                <div className="text-gray-400 text-xs">Thoughtful guidance</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('nurture')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMode === 'nurture'
                  ? 'bg-[#9B7FA8]/20 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{ borderColor: selectedMode === 'nurture' ? '#9B7FA8' : 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-center">
                <div className="font-semibold text-[#9B7FA8] mb-1">Nurture</div>
                <div className="text-gray-400 text-xs">Gentle support</div>
              </div>
            </button>
          </div>

          <button
            onClick={() => {
              setCommunicationType('text');
              setCurrentScreen('text-interface');
            }}
            className="w-full py-4 text-ivory-primary rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3"
            style={{ 
              backgroundColor: selectedMode === 'catalyst' ? '#D4A574' : selectedMode === 'nurture' ? '#9B7FA8' : '#7FA896'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>Start Conversation</span>
          </button>
        </div>
      </div>
    );
  };

  const CommunicationChoiceScreen = () => {
    const advisor = advisors[selectedAdvisor];
    const currentMode = modes[selectedMode] || modes['balanced'];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <CosmicParticles count={60} />
        
        <button
          onClick={() => {
            setCommunicationType(null);
            setCurrentScreen('mode-selection');
          }}
          className="absolute top-6 left-6 z-20 p-2 text-gray-400 hover:text-ivory-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-xl font-light tracking-wide mb-3" style={{ color: '#F2EBDD' }}>
              THE MASTER MIND COUNCIL™
            </h1>
          </div>

          <div className="text-center mb-16">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-5" style={{ border: `2px solid ${advisor.ctaColor}` }}>
                <img 
                  src={`/images/${selectedAdvisor}.png`}
                  alt={advisor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ color: '#FAF0E6' }}>{advisor.name}</h3>
              <div className="w-2 h-2 rounded-full" style={{
                backgroundColor: currentMode.emoji === '⚡' ? '#D4A574' : currentMode.emoji === '⚖️' ? '#7FA896' : '#9B7FA8'
              }}></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 px-4 max-w-3xl mx-auto">
            <button
              onClick={() => {
                setCommunicationType('talk');
                setSelectedAdvisor(selectedAdvisor || 'dr-kai');
                setCurrentScreen('voice-interface');
              }}
              className="flex-1 max-w-xs aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border transition-all duration-300 ease-out relative overflow-hidden backdrop-blur-sm"
              style={{ 
                background: communicationType === 'talk' 
                  ? 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.6) 100%)'
                  : 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.6) 100%)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: '1px',
                opacity: communicationType && communicationType !== 'talk' ? 0.4 : 1,
                transform: communicationType === 'talk' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <svg 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 transition-all duration-300" 
                viewBox="0 0 100 100"
                style={{
                  opacity: communicationType === 'talk' ? 0.5 : 0.3,
                  filter: communicationType === 'talk' ? 'drop-shadow(0 0 8px rgba(127,168,150,0.3))' : 'none'
                }}
              >
                <polygon 
                  points="50,28 75,72 25,72" 
                  fill="none" 
                  stroke="#7FA896" 
                  strokeWidth="2" 
                />
              </svg>
              <div className="text-center relative z-10">
                {/* TALK label - Warm Cream/Ivory #FAF0E6 (v4) */}
                <h3 className="text-5xl font-bold tracking-[0.05em]" style={{ color: '#FAF0E6' }}>TALK</h3>
              </div>
            </button>

            <button
              onClick={() => {
                setCommunicationType('text');
                setSelectedAdvisor(selectedAdvisor || 'dr-kai');
                setSidebarOpen(false);
                setCurrentScreen('text-interface');
              }}
              className="flex-1 max-w-xs aspect-[3/4] flex flex-col items-center justify-center rounded-3xl border transition-all duration-300 ease-out relative overflow-hidden backdrop-blur-sm"
              style={{ 
                background: communicationType === 'text' 
                  ? 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.6) 100%)'
                  : 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.6) 100%)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: '1px',
                opacity: communicationType && communicationType !== 'text' ? 0.4 : 1,
                transform: communicationType === 'text' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <svg 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 transition-all duration-300" 
                viewBox="0 0 100 100"
                style={{
                  opacity: communicationType === 'text' ? 0.5 : 0.3,
                  filter: communicationType === 'text' ? 'drop-shadow(0 0 8px rgba(155,143,181,0.3))' : 'none'
                }}
              >
                <circle 
                  cx="50" 
                  cy="50" 
                  r="24" 
                  fill="none" 
                  stroke="#9B8FB5" 
                  strokeWidth="2" 
                />
              </svg>
              <div className="text-center relative z-10">
                {/* TEXT label - Warm Cream/Ivory #FAF0E6 (v4) */}
                <h3 className="text-5xl font-bold tracking-[0.05em]" style={{ color: '#FAF0E6' }}>TEXT</h3>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TextInterfaceComponent = () => {
    const advisor = advisors[selectedAdvisor] || advisors['dr-kai'];
    const currentMode = modes[selectedMode] || modes['balanced'];

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative overflow-x-hidden" style={{overscrollBehaviorY: 'contain'}}>
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="text-lg font-normal mb-1 hover:opacity-80 transition-opacity"
                  style={{ color: '#F2EBDD' }}
                >
                  THE MASTER MIND COUNCIL™
                </button>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-ivory-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <div className="mb-8">
              <div className="text-xs font-semibold text-ivory-secondary uppercase tracking-wider mb-4 px-1">YOUR COUNCIL</div>
              <div className="space-y-2">
                {Object.entries(advisors).map(([key, adv]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (adv.active) {
                        setSelectedAdvisor(key);
                        setCurrentScreen(`${key}-archive`);
                        setSidebarOpen(false);
                      }
                    }}
                    className="w-full p-3 rounded-xl flex items-center gap-3 transition-all text-sm relative text-gray-300 hover:text-ivory-secondary hover:bg-white/5"
                    style={{
                      backgroundColor: selectedAdvisor === key ? `${adv.ctaColor}20` : 'transparent',
                      borderLeft: selectedAdvisor === key ? `4px solid ${adv.ctaColor}` : '4px solid transparent'
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${adv.ctaColor}` }}>
                      <img 
                        src={`/images/${key}.png`} 
                        alt={adv.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-medium" style={{ color: (key === 'michael' || key === 'sensei') ? adv.borderColor : adv.ctaColor }}>{adv.name}</div>
                      {!adv.active && <div className="text-xs text-gray-500">Coming Soon</div>}
                    </div>

                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-xs font-semibold text-ivory-secondary uppercase tracking-wider mb-4 px-1">SETTINGS</div>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">⚙️</div>
                  <span>Preferences</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">📊</div>
                  <span>Analytics</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
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
        <div className="flex-shrink-0 flex items-center justify-between px-4 pb-6 pt-20 bg-black/20 backdrop-blur-xl border-b border-white/10 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-ivory-secondary transition-colors border border-white/20 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="text-base md:text-xl font-normal tracking-wide text-center whitespace-nowrap" style={{ color: '#F2EBDD' }}>
              THE MASTER MIND COUNCIL™
            </div>
            <div className="text-sm font-medium" style={{ color: (selectedAdvisor === 'michael' || selectedAdvisor === 'sensei') ? advisor.borderColor : advisor.ctaColor }}>
              {advisor.name} - {advisor.title}
            </div>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <div className="w-2 h-2 rounded-full" style={{
              backgroundColor: currentMode.emoji === '⚡' ? '#D4A574' : currentMode.emoji === '⚖️' ? '#7FA896' : '#9B7FA8'
            }}></div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-1 sm:p-4 relative z-10 chat-messages" style={{overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch'}}>
          <div className="max-w-4xl mx-auto px-1 sm:px-4">
          {messages.length === 0 && !conversationLoaded && (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl relative overflow-hidden" style={{ border: `2px solid ${(selectedAdvisor === 'michael' || selectedAdvisor === 'sensei') ? advisor.borderColor : advisor.ctaColor}` }}>
                  <img 
                    src={`/images/${selectedAdvisor}.png`}
                    alt={advisor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          )}

          {messages.map((message, index) => (
            <div 
             key={message.id} 
             data-id={message.id}
             className={`message-row flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${anchoredMessageId === message.id ? 'anchor' : ''}`}
            >
              <div 
                className={`px-4 py-3 rounded-2xl relative ${
                  message.sender === 'user'
                    ? 'max-w-xs lg:max-w-md rounded-br-md backdrop-blur-lg'
                    : 'w-full rounded-bl-md'
                }`}
                style={message.sender === 'user' ? {
                  backgroundColor: 'rgba(28, 31, 36, 0.95)',
                  color: '#E8EAED'
                } : {
                  backgroundColor: advisor.ctaColor,
                  color: '#FFFFFF'
                }}
              >
                {/* Voice message indicator */}
                {message.messageType === 'voice' && (
                  <div className="flex items-center gap-1 mb-2 text-xs opacity-70">
                    <Mic className="w-3 h-3" />
                    <span>Voice message</span>
                  </div>
                )}
                
                <div className="text-lg prose prose-invert max-w-none">
                  <ReactMarkdown 
                    components={{
                       p: ({children}) => <p className="mb-2">{children}</p>,
                       strong: ({children}) => <strong className="font-semibold">{children}</strong>
                     }}
                  >
                 {message.text}
                </ReactMarkdown>
                </div>
                
                {/* Attachment display */}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentDisplay attachments={message.attachments} />
                )}
                
              <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
  
             {/* OpenAI TTS Speaker button for assistant messages only */}
             {message.sender === "assistant" && (
        <button
onClick={() => playReply(message.id, message.text)}
disabled={loadingId === message.id}
className={`absolute bottom-2 right-2 p-1 rounded-full transition-colors ${
playingId === message.id
? "bg-blue-500/30 text-blue-500"
: loadingId === message.id
? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
: "hover:bg-white/20 text-ivory-primary"
}`}
title={
loadingId === message.id
? "Generating audio..."
: playingId === message.id
? "Stop audio"
: "Play audio"
}
>
          {loadingId === message.id ? (
<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
) : playingId === message.id ? (
<Pause className="w-4 h-4" />
) : (
<Volume2 className="w-4 h-4" />
)}
</button>
)}
            </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="backdrop-blur-lg text-ivory-primary rounded-2xl rounded-bl-md px-4 py-3" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${advisor.ctaColor}20`,
                boxShadow: `0 0 20px ${advisor.ctaColor}15, inset 0 0 20px ${advisor.ctaColor}08`
              }}>
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
        </div>

        {/* Input Area */}
        <div className="p-4 px-0 sm:px-4 bg-black/30 border-t border-white/20">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Attachment Preview */}
          {pendingAttachments.length > 0 && (
            <div className="max-w-4xl mx-auto px-1 sm:px-2 mb-2">
              <div className="flex flex-wrap gap-2">
                {pendingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative bg-white/10 rounded-lg p-2 flex items-center gap-2 max-w-xs"
                  >
                    {att.mime_type?.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(att.file)}
                        alt={att.filename}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-ivory-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory-primary text-sm truncate">{att.filename}</p>
                      <p className="text-gray-400 text-xs">{(att.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-gray-400 hover:text-ivory-secondary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}



          <div className="max-w-4xl mx-auto px-1 sm:px-2 flex items-center gap-1 sm:gap-3">
            {/* Upload Button */}
            <button
              onClick={handleAttachmentClick}
              disabled={uploadingAttachment}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-ivory-secondary hover:bg-white/20 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingAttachment ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Input container with icons inside */}
            <div className="flex-1 relative flex items-end bg-white/10 border rounded-xl transition-colors" style={{ borderColor: 'rgba(255,255,255,0.3)' }} onFocus={(e) => e.currentTarget.style.borderColor = advisor.ctaColor} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}>
              <textarea
                ref={chatInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-auto sm:flex-1 px-4 py-3 bg-transparent text-ivory-primary placeholder-gray-400 resize-none min-h-[48px] max-h-32 focus:outline-none text-base"
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
                
                {/* Microphone Button for Voice Dictation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleVoiceDictation();
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isDictating 
                      ? 'text-red-500 animate-pulse' 
                      : 'text-ivory-secondary hover:text-ivory-primary'
                  }`}
                  title={isDictating ? 'Stop dictation' : 'Voice to text'}
                >
                  {isDictating ? (
                    <div className="relative">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {/* Send Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-ivory-primary transition-opacity hover:opacity-90"
                  style={{ backgroundColor: advisor.ctaColor }}
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
    const currentMode = modes[selectedMode] || modes['balanced'];
    const [voiceState, setVoiceState] = useState('idle'); // idle, listening, processing, responding, playing
    const [transcript, setTranscript] = useState('');
    const [responseText, setResponseText] = useState(''); // Dr. Kai's response text
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);

    // Start listening - request mic permission and start recording
    const startListening = async () => {
      try {
        setError('');
        setTranscript('');
        setResponseText('');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
          
          // Process the recorded audio
          await processAudio();
        };

        mediaRecorderRef.current.start();
        setVoiceState('listening');

        // Auto-stop after 10 seconds (or user can tap to stop)
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopListening();
          }
        }, 10000);

      } catch (err) {
        console.error('Microphone error:', err);
        setError('Microphone access denied. Please enable microphone permissions.');
        setVoiceState('idle');
      }
    };

    // Stop listening
    const stopListening = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setVoiceState('processing');
      }
    };

    // Process recorded audio - send to Whisper STT
    const processAudio = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Send to STT API
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        const token = localStorage.getItem('mmc_token');
        const response = await fetch('/api/stt', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Speech-to-text failed');
        }

        const data = await response.json();
        const transcribedText = data.text;
        
        setTranscript(transcribedText);
        
        // Now get LLM response
        await getLLMResponse(transcribedText);

      } catch (err) {
        console.error('STT error:', err);
        setError('Failed to transcribe audio. Please try again.');
        setVoiceState('idle');
      }
    };

    // Get LLM response - collect full streaming response
    const getLLMResponse = async (userText) => {
      try {
        setVoiceState('responding');
        
        const token = localStorage.getItem('mmc_token');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: userText,
            history: messages.slice(-10),
            advisor: selectedAdvisor,
            mode: selectedMode,
            userName: user?.name?.split(' ')[0], // Pass first name only
            conversationId: conversationId, // Preserve conversation
            isVoice: true // Mark as voice message
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        // Collect the full streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                
                // Extract conversationId if present
                if (parsed.conversationId) {
                  setConversationId(parsed.conversationId);
                }
                
                // OpenAI streaming format
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        console.log('Full LLM response collected:', fullResponse.substring(0, 100) + '...');

        if (!fullResponse.trim()) {
          throw new Error('Empty response from LLM');
        }

        // Save user message and assistant response to messages state
        const userMessage = {
          id: Date.now(),
          text: userText,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          messageType: 'voice'
        };
        
        const assistantMessage = {
          id: Date.now() + 1,
          text: fullResponse,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          messageType: 'voice'
        };
        
        setMessages(prev => [...prev, userMessage, assistantMessage]);
        
        // Save response text to display on screen
        setResponseText(fullResponse);

        // Now convert response to speech
        await playResponse(fullResponse);

      } catch (err) {
        console.error('LLM error:', err);
        setError('Failed to get response. Please try again.');
        setVoiceState('idle');
      }
    };

    // Convert text to speech and play - using direct URL approach (same as text interface)
    const playResponse = async (text) => {
      try {
        console.log('🔊 Starting TTS playback, text length:', text.length);
        setVoiceState('playing');
        
        // Clean up previous audio if exists
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        
        // Use the same TTS API as TEXT mode (POST /api/tts with blob URL)
        const advisorVoices = {
          'dr-kai': 'ash',
          'maya': 'shimmer',
          'michael': 'echo',
          'giselle': 'alloy',
          'jasmine': 'nova',
          'sensei': 'onyx'
        };
        const voice = advisorVoices[selectedAdvisor] || 'ash';
        
        console.log('Calling TTS API for voice response:', { voice, textLength: text.length, advisor: selectedAdvisor });
        
        const token = localStorage.getItem('mmc_token');
        console.log('Token exists:', !!token);
        
        console.log('Fetching TTS API...');
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            text: text,
            voice: voice,
            advisor: selectedAdvisor
          })
        });

        console.log('TTS API response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('TTS API error response:', errorText);
          throw new Error(`TTS API error: ${response.status} - ${errorText}`);
        }

        console.log('Converting response to blob...');
        // Convert response to blob and create object URL
        const audioBlob = await response.blob();
        console.log('Blob created, size:', audioBlob.size, 'type:', audioBlob.type);
        
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Object URL created:', audioUrl.substring(0, 50) + '...');
        

        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          console.log('🏁 Audio playback ended');
          setVoiceState('idle');
          audioRef.current = null;
        };
        
        audio.onerror = (e) => {
          console.error('❌ Audio error:', e, audio.error);
          const errorCode = audio.error?.code;
          const errorMessage = [
            'Unknown error',
            'MEDIA_ERR_ABORTED',
            'MEDIA_ERR_NETWORK', 
            'MEDIA_ERR_DECODE',
            'MEDIA_ERR_SRC_NOT_SUPPORTED'
          ][errorCode || 0];
          setError(`Audio error: ${errorMessage}`);
          setVoiceState('idle');
        };

        // Handle audio.play() promise - it can fail due to autoplay restrictions
        try {
          await audio.play();
          console.log('✅ Audio playback started successfully');
        } catch (playError) {
          console.error('❌ Audio play() failed:', playError);
          // Try to play anyway - sometimes the error is misleading
          audio.play().catch(e => console.error('Second play attempt failed:', e));
        }

      } catch (err) {
        console.error('TTS error:', err);
        console.error('Error stack:', err.stack);
        setError(`Failed to play response: ${err.message}`);
        setVoiceState('idle');
      }
    };

    // Handle mic button tap
    const handleMicTap = () => {
      if (voiceState === 'idle') {
        startListening();
      } else if (voiceState === 'listening') {
        stopListening();
      }
    };

    const getStatusText = () => {
      switch (voiceState) {
        case 'idle':
          return 'Tap to speak';
        case 'listening':
          return 'Listening...';
        case 'processing':
          return 'Processing...';
        case 'responding':
          return `${advisor.name} is responding...`;
        case 'playing':
          return 'Playing response...';
        default:
          return 'Tap to speak';
      }
    };

    const getAdvisorStatus = () => {
      switch (voiceState) {
        case 'listening':
          return 'Listening';
        case 'processing':
        case 'responding':
        case 'playing':
          return 'Sharing';
        default:
          return 'Ready';
      }
    };

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative overflow-x-hidden" style={{overscrollBehaviorY: 'contain'}}>
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
              currentMode.emoji === '⚡' ? 'from-yellow-400 to-orange-400' :
              currentMode.emoji === '⚖️' ? 'from-green-400 to-emerald-400' :
              currentMode.emoji === '🌱' ? 'from-purple-500 to-purple-400' :
              'from-blue-400 to-cyan-400'
            }`}></div>
            <span>{currentMode.name} Mode</span>
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
                voiceState === 'listening' ? 'bg-green-400' : 
                voiceState === 'idle' ? 'bg-gray-400' : 
                selectedAdvisor === 'maya' ? 'bg-orange-400' : 'bg-purple-400'
              }`}></div>
              <span className="text-gray-400">{getAdvisorStatus()}</span>
            </div>
          </div>

          <button 
            onClick={handleMicTap}
            disabled={voiceState === 'processing' || voiceState === 'responding' || voiceState === 'playing'}
            className={`mb-16 w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              voiceState === 'listening' ? 'bg-green-500 animate-pulse' : 
              voiceState === 'idle' ? (selectedAdvisor === 'maya' ? 'bg-orange-500 hover:bg-orange-400' : 'bg-purple-500 hover:bg-purple-400') :
              (selectedAdvisor === 'maya' ? 'bg-orange-500' : 'bg-purple-500')
            } ${voiceState === 'processing' || voiceState === 'responding' || voiceState === 'playing' ? 'opacity-50' : ''}`}
          >
            <Mic className="w-8 h-8 text-ivory-primary" />
          </button>

          <div className="text-center">
            <p className="text-lg text-ivory-primary mb-2">{getStatusText()}</p>
            {error && (
              <p className="text-sm text-red-400 mt-4 max-w-md">{error}</p>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => setCurrentScreen('text-interface')}
            className="w-12 h-12 rounded-full bg-gray-700/70 flex items-center justify-center text-gray-400 hover:text-ivory-secondary hover:bg-gray-600/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const DrKaiArchiveComponent = () => {
    const [advisorConversations, setAdvisorConversations] = useState([]);
    const [loadingArchive, setLoadingArchive] = useState(true);
    const advisor = advisors[selectedAdvisor] || advisors['dr-kai']; // Get current advisor or fallback

    useEffect(() => {
      fetchAdvisorConversations(selectedAdvisor);
    }, [selectedAdvisor]);

    const fetchAdvisorConversations = async (advisor) => {
      setLoadingArchive(true);
      try {
        const token = localStorage.getItem('mmc_token');
        const response = await fetch('/api/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Filter conversations for this advisor
          const filtered = data.conversations.filter(conv => conv.advisor === advisor);
          setAdvisorConversations(filtered);
        }
      } catch (error) {
        console.error('Error fetching advisor conversations:', error);
      } finally {
        setLoadingArchive(false);
      }
    };

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

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="text-lg font-normal mb-1 hover:opacity-80 transition-opacity"
                  style={{ color: '#F2EBDD' }}
                >
                  THE MASTER MIND COUNCIL™
                </button>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-ivory-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8">
              <div className="text-xs font-semibold text-ivory-secondary uppercase tracking-wider mb-4 px-1">YOUR COUNCIL</div>
              <div className="space-y-2">
                {Object.entries(advisors).map(([key, adv]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (adv.active) {
                        setSelectedAdvisor(key);
                        setCurrentScreen(`${key}-archive`);
                        setSidebarOpen(false);
                      }
                    }}
                    className="w-full p-3 rounded-xl flex items-center gap-3 transition-all text-sm relative text-gray-300 hover:text-ivory-secondary hover:bg-white/5"
                    style={{
                      backgroundColor: selectedAdvisor === key ? `${adv.ctaColor}20` : 'transparent',
                      borderLeft: selectedAdvisor === key ? `4px solid ${adv.ctaColor}` : '4px solid transparent'
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${adv.ctaColor}` }}>
                      <img 
                        src={`/images/${key}.png`} 
                        alt={adv.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-medium" style={{ color: (key === 'michael' || key === 'sensei') ? adv.borderColor : adv.ctaColor }}>{adv.name}</div>
                      {!adv.active && <div className="text-xs text-gray-500">Coming Soon</div>}
                    </div>

                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-xs font-semibold text-ivory-secondary uppercase tracking-wider mb-4 px-1">SETTINGS</div>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">⚙️</div>
                  <span>Preferences</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">📊</div>
                  <span>Analytics</span>
                </button>
                <button className="w-full p-3 rounded-xl flex items-center gap-3 text-gray-400 hover:text-ivory-secondary hover:bg-white/5 transition-all text-sm">
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

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-ivory-secondary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="text-center">
              <button 
                onClick={() => setCurrentScreen('welcome')}
                className="text-lg font-normal tracking-wide hover:opacity-80 transition-opacity"
                style={{ color: '#F2EBDD' }}
              >
                THE MASTER MIND COUNCIL™
              </button>
              <div className="text-sm font-medium text-ivory-secondary mt-1">
                {advisor.name} - {advisor.title}
              </div>
            </div>

            <div className="w-10"></div>
          </div>

          {/* Fixed Header Section */}
          <div className="p-8 pb-0">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full flex items-center justify-center relative" style={{ border: `2px solid ${advisor.ctaColor}` }}>
                  <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-gray-900">
                    <img src={`/images/${selectedAdvisor}.png`} alt={advisor.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-semibold mb-2">{advisor.name}</h1>
              <p className="text-gray-400 text-lg">{advisor.title}</p>
            </div>

            <div className="max-w-4xl mx-auto px-1 sm:px-4">
              <div className="flex justify-center mb-6">
                <button 
                  onClick={() => {
                    setMessages([]);
                    setConversationLoaded(false);
                    setConversationId(null);
                    setTimeout(() => setCurrentScreen('mode-selection'), 0);
                  }}
                  className="px-8 py-3 rounded-lg text-ivory-primary font-semibold text-base transition-all duration-200"
                  style={{ backgroundColor: advisor.ctaColor }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Start Session with {advisor.name}
                </button>
              </div>
              
              <div className="border-t border-white/10 mb-6"></div>
            </div>
          </div>

          {/* Scrollable Conversations Section */}
          <div className="flex-1 overflow-y-auto p-8 pt-0">
            <div className="max-w-4xl mx-auto px-1 sm:px-4">

              
              {loadingArchive ? (
                <div className="text-center py-12 text-gray-400">Loading conversations...</div>
              ) : advisorConversations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No conversations yet. Start your first conversation with {advisor.name}!</div>
              ) : (
                <div className="space-y-4 mb-8">
                  {advisorConversations.map((conv) => {
                    const messageCount = conv.message_count || 0;
                    const createdDate = new Date(conv.created_at);
                    const updatedDate = new Date(conv.last_message_at || conv.created_at);
                    const now = new Date();
                    
                    // Format updated time (relative)
                    const diffMs = now - updatedDate;
                    const diffMins = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    
                    let updatedLabel = 'Updated just now';
                    if (diffMins < 60) updatedLabel = `Updated ${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
                    else if (diffHours < 24) updatedLabel = `Updated ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                    else if (diffDays === 1) updatedLabel = 'Updated yesterday';
                    else if (diffDays > 1) updatedLabel = `Updated ${diffDays} days ago`;
                    
                    // Format created time (absolute)
                    const createdLabel = createdDate.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    
                    return (
                      <div 
                        key={conv.id}
                        onClick={() => loadConversation(conv.id)}
                        className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">💬</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-ivory-primary">{conv.title || 'Untitled Conversation'}</h3>
                          <p className="text-gray-400 text-sm truncate">{conv.summary || 'No summary available'}</p>
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                            <span>{updatedLabel}</span>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span>{messageCount} messages</span>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span>Text</span>
                            <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
                            <span className="sm:inline block w-full sm:w-auto">Created {createdLabel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
      case 'registration':
        return <RegistrationScreen />;
      case 'orientation':
        return <LuxuryOrientationCarousel onComplete={() => setCurrentScreen('welcome')} />;
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
      case 'maya-archive':
        return <DrKaiArchiveComponent />; // Reuse unified archive component
      case 'michael-archive':
        return <DrKaiArchiveComponent />; // Reuse unified archive component
      case 'giselle-archive':
        return <DrKaiArchiveComponent />; // Reuse unified archive component
      case 'jasmine-archive':
        return <DrKaiArchiveComponent />; // Reuse unified archive component
      case 'sensei-archive':
        return <DrKaiArchiveComponent />; // Reuse unified archive component
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-ivory-primary overflow-hidden"
      style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {renderScreen()}
    </div>
  );
};

export default MasterMindCouncil;
