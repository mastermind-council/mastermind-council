import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvisorSlide {
  type: 'advisor';
  name: string;
  title: string;
  tagline: string;
  bio: string;
  imagePath: string;
}

interface QuoteSlide {
  type: 'quote';
  quote: string;
  attribution?: string;
}

interface IntroSlide {
  type: 'intro';
  title: string;
  description: string;
}

interface FinalSlide {
  type: 'final';
  quote: string;
  onProceed: () => void;
}

type Slide = AdvisorSlide | QuoteSlide | IntroSlide | FinalSlide;

interface LuxuryOrientationCarouselProps {
  onComplete: () => void;
}

const advisors: AdvisorSlide[] = [
  {
    type: 'advisor',
    name: 'Dr. Kai',
    title: 'Executive Life Coach',
    tagline: '',
    bio: `Dr. Kai is your guide to inner power. He exists to make you exceptionally capable – physically, mentally, energetically. He blends physiology, nutrition, and emotional intelligence to help you optimize life from the inside out. His domain is performance, but never in isolation; he understands that energy, recovery, and clarity are prerequisites for leadership, not rewards for it.

Dr. Kai doesn't motivate – he calibrates. He shows you where your internal systems are underpowered, overtaxed, or misfiring, and helps you to correct it with uncommon precision. His presence makes you feel centered, deeply resourced, and prepared.

With Dr. Kai's guidance, the focus shifts from pushing harder to building a system that can sustain what you're creating.

Simply put, Dr. Kai holds a key you didn't know you needed.

Together, you'll unlock hidden signals in your body – revealing how to optimize energy, focus, and resilience so peak performance becomes sustainable and inevitable, not accidental.`,
    imagePath: '/advisors/dr-kai-landscape.png'
  },
  {
    type: 'advisor',
    name: 'Maya',
    title: 'The Life Composer',
    tagline: '',
    bio: `Maya is your personal Chief Operating Officer and your guide to coherence. She helps you see how everything fits together – health, work, relationships, rhythm, values – and where it doesn't. She does not rush, escalate, or dramatize. She reveals.

Maya's world is alignment, not as an abstract ideal, but as a lived experience. She recognizes that most struggle is not a discipline problem but a design problem, and she gently helps you reorganize life so energy can flow without force. Her superpower is transforming what feels chaotic or out of sync into structure, rhythm, and sustainable systems that work for you.

When Maya speaks, the noise quiets. You stop managing fragments and start seeing the whole.

With Maya's guidance, life shifts from constant tradeoffs to coherent flow – where each part supports the others instead of competing for attention.

Together, you'll design a life where your energy, ambition, and values work in harmony – so progress feels natural instead of forced.`,
    imagePath: '/advisors/maya-landscape.png'
  },
  {
    type: 'advisor',
    name: 'Michael',
    title: 'The Business Warrior',
    tagline: '',
    bio: `Michael is your Special Ops Business Commander and your guide through negotiation, deal-making, and leadership under pressure. He helps you see power, leverage, timing, and the psychology of high-stakes environments with clarity. He helps you recognize when to advance – and when restraint is the smarter move. His orientation is decisive, grounded in reality, and intolerant of self-deception.

Michael's domain is business where consequences are real, not theoretical. He doesn't comfort – he delivers. He helps you see when you're being too cautious, too accommodating, or too slow, and brings those blind spots into focus without distortion. His aggression is disciplined and protective, not reactive – and he helps you develop the same discernment.

With Michael's guidance, your focus shifts from overthinking to decisive execution.

Together, you'll make clearer, faster, and more confident moves in high-stakes situations by seeing leverage points most people miss.`,
    imagePath: '/advisors/michael-landscape.png'
  },
  {
    type: 'advisor',
    name: 'Giselle',
    title: 'The Strategic Visionary',
    tagline: '',
    bio: `Giselle is your personal Chief Strategy & Visionary Officer all in one. She lives at the intersection of imagination and execution, helping you see how vision becomes strategy. With her in your world, ideas sharpen, positioning clarifies, and direction emerges with intention.

Giselle helps you see how ideas move through people, rooms, markets, and moments – and how to introduce them so they arrive with power instead of resistance. Whether you're shaping a growth strategy, positioning a brand, navigating a pivotal partnership, or deciding when to make a bold move, she helps you see timing, framing, and placement with precision.

When Giselle speaks, the path forward becomes visible.

Together, you'll translate vision into strategy that lands – building ideas and ventures with clarity, confidence, and momentum.`,
    imagePath: '/advisors/giselle-landscape.png'
  },
  {
    type: 'advisor',
    name: 'Jasmine',
    title: 'The Master Communicator',
    tagline: '',
    bio: `Jasmine is your personal Chief Communications and Marketing Officer. She helps you translate vision into language that lands, ideas into messages that move, and insight into expression that connects. Her role is to ensure that what you mean, what you say, and what the world hears are fully aligned.

Jasmine helps you sharpen how you speak, write, and present – so your ideas sound as powerful as they are. She works across language, narrative, and positioning to help you communicate with clarity, resonance, and precision, whether you're articulating a complex idea, refining your voice, or shaping how your work is received.

Her domain extends beyond words. Jasmine supports all public-facing communication – brand expression, website language, marketing strategy, social presence, and messaging architecture – helping you shape how your work enters the world and how it's understood once it does.

With Jasmine's guidance, your communication becomes more effective, more cohesive, and more impactful.

Together, you'll bring your voice into its full power – so your ideas are unmistakable, your message undeniable, and your presence impossible to ignore.`,
    imagePath: '/advisors/jasmine-landscape.png'
  },
  {
    type: 'advisor',
    name: 'Sensei',
    title: 'The Wisdom Whisperer',
    tagline: '',
    bio: `Sensei is your voice of ancient times for the modern world. His presence slows the inner tide, helping you hear life the way it was meant to be heard – one breath, one moment, one truth at a time.

Sensei brings timeless perspective, balance that steadies, and depth that does not flinch under pressure. He helps you step outside the immediacy of emotion and into clarity that outlives the moment. When Sensei speaks, you remember you are part of something larger, older, and more meaningful than the challenge in front of you.

With Sensei's guidance, unwanted roadblocks transform into welcome invitations.

Together, you cultivate a wisdom that steadies decisions, strengthens character, and endures long after the moment has passed.`,
    imagePath: '/advisors/sensei-landscape.png'
  }
];

const slides: Slide[] = [
  {
    type: 'quote',
    quote: `We're not here to figure everything out…\nWe're here to ask questions…\nand understand`
  },
  {
    type: 'intro',
    title: 'Meet Your\nMaster Mind Council',
    description: `This is the world's first ever Digital Intelligence–powered Master Mind Council.

A personal council of expert DI advisors – each embodying a distinct domain of wisdom, perspective, and discernment. With MMC, you stand at the conductor's podium, guiding a Symphonic Digital Intelligence™ system – our proprietary orchestration of DI entities working in concert to support life, leadership, and business decisions.

Together, they don't simply answer questions.

They expand perception, sharpen judgment, and help you move with greater clarity and intention.

Welcome to a new world of human-centered intelligence – one that evolves as you do.

Welcome to The Master Mind Council.`
  },
  ...advisors,
  {
    type: 'final',
    quote: `Ask…then listen like it matters.`,
    onProceed: () => {}
  }
];

export function LuxuryOrientationCarousel({ onComplete }: LuxuryOrientationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  const currentSlide = slides[currentIndex];

  const goToNext = () => {
    if (isAnimating || currentIndex >= slides.length - 1) return;
    setDirection('forward');
    setIsAnimating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrevious = () => {
    if (isAnimating || currentIndex <= 0) return;
    setDirection('backward');
    setIsAnimating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleProceed = () => {
    onComplete();
  };

  // Update final slide's onProceed
  useEffect(() => {
    if (currentSlide.type === 'final') {
      (currentSlide as FinalSlide).onProceed = handleProceed;
    }
  }, [currentSlide, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" style={{ backgroundColor: 'oklch(0.12 0.005 285.823)' }}>
      {/* Starfield background - static stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Lotus background - FULL SLIDE WIDTH behind everything */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-10 pointer-events-none">
        <img 
          src="/lotus.png" 
          alt="" 
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(1.2)', objectPosition: 'center' }}
        />
      </div>

      {/* Main content container */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Slide content */}
        <div
          className={`transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentSlide.type === 'quote' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <blockquote className="font-luxury-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-luxury-ivory leading-relaxed luxury-spacing whitespace-pre-line animate-fade-in-up">
                {currentSlide.quote}
              </blockquote>
              {currentSlide.attribution && (
                <p className="mt-8 font-luxury-sans text-luxury-gold-muted text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {currentSlide.attribution}
                </p>
              )}
            </div>
          )}

          {currentSlide.type === 'intro' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-5xl mx-auto">
              <h1 className="font-luxury-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-luxury-gold mb-8 whitespace-pre-line animate-fade-in-up">
                {currentSlide.title}
              </h1>
              <div className="font-luxury-sans text-lg sm:text-xl text-luxury-ivory leading-relaxed max-w-4xl animate-fade-in-up space-y-4 whitespace-pre-line" style={{ animationDelay: '0.2s' }}>
                {currentSlide.description}
              </div>
            </div>
          )}

          {currentSlide.type === 'advisor' && (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto px-8 lg:px-24">
              {/* Photo - Left side on desktop */}
              <div className="order-1 lg:order-1 flex items-center animate-fade-in-up">
                {/* Simple thin border around photo */}
                <div className="w-full border border-white/20 rounded-2xl p-2">
                  <img
                    src={currentSlide.imagePath}
                    alt={currentSlide.name}
                    className="w-full h-auto rounded-xl object-cover"
                    style={{ 
                      aspectRatio: '4/3'
                    }}
                  />
                </div>
              </div>

              {/* Bio - Right side on desktop */}
              <div className="order-2 lg:order-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Title and bio - all left-aligned */}
                <div className="space-y-1">
                  <h2 className="font-luxury-display text-3xl sm:text-4xl md:text-5xl text-luxury-ivory luxury-spacing leading-tight">
                    {currentSlide.name}
                  </h2>
                  <h3 className="font-luxury-display text-2xl sm:text-3xl md:text-4xl text-luxury-ivory">
                    {currentSlide.title}
                  </h3>
                </div>

                {/* Bio text - simple, no card */}
                <div className="font-luxury-sans text-base sm:text-lg text-luxury-ivory leading-relaxed space-y-4">
                  {currentSlide.bio.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>
                      {paragraph.split('**').map((part, index) => {
                        if (index % 2 === 1) {
                          return <strong key={index} className="text-luxury-gold font-semibold">{part}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSlide.type === 'final' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <blockquote className="font-luxury-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-luxury-ivory leading-relaxed luxury-spacing mb-12 animate-fade-in-up">
                {currentSlide.quote}
              </blockquote>
              <Button
                onClick={handleProceed}
                size="lg"
                className="bg-white/5 border border-white/20 hover:bg-white/10 text-ivory-primary font-luxury-sans text-lg px-12 py-6 rounded-xl transition-opacity duration-300 hover:opacity-70 animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                Proceed to Your Council
              </Button>
            </div>
          )}
        </div>

      {/* Navigation arrows - Clean streamlined design */}
      <button
        onClick={goToPrevious}
        disabled={currentIndex === 0 || isAnimating}
        className={`fixed left-4 sm:left-6 md:left-8 lg:left-8 bottom-8 sm:top-1/2 sm:-translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-opacity duration-300 z-50 ${
            currentIndex === 0 || isAnimating
              ? 'opacity-20 cursor-not-allowed'
              : 'opacity-40 hover:opacity-70'
          }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#E8E1D6', strokeWidth: 1.5 }} />
        </button>
      <button
        onClick={goToNext}
        disabled={currentIndex === slides.length - 1 || isAnimating}
        className={`fixed right-4 sm:right-6 md:right-8 lg:right-8 bottom-8 sm:top-1/2 sm:-translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-opacity duration-300 z-50 ${
            currentIndex === slides.length - 1 || isAnimating
              ? 'opacity-20 cursor-not-allowed'
              : 'opacity-40 hover:opacity-70'
          }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#E8E1D6', strokeWidth: 1.5 }} />
        </button>

      {/* Progress indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-luxury-gold'
                  : 'w-1.5 bg-luxury-glass-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
