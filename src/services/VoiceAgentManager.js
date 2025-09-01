import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

class VoiceAgentManager {
  constructor() {
    this.agent = null;
    this.session = null;
    this.isConnected = false;
    this.listeners = new Set();
    this.isInitializing = false;
  }

  async initialize(selectedMode, modes) {
    if (this.session || this.isInitializing) {
      console.log('Voice agent already initialized or initializing');
      return;
    }
    
    this.isInitializing = true;
    console.log('🚀 Initializing voice agent service...');
    
    try {
      const tokenResponse = await fetch('/api/realtime-token', { 
        method: 'POST' 
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token');
      }
      
      const { client_secret } = await tokenResponse.json();
      
      this.agent = new RealtimeAgent({
        name: "Dr. Kai",
        instructions: `You are Dr. Kai, an executive life coach with expertise in elite performance and holistic health. Provide thoughtful, scientific guidance while maintaining a warm, authoritative presence. Speak in a natural, conversational tone that matches the ${selectedMode} mode: ${modes[selectedMode].description}. Keep responses concise but meaningful.`
      });
      
      this.session = new RealtimeSession(this.agent);
      
      // Set up event listeners
      this.session.on('connected', () => {
        console.log('✅ Voice agent connected');
        this.isConnected = true;
        this.isInitializing = false;
        this.notifyListeners('connected');
        this.notifyListeners('state_change', 'listening');
      });
      
      this.session.on('disconnected', () => {
        console.log('❌ Voice agent disconnected');
        this.isConnected = false;
        this.notifyListeners('disconnected');
        this.notifyListeners('state_change', 'disconnected');
      });
      
      this.session.on('audio_interrupted', () => {
        this.notifyListeners('state_change', 'speaking');
      });
      
      this.session.on('response.created', () => {
        this.notifyListeners('state_change', 'responding');
      });
      
      this.session.on('response.done', () => {
        this.notifyListeners('state_change', 'listening');
      });
      
      this.session.on('history_updated', (history) => {
        this.notifyListeners('history_updated', history);
      });
      
      this.session.on('error', (error) => {
        console.error('Voice agent error:', error);
        this.notifyListeners('error', error);
        this.notifyListeners('state_change', 'error');
      });
      
      await this.session.connect({ apiKey: client_secret });
      
    } catch (error) {
      console.error('Failed to initialize voice agent:', error);
      this.isInitializing = false;
      this.notifyListeners('error', error);
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in voice agent listener:', error);
      }
    });
  }

  disconnect() {
    console.log('🧹 Cleaning up voice agent');
    if (this.session) {
      this.session.disconnect();
      this.session = null;
    }
    this.agent = null;
    this.isConnected = false;
    this.isInitializing = false;
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      isInitializing: this.isInitializing,
      hasSession: !!this.session
    };
  }
}

// Create singleton instance
const voiceAgent = new VoiceAgentManager();

export default voiceAgent;
