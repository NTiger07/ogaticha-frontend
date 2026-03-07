/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Mic, 
  Heart, 
  Settings, 
  ChevronRight, 
  Menu, 
  X, 
  Volume2, 
  Eye, 
  WifiOff, 
  Cpu, 
  CheckCircle2, 
  Users, 
  GraduationCap,
  ArrowRight,
  Accessibility,
  MessageSquare,
  FileText
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' | 'icon' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-secondary hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-primary hover:bg-secondary/90',
      outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary',
      ghost: 'hover:bg-black/5 text-secondary',
    };
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-semibold',
      icon: 'p-2',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'cursor-pointer inline-flex items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

const Card = ({ children, className, accentColor, ...props }: { children: React.ReactNode, className?: string, accentColor?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={cn('bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-black/5 relative overflow-hidden', className)}
    {...props}
  >
    {accentColor && <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: accentColor }} />}
    {children}
  </motion.div>
);

const Section = ({ children, id, className, title, subtitle, dark = false }: { children: React.ReactNode, id?: string, className?: string, title?: string, subtitle?: string, dark?: boolean }) => (
  <section id={id} className={cn('py-24 px-6 md:px-12 lg:px-24', dark ? 'bg-secondary text-white' : 'bg-transparent', className)}>
    {(title || subtitle) && (
      <div className="max-w-4xl mx-auto text-center mb-16">
        {subtitle && <p className={cn("text-sm font-bold uppercase tracking-widest mb-4", dark ? "text-primary" : "text-secondary")}>{subtitle}</p>}
        {title && <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">{title}</h2>}
      </div>
    )}
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Accessibility', href: '#accessibility' },
    { name: 'Impact', href: '#impact' },
    { name: 'Donate', href: '#donate' },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4',
      isScrolled ? 'glass py-3 shadow-lg' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="text-secondary w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-secondary tracking-tight">OgaTicha</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-secondary font-medium hover:text-secondary/70 transition-colors">
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Button variant="ghost">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-secondary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 lg:hidden flex flex-col gap-4"
          >
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-secondary py-2 border-b border-black/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <Section className="pt-40 pb-32 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-secondary text-sm font-bold mb-6">
            <Accessibility className="w-4 h-4" />
            <span>Accessibility First Education</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-secondary mb-8 leading-[1.1] text-balance">
            Welcome to <span className="text-secondary underline decoration-primary decoration-8 underline-offset-4">OgaTicha</span>
          </h1>
          <p className="text-xl text-secondary/80 mb-10 leading-relaxed max-w-xl">
            OgaTicha empowers students with disabilities by transforming traditional learning materials into accessible formats. Through voice-first AI tutoring, intelligent document processing, and offline accessibility, every student can learn without barriers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="cursor-pointer rounded-full px-10">
              Get Started <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="cursor-pointer rounded-full px-10">
              Sign In
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Hero Illustration Placeholder */}
          <div className="relative z-10 aspect-square rounded-[3rem] bg-secondary p-12 flex flex-col items-center justify-center text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,245,6,0.1),transparent_70%)]" />
            
            {/* Visual elements */}
            <div className="relative z-20 flex flex-col items-center gap-8 w-full">
              <div className="flex gap-4 items-end h-20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 40, 20, 60, 15, 45][i % 6] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-3 bg-primary rounded-full"
                  />
                ))}
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Mic className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">AI Tutor Speaking</p>
                    <p className="text-xs opacity-70 italic">Reading: "The Laws of Physics..."</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                </div>
              </div>

              <div className="flex gap-4">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="p-4 bg-primary rounded-2xl shadow-lg"
                >
                  <Eye className="text-secondary w-8 h-8" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="p-4 bg-white rounded-2xl shadow-lg"
                >
                  <Volume2 className="text-secondary w-8 h-8" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </Section>
  );
};

const FeatureModules = () => {
  const modules = [
    {
      title: 'Classroom',
      desc: 'Access lecture notes, PDFs, and study materials with AI-powered summaries. The system extracts text and restructures it for screen readers.',
      icon: <BookOpen className="w-8 h-8" />,
      color: '#f9f506',
      illustration: (
        <div className="mt-6 flex items-center justify-center gap-4">
          <FileText className="w-12 h-12 text-secondary/30" />
          <ArrowRight className="w-6 h-6 text-secondary/30" />
          <div className="p-3 bg-primary rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-secondary" />
          </div>
        </div>
      )
    },
    {
      title: 'AI Tutor',
      desc: 'A fully voice-enabled AI tutor that answers questions, explains difficult concepts, and guides students through lessons using conversational speech.',
      icon: <Mic className="w-8 h-8" />,
      color: '#4a148c',
      illustration: (
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Cpu className="text-primary w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-2 w-16 bg-secondary/20 rounded-full" />
            <div className="h-2 w-12 bg-secondary/10 rounded-full" />
          </div>
          <MessageSquare className="w-8 h-8 text-secondary/30" />
        </div>
      )
    },
    {
      title: 'Donate',
      desc: 'Support students by funding assistive technologies and accessibility tools that make education possible for thousands of learners.',
      icon: <Heart className="w-8 h-8" />,
      color: '#4a148c',
      illustration: (
        <div className="mt-6 flex items-center justify-center">
          <div className="relative">
            <Users className="w-12 h-12 text-secondary/30" />
            <Heart className="absolute -top-2 -right-2 w-6 h-6 text-red-500 fill-red-500" />
          </div>
        </div>
      )
    },
    {
      title: 'Accessibility Settings',
      desc: 'Customize the learning environment with voice mode, high contrast themes, simplified layouts, and adaptive text formatting.',
      icon: <Settings className="w-8 h-8" />,
      color: '#f9f506',
      illustration: (
        <div className="mt-6 flex flex-col gap-2 w-full max-w-[120px] mx-auto">
          <div className="h-4 w-full bg-primary/30 rounded-full flex items-center px-1">
            <div className="h-3 w-3 bg-secondary rounded-full ml-auto" />
          </div>
          <div className="h-4 w-full bg-black/5 rounded-full flex items-center px-1">
            <div className="h-3 w-3 bg-black/20 rounded-full" />
          </div>
        </div>
      )
    }
  ];

  return (
    <Section id="features" title="Core Product Modules" subtitle="What we offer">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {modules.map((m, i) => (
          <Card key={i} accentColor={m.color} className="flex flex-col h-full">
            <div className="mb-6 p-4 rounded-2xl inline-block" style={{ backgroundColor: `${m.color}20` }}>
              {React.cloneElement(m.icon as React.ReactElement, { style: { color: m.color === '#f9f506' ? '#4a148c' : m.color } })}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-secondary">{m.title}</h3>
            <p className="text-secondary/70 text-sm leading-relaxed mb-8 flex-grow">
              {m.desc}
            </p>
            {m.illustration}
          </Card>
        ))}
      </div>
    </Section>
  );
};

const ProblemSection = () => {
  return (
    <Section id="problem" className="bg-secondary text-white" title="Education Should Not Be a Minefield" subtitle="The Challenge">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <p className="text-2xl text-primary/90 font-medium italic">
            "Many digital learning platforms unintentionally exclude students with disabilities."
          </p>
          
          <div className="space-y-8">
            {[
              { title: 'Inaccessible Materials', desc: 'Most PDFs and lecture files are not readable by screen readers.', icon: <FileText className="text-primary" /> },
              { title: 'Navigation Barriers', desc: 'Complex dashboards make learning difficult for visually impaired students.', icon: <Accessibility className="text-primary" /> },
              { title: 'Financial Exclusion', desc: 'Specialized assistive hardware is often too expensive for students.', icon: <Heart className="text-primary" /> }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10">
          <h4 className="text-3xl font-bold mb-12 text-center">Impact in Nigeria</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-8 bg-primary rounded-3xl">
              <p className="text-5xl font-black text-secondary mb-2">35M</p>
              <p className="text-secondary font-bold text-sm uppercase tracking-wider">Nigerians with Disabilities</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-3xl">
              <p className="text-5xl font-black text-primary mb-2">16%</p>
              <p className="text-white/70 font-bold text-sm uppercase tracking-wider">Face Extreme Barriers</p>
            </div>
          </div>
          <div className="mt-12 p-8 border-2 border-dashed border-white/20 rounded-3xl">
            <p className="text-center text-white/60 italic">
              "Without inclusive technology, millions are left behind in the digital economy."
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

const SolutionsSection = () => {
  return (
    <Section id="solutions" title="Technology that Empowers Every Student" subtitle="Intelligent Solutions">
      <div className="grid md:grid-cols-3 gap-12">
        {[
          {
            title: 'Smart Material Extraction',
            desc: 'The Smart Classroom engine scans uploaded files and extracts structured text for screen readers.',
            icon: <Cpu />,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <motion.div 
                  animate={{ x: [-100, 100] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-y-0 w-1 bg-primary shadow-[0_0_20px_rgba(249,245,6,1)]"
                />
                <FileText className="w-12 h-12 text-secondary/20" />
              </div>
            )
          },
          {
            title: 'Offline Mode',
            desc: 'Accessibility tools continue working even without internet connectivity, ensuring learning never stops.',
            icon: <WifiOff />,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-secondary">Offline Ready</span>
                </div>
              </div>
            )
          },
          {
            title: 'Real Time Adaptation',
            desc: 'Voice tutor adapts to student responses and supports symbolic logic and STEM learning.',
            icon: <GraduationCap />,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] text-primary font-bold">AI</div>
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-20 bg-secondary/20 rounded-full" />
                  <div className="h-2 w-16 bg-secondary/10 rounded-full" />
                </div>
              </div>
            )
          }
        ].map((item, i) => (
          <div key={i} className="group">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-8 h-8' })}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-secondary">{item.title}</h3>
            <p className="text-secondary/70 leading-relaxed">{item.desc}</p>
            {item.visual}
          </div>
        ))}
      </div>
    </Section>
  );
};

const ComparisonSection = () => {
  return (
    <Section id="comparison" className="bg-primary/10" title="One Platform. Complete Accessibility." subtitle="Why OgaTicha is Better">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <p className="text-xl text-secondary/80 leading-relaxed">
            Unlike fragmented accessibility tools, OgaTicha provides a unified ecosystem designed specifically for inclusive learning.
          </p>
          <div className="grid gap-6">
            {[
              'Integrated Learning Environment',
              'Voice-First Interaction',
              'Offline-Ready Learning',
              'Continuous Improvement'
            ].map((adv, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-black/5">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-secondary">{adv}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-3xl opacity-40 grayscale">
                <p className="text-xs font-bold uppercase mb-2">Fragmented Tools</p>
                <div className="h-2 w-full bg-black/10 rounded-full mb-2" />
                <div className="h-2 w-3/4 bg-black/10 rounded-full" />
              </div>
              <div className="p-6 bg-white rounded-3xl opacity-40 grayscale">
                <div className="h-2 w-full bg-black/10 rounded-full mb-2" />
                <div className="h-2 w-1/2 bg-black/10 rounded-full" />
              </div>
            </div>
            <div className="pt-12">
              <div className="p-8 bg-secondary text-white rounded-[2.5rem] shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <GraduationCap className="text-secondary w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-primary uppercase mb-4">OgaTicha Unified</p>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-2/3 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const ImpactSection = () => {
  return (
    <Section id="impact" title="Changing Lives Through Accessible Education" subtitle="Community & Impact">
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { label: 'Students Supported', value: '12,500+' },
          { label: 'Materials Converted', value: '85,000+' },
          { label: 'Hours of AI Tutoring', value: '250,000+' }
        ].map((stat, i) => (
          <div key={i} className="text-center p-10 bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-black/5">
            <p className="text-5xl font-black text-secondary mb-2">{stat.value}</p>
            <p className="text-secondary/60 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            name: 'Chidi Okafor',
            role: 'Visually Impaired Student',
            text: 'OgaTicha changed everything for me. I can now "read" my lecture notes as easily as my sighted peers. The voice tutor is like having a private teacher 24/7.',
            img: 'https://picsum.photos/seed/student1/200/200'
          },
          {
            name: 'Mrs. Amina Yusuf',
            role: 'Special Education Teacher',
            text: 'The ability to convert any PDF into structured, accessible text is a game-changer. My students are more engaged and confident than ever before.',
            img: 'https://picsum.photos/seed/teacher1/200/200'
          }
        ].map((story, i) => (
          <Card key={i} className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img src={story.img} alt={story.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary" referrerPolicy="no-referrer" />
            <div>
              <p className="text-lg text-secondary/80 italic mb-6 leading-relaxed">"{story.text}"</p>
              <h4 className="font-bold text-secondary">{story.name}</h4>
              <p className="text-sm text-secondary/60">{story.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

const CTASection = () => {
  return (
    <Section className="py-0">
      <div className="bg-secondary rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,245,6,0.15),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Unlock the Future of Accessible Learning.
          </h2>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Whether you are a student seeking accessible education or a supporter helping create opportunities, OgaTicha is your gateway to barrier-free learning.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="rounded-full px-12 py-5 text-xl">
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-12 py-5 text-xl border-white text-white hover:bg-white hover:text-secondary">
              Donate to Support
            </Button>
          </div>
        </motion.div>

        {/* Floating shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-20 left-20 w-16 h-16 bg-primary/20 rounded-2xl blur-sm"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-primary/10 rounded-full blur-md"
        />
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="text-secondary w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-secondary">OgaTicha</span>
            </div>
            <p className="text-secondary/60 leading-relaxed">
              Empowering students with disabilities through innovative, accessible technology.
            </p>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/20 rounded-lg text-secondary" title="Screen Reader Supported">
                <Eye className="w-5 h-5" />
              </div>
              <div className="p-2 bg-primary/20 rounded-lg text-secondary" title="Voice Learning Enabled">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="p-2 bg-primary/20 rounded-lg text-secondary" title="Inclusive Education">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-secondary mb-6">Platform</h4>
            <ul className="space-y-4 text-secondary/60">
              <li><a href="#" className="hover:text-secondary transition-colors">About OgaTicha</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Accessibility Commitment</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary mb-6">Legal</h4>
            <ul className="space-y-4 text-secondary/60">
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary mb-6">Newsletter</h4>
            <p className="text-sm text-secondary/60 mb-4">Stay updated on our impact and new features.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/5 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary w-full"
              />
              <Button size="sm" className="shrink-0">Join</Button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-secondary/40 text-sm">
          <p>© 2026 OgaTicha. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-secondary">Twitter</a>
            <a href="#" className="hover:text-secondary">LinkedIn</a>
            <a href="#" className="hover:text-secondary">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-secondary">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-secondary focus:px-6 focus:py-3 focus:rounded-full focus:font-bold"
      >
        Skip to main content
      </a>

      <Navbar />
      
      <main id="main-content">
        <Hero />
        <FeatureModules />
        <ProblemSection />
        <SolutionsSection />
        <ComparisonSection />
        <ImpactSection />
        <CTASection />
      </main>

      <Footer />

      {/* Accessibility Floating Action Button (Optional but helpful) */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button size="icon" className="w-14 h-14 shadow-2xl" aria-label="Accessibility Settings">
          <Accessibility className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
