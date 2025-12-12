import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f8f5] flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8">
      {/* Hero Section - Desktop */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center max-w-2xl p-12">
        <div className="w-32 h-32 bg-[#f9f506] rounded-full flex items-center justify-center mb-8 shadow-2xl">
          <span className="material-symbols-outlined text-7xl text-[#181811]">school</span>
        </div>
        <h1 className="text-6xl font-bold text-[#181811] mb-4 text-center">
          Welcome to OgaTicha
        </h1>
        <p className="text-2xl text-gray-600 text-center mb-8 max-w-xl">
          Your accessible learning companion for enhanced education
        </p>
        <div className="flex gap-4">
          <Link
            href="/classroom"
            className="px-8 py-4 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white hover:bg-gray-100 text-[#181811] font-bold rounded-full border-2 border-gray-200 transition-all text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile/Tablet Card */}
      <div className="lg:hidden w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
        {/* Logo/Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#f9f506] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-[#181811]">school</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#181811] mb-3">
          OgaTicha
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your accessible learning companion
        </p>

        {/* Navigation Cards */}
        <div className="space-y-4 mb-8">
          <Link
            href="/classroom"
            className="block w-full bg-[#f8f8f5] hover:bg-[#f9f506]/20 rounded-xl p-4 transition-all border-2 border-transparent hover:border-[#f9f506] group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-[#181811]">menu_book</span>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-[#181811]">Classroom</h3>
                <p className="text-sm text-gray-600">View lecture notes</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#f9f506]">arrow_forward</span>
            </div>
          </Link>

          <Link
            href="/tutor"
            className="block w-full bg-[#f8f8f5] hover:bg-[#f9f506]/20 rounded-xl p-4 transition-all border-2 border-transparent hover:border-[#f9f506] group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4a148c] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-white">school</span>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-[#181811]">AI Tutor</h3>
                <p className="text-sm text-gray-600">Chat with your tutor</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#f9f506]">arrow_forward</span>
            </div>
          </Link>

          <Link
            href="/donate"
            className="block w-full bg-[#f8f8f5] hover:bg-[#f9f506]/20 rounded-xl p-4 transition-all border-2 border-transparent hover:border-[#f9f506] group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4a148c] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-white">volunteer_activism</span>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-[#181811]">Donate</h3>
                <p className="text-sm text-gray-600">Support student goals</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#f9f506]">arrow_forward</span>
            </div>
          </Link>
        </div>

        {/* Auth Links */}
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="flex-1 py-3 px-6 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="flex-1 py-3 px-6 bg-white hover:bg-gray-100 text-[#181811] font-bold rounded-full border-2 border-gray-200 transition-colors"
          >
            Register
          </Link>
        </div>

        {/* Settings Link */}
        <Link
          href="/settings"
          className="mt-6 inline-flex items-center gap-2 text-gray-600 hover:text-[#181811] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>

      {/* Features Grid - Desktop */}
      <div className="hidden lg:grid grid-cols-2 gap-6 flex-1 max-w-3xl p-12">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#f9f506] transition-all shadow-lg hover:shadow-xl group">
          <div className="w-16 h-16 bg-[#f9f506] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-[#181811]">menu_book</span>
          </div>
          <h3 className="text-2xl font-bold text-[#181811] mb-2">Classroom</h3>
          <p className="text-gray-600 mb-6">Access lecture notes, PDFs, and study materials with AI-powered summaries</p>
          <Link href="/classroom" className="inline-flex items-center gap-2 text-[#f9f506] font-semibold hover:gap-3 transition-all">
            Explore <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#4a148c] transition-all shadow-lg hover:shadow-xl group">
          <div className="w-16 h-16 bg-[#4a148c] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-white">school</span>
          </div>
          <h3 className="text-2xl font-bold text-[#181811] mb-2">AI Tutor</h3>
          <p className="text-gray-600 mb-6">Chat with your AI tutor for instant help, explanations, and guidance</p>
          <Link href="/tutor" className="inline-flex items-center gap-2 text-[#4a148c] font-semibold hover:gap-3 transition-all">
            Start Chat <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#4a148c] transition-all shadow-lg hover:shadow-xl group">
          <div className="w-16 h-16 bg-[#4a148c] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-white">volunteer_activism</span>
          </div>
          <h3 className="text-2xl font-bold text-[#181811] mb-2">Donate</h3>
          <p className="text-gray-600 mb-6">Support students by funding accessibility tools and educational resources</p>
          <Link href="/donate" className="inline-flex items-center gap-2 text-[#4a148c] font-semibold hover:gap-3 transition-all">
            Make Impact <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#f9f506] transition-all shadow-lg hover:shadow-xl group">
          <div className="w-16 h-16 bg-[#f9f506] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-[#181811]">settings_accessibility</span>
          </div>
          <h3 className="text-2xl font-bold text-[#181811] mb-2">Accessibility</h3>
          <p className="text-gray-600 mb-6">Customize your learning experience with voice mode, high contrast, and more</p>
          <Link href="/settings" className="inline-flex items-center gap-2 text-[#f9f506] font-semibold hover:gap-3 transition-all">
            Customize <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
