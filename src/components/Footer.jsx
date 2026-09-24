import personalInfo from '../data/personalInfo'

export default function Footer() {
  return (
    <footer className="bg-adventure-dark dark:bg-[#05061a] text-white py-12 px-4 relative overflow-hidden">
      {/* Decorative castle silhouette */}
      <div className="absolute right-4 top-6 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-24 h-24">
          <rect x="30" y="80" width="140" height="120" fill="#fff" />
          <rect x="50" y="40" width="30" height="40" fill="#fff" />
          <rect x="120" y="40" width="30" height="40" fill="#fff" />
          <rect x="75" y="60" width="50" height="20" fill="#fff" />
          <polygon points="50,40 65,10 80,40" fill="#fff" />
          <polygon points="120,40 135,10 150,40" fill="#fff" />
          <rect x="80" y="130" width="40" height="70" fill="#2d3436" rx="20" />
        </svg>
      </div>

      {/* Stars */}
      <div className="absolute top-6 left-10 w-1.5 h-1.5 bg-adventure-gold rounded-full animate-twinkle" />
      <div className="absolute top-12 left-32 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-8 left-16 w-1 h-1 bg-adventure-coral rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="mb-4">
          <svg className="w-8 h-8 mx-auto" viewBox="0 0 200 200" fill="#fdcb6e">
            <rect x="30" y="80" width="140" height="60" rx="8" />
            <rect x="50" y="40" width="30" height="40" rx="4" />
            <rect x="120" y="40" width="30" height="40" rx="4" />
            <polygon points="50,40 65,10 80,40" />
            <polygon points="120,40 135,10 150,40" />
          </svg>
        </div>

        <p className="font-heading text-lg text-adventure-gold mb-4">
          © {new Date().getFullYear()} {personalInfo.name}
        </p>

        <p className="text-white/60 text-sm mb-2">
          Built with curiosity, coffee, and code. ☕
        </p>

        <p className="text-white/40 text-xs">
          {personalInfo.role}
        </p>
      </div>
    </footer>
  )
}