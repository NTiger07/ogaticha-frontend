'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Utility ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Components ---

const Button = ({ className, variant = 'primary', size = 'md', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }) => {
  const variants = {
    primary: 'bg-[#f9f506] text-[#181811] hover:bg-[#e6e205] shadow-sm',
    secondary: 'bg-[#4a148c] text-white hover:bg-[#3a0f6d]',
    outline: 'border-2 border-[#4a148c] text-[#4a148c] hover:bg-[#4a148c] hover:text-white',
    ghost: 'hover:bg-black/5 text-[#4a148c]',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, accentColor, ...props }: { children: React.ReactNode, className?: string, accentColor?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-black/5 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300', className)}
    {...props}
  >
    {accentColor && <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: accentColor }} />}
    {children}
  </div>
);

const Section = ({ children, id, className, title, subtitle, dark = false }: { children: React.ReactNode, id?: string, className?: string, title?: string, subtitle?: string, dark?: boolean }) => (
  <section id={id} className={cn('py-24 px-6 md:px-12 lg:px-24', dark ? 'bg-[#4a148c] text-white' : 'bg-transparent', className)}>
    {(title || subtitle) && (
      <div className="max-w-4xl mx-auto text-center mb-16">
        {subtitle && <p className={cn("text-sm font-bold uppercase tracking-widest mb-4", dark ? "text-[#f9f506]" : "text-[#4a148c]")}>{subtitle}</p>}
        {title && <h2 className={cn("text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight", dark ? "text-white" : "text-[#181811]")}>{title}</h2>}
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
      isScrolled ? 'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg py-3' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f9f506] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[#4a148c]">school</span>
          </div>
          <span className="text-2xl font-bold text-[#4a148c] tracking-tight">OgaTicha</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-[#4a148c] font-medium hover:text-[#4a148c]/70 transition-colors">
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="cursor-pointer">Sign In</Button>
            </Link>
            <Link href="/classroom">
              <Button size="sm" className="cursor-pointer">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-[#4a148c]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <span className="material-symbols-outlined">close</span> : <span className="material-symbols-outlined">menu</span>}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 lg:hidden flex flex-col gap-4">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-[#4a148c] py-2 border-b border-black/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/classroom" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <Section className="pt-40 pb-32 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f9f506]/20 text-[#4a148c] text-sm font-bold mb-6">
            <span className="material-symbols-outlined text-lg">accessibility</span>
            <span>Accessibility First Education</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-[#4a148c] mb-8 leading-[1.1] text-balance">
            Welcome to <span className="text-[#4a148c] underline decoration-[#f9f506] decoration-8 underline-offset-4">OgaTicha</span>
          </h1>
          <p className="text-xl text-[#4a148c]/80 mb-10 leading-relaxed max-w-xl">
            OgaTicha empowers students with disabilities by transforming traditional learning materials into accessible formats. Through voice-first AI tutoring, intelligent document processing, and offline accessibility, every student can learn without barriers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/classroom">
              <Button size="lg" className="rounded-full px-10">
                Get Started <span className="material-symbols-outlined ml-2">chevron_right</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="rounded-full px-10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative animate-fade-in-delay">
          {/* Hero Illustration */}
          <div className="relative z-10 aspect-square rounded-[3rem] bg-[#4a148c] p-12 flex flex-col items-center justify-center text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,245,6,0.1),transparent_70%)]" />

            {/* Visual elements */}
            <div className="relative z-20 flex flex-col items-center gap-8 w-full">
              <div className="flex gap-4 items-end h-20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div
                    key={i}
                    className="w-3 bg-[#f9f506] rounded-full animate-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f9f506] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#4a148c]">mic</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#f9f506]">AI Tutor Speaking</p>
                    <p className="text-xs opacity-70 italic">Reading: "The Laws of Physics..."</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-4 bg-[#f9f506] rounded-2xl shadow-lg animate-bounce-slow">
                  <span className="material-symbols-outlined text-[#4a148c] text-2xl">visibility</span>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-lg animate-bounce-slow-delay">
                  <span className="material-symbols-outlined text-[#4a148c] text-2xl">volume_up</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#f9f506]/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#4a148c]/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </Section>
  );
};

const FeatureModules = () => {
  const modules = [
    {
      title: 'Classroom',
      desc: 'Access lecture notes, PDFs, and study materials with AI-powered summaries. The system extracts text and restructures it for screen readers.',
      icon: <span className="material-symbols-outlined text-3xl">menu_book</span>,
      color: '#f9f506',
      link: '/classroom',
    },
    {
      title: 'AI Tutor',
      desc: 'A fully voice-enabled AI tutor that answers questions, explains difficult concepts, and guides students through lessons using conversational speech.',
      icon: <span className="material-symbols-outlined text-3xl">record_voice_over</span>,
      color: '#4a148c',
      link: '/tutor',
    },
    {
      title: 'Donate',
      desc: 'Support students by funding assistive technologies and accessibility tools that make education possible for thousands of learners.',
      icon: <span className="material-symbols-outlined text-3xl">volunteer_activism</span>,
      color: '#4a148c',
      link: '/donate',
    },
    {
      title: 'Accessibility',
      desc: 'Customize the learning environment with voice mode, high contrast themes, simplified layouts, and adaptive text formatting.',
      icon: <span className="material-symbols-outlined text-3xl">settings_accessibility</span>,
      color: '#f9f506',
      link: '/settings',
    }
  ];

  return (
    <Section id="features" title="Core Product Modules" subtitle="What we offer">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {modules.map((m, i) => (
          <Link key={i} href={m.link}>
            <Card accentColor={m.color} className="flex flex-col h-full cursor-pointer">
              <div className="mb-6 p-4 rounded-2xl inline-block" style={{ backgroundColor: `${m.color}20` }}>
                <span style={{ color: m.color === '#f9f506' ? '#4a148c' : m.color }}>{m.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#181811]">{m.title}</h3>
              <p className="text-[#181811]/70 text-sm leading-relaxed mb-8 flex-grow">
                {m.desc}
              </p>
              <div className="flex items-center gap-2 text-[#4a148c] font-semibold">
                <span>Learn more</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
};

const ProblemSection = () => {
  return (
    <Section id="problem" dark title="Education Should Not Be a Minefield" subtitle="The Challenge">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <p className="text-2xl text-[#f9f506]/90 font-medium italic">
            "Many digital learning platforms unintentionally exclude students with disabilities."
          </p>

          <div className="space-y-8">
            {[
              { title: 'Inaccessible Materials', desc: 'Most PDFs and lecture files are not readable by screen readers.', icon: <span className="material-symbols-outlined text-[#f9f506]">description</span> },
              { title: 'Navigation Barriers', desc: 'Complex dashboards make learning difficult for visually impaired students.', icon: <span className="material-symbols-outlined text-[#f9f506]">accessibility</span> },
              { title: 'Financial Exclusion', desc: 'Specialized assistive hardware is often too expensive for students.', icon: <span className="material-symbols-outlined text-[#f9f506]">favorite</span> }
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className=" leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10">
          <h4 className="text-3xl font-bold mb-12 text-center">Impact in Nigeria</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-8 bg-[#f9f506] rounded-3xl">
              <p className="text-5xl font-black text-[#4a148c] mb-2">35M</p>
              <p className="text-[#4a148c] font-bold text-sm uppercase tracking-wider">Nigerians with Disabilities</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-3xl">
              <p className="text-5xl font-black text-[#f9f506] mb-2">16%</p>
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
            icon: <span className="material-symbols-outlined text-2xl">memory</span>,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-y-0 w-1 bg-[#f9f506] shadow-[0_0_20px_rgba(249,245,6,1)] animate-scan-line" />
                <span className="material-symbols-outlined text-3xl text-[#4a148c]/20">description</span>
              </div>
            )
          },
          {
            title: 'Offline Mode',
            desc: 'Accessibility tools continue working even without internet connectivity, ensuring learning never stops.',
            icon: <span className="material-symbols-outlined text-2xl">wifi_off</span>,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-[#4a148c]">Offline Ready</span>
                </div>
              </div>
            )
          },
          {
            title: 'Real Time Adaptation',
            desc: 'Voice tutor adapts to student responses and supports symbolic logic and STEM learning.',
            icon: <span className="material-symbols-outlined text-2xl">school</span>,
            visual: (
              <div className="mt-8 relative h-32 bg-black/5 rounded-2xl flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#4a148c] flex items-center justify-center text-[10px] text-[#f9f506] font-bold">AI</div>
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-20 bg-[#4a148c]/20 rounded-full" />
                  <div className="h-2 w-16 bg-[#4a148c]/10 rounded-full" />
                </div>
              </div>
            )
          }
        ].map((item, i) => (
          <div key={i} className="group">
            <div className="w-16 h-16 rounded-2xl bg-[#f9f506] flex items-center justify-center text-[#4a148c] mb-8 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#181811]">{item.title}</h3>
            <p className="text-[#181811]/70 leading-relaxed">{item.desc}</p>
            {item.visual}
          </div>
        ))}
      </div>
    </Section>
  );
};

const ComparisonSection = () => {
  return (
    <Section id="comparison" className="bg-[#f9f506]/10" title="One Platform. Complete Accessibility." subtitle="Why OgaTicha is Better">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <p className="text-xl text-[#181811]/80 leading-relaxed">
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
                <div className="w-8 h-8 rounded-full bg-[#4a148c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#f9f506] text-sm">check_circle</span>
                </div>
                <span className="font-bold text-[#181811]">{adv}</span>
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
              <div className="p-8 bg-[#4a148c] text-white rounded-[2.5rem] shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[#4a148c]">school</span>
                </div>
                <p className="text-sm font-bold text-[#f9f506] uppercase mb-4">OgaTicha Unified</p>
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
            <p className="text-5xl font-black text-[#4a148c] mb-2">{stat.value}</p>
            <p className="text-[#4a148c]/60 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
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
            <img src={story.img} alt={story.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#f9f506]" referrerPolicy="no-referrer" />
            <div>
              <p className="text-lg text-[#181811]/80 italic mb-6 leading-relaxed">"{story.text}"</p>
              <h4 className="font-bold text-[#181811]">{story.name}</h4>
              <p className="text-sm text-[#181811]/60">{story.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

const CTASection = () => {
  return (
    <Section id="donate" className="py-0">
      <div className="bg-[#4a148c] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,245,6,0.15),transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Unlock the Future of Accessible Learning.
          </h2>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Whether you are a student seeking accessible education or a supporter helping create opportunities, OgaTicha is your gateway to barrier-free learning.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/classroom">
              <Button size="lg" className="rounded-full px-12 py-5 text-xl bg-[#f9f506] text-[#181811] hover:bg-[#e6e205]">
                Get Started Now
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" size="lg" className="rounded-full px-12 py-5 text-xl border-white text-white hover:bg-white hover:text-[#4a148c]">
                Donate to Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-[#f9f506]/20 rounded-2xl blur-sm animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#f9f506]/10 rounded-full blur-md animate-float-delay" />
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
              <div className="w-10 h-10 rounded-full bg-[#f9f506] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#4a148c]">school</span>
              </div>
              <span className="text-2xl font-bold text-[#4a148c]">OgaTicha</span>
            </div>
            <p className="text-[#4a148c]/60 leading-relaxed">
              Empowering students with disabilities through innovative, accessible technology.
            </p>
            <div className="flex gap-4">
              <div className="p-2 bg-[#f9f506]/20 rounded-lg text-[#4a148c]" title="Screen Reader Supported">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <div className="p-2 bg-[#f9f506]/20 rounded-lg text-[#4a148c]" title="Voice Learning Enabled">
                <span className="material-symbols-outlined">volume_up</span>
              </div>
              <div className="p-2 bg-[#f9f506]/20 rounded-lg text-[#4a148c]" title="Inclusive Education">
                <span className="material-symbols-outlined">groups</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#181811] mb-6">Platform</h4>
            <ul className="space-y-4 text-[#181811]/60">
              <li><Link href="#" className="hover:text-[#181811] transition-colors">About OgaTicha</Link></li>
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Accessibility Commitment</Link></li>
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Support Center</Link></li>
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#181811] mb-6">Legal</h4>
            <ul className="space-y-4 text-[#181811]/60">
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#181811] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#181811] mb-6">Newsletter</h4>
            <p className="text-sm text-[#181811]/60 mb-4">Stay updated on our impact and new features.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-black/5 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#f9f506] w-full"
              />
              <Button size="sm" className="shrink-0">Join</Button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[#181811]/40 text-sm">
          <p>© 2026 OgaTicha. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#181811]">Twitter</a>
            <a href="#" className="hover:text-[#181811]">LinkedIn</a>
            <a href="#" className="hover:text-[#181811]">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#f9f506] selection:text-[#4a148c]">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#f9f506] focus:text-[#4a148c] focus:px-6 focus:py-3 focus:rounded-full focus:font-bold"
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

      {/* Accessibility Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Link href="/settings" className="w-14 h-14 shadow-2xl bg-[#f9f506] hover:bg-[#e6e205] rounded-full flex items-center justify-center transition-transform hover:scale-110" aria-label="Accessibility Settings">
          <span className="material-symbols-outlined text-[#4a148c] text-2xl">accessibility</span>
        </Link>
      </div>
    </div>
  );
}
