import { useState } from 'react'
import personalInfo from '../data/personalInfo'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const contactChannels = [
    { label: 'Email', value: personalInfo.email, icon: '📧', href: `mailto:${personalInfo.email}` },
    { label: 'WhatsApp', value: personalInfo.whatsapp, icon: '💬', href: `https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, '')}` },
    { label: 'LinkedIn', value: personalInfo.linkedin, icon: '💼', href: personalInfo.linkedin },
    { label: 'GitHub', value: personalInfo.github, icon: '🐙', href: personalInfo.github },
    { label: 'Location', value: personalInfo.location, icon: '📍', href: '#contact' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`New Quest: Contact from ${formData.name}`)
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-white to-adventure-light dark:from-night-bgAlt dark:to-night-bg relative overflow-hidden">
      {/* Decorative treasure */}
      <div className="absolute top-10 right-10 text-4xl opacity-20 dark:opacity-10 animate-float pointer-events-none hidden md:block">💰</div>
      <div className="absolute bottom-10 left-10 text-3xl opacity-20 dark:opacity-10 animate-float-slow pointer-events-none hidden md:block">🗺️</div>

      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-adventure-purple">📬 Start a New Quest</h2>
        <p className="section-subtitle">
          Have a technical problem, project, or opportunity? Let's start a new quest.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact channels */}
          <div className="card p-8">
            <h3 className="font-heading text-lg text-adventure-dark dark:text-night-text mb-6">⚡ Contact Channels</h3>
            <div className="space-y-3">
              {contactChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith('#') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-adventure-purple/5 dark:hover:bg-adventure-purple/10 transition-colors group"
                >
                  <span className="text-2xl w-10 h-10 flex items-center justify-center bg-adventure-purple/10 rounded-lg group-hover:bg-adventure-purple/20 transition-colors">
                    {channel.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-night-muted font-semibold uppercase">{channel.label}</div>
                    <div className="text-sm text-adventure-dark dark:text-night-text font-semibold truncate">
                      {channel.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="card p-8">
            <h3 className="font-heading text-lg text-adventure-dark dark:text-night-text mb-6">📝 Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-600 dark:text-night-text mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-adventure-dark dark:text-night-text focus:border-adventure-purple outline-none transition-colors text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-600 dark:text-night-text mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-adventure-dark dark:text-night-text focus:border-adventure-purple outline-none transition-colors text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-600 dark:text-night-text mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-adventure-dark dark:text-night-text focus:border-adventure-purple outline-none transition-colors text-sm resize-none"
                  placeholder="Tell me about your quest..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full bg-gradient-to-r from-adventure-purple to-adventure-sky"
              >
                🚀 Send Message
              </button>

              {sent && (
                <p className="text-center text-adventure-green font-semibold text-sm animate-fade-in">
                  ✓ Quest received! Opening your email app...
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}