import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SERVICES = [
  { icon: '⚡', name: 'Electrician', desc: 'Wiring, repairs & installations' },
  { icon: '🔧', name: 'Plumber', desc: 'Leaks, pipes & water systems' },
  { icon: '🪚', name: 'Carpenter', desc: 'Furniture, doors & woodwork' },
  { icon: '🎨', name: 'Painter', desc: 'Interior & exterior painting' },
  { icon: '❄️', name: 'AC Technician', desc: 'AC service, repair & install' },
  { icon: '🧹', name: 'Cleaner', desc: 'Home & office deep cleaning' },
]

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'Homeowner', text: 'Found a great electrician in minutes. The platform is incredibly easy to use!', avatar: '👨' },
  { name: 'Priya Mehta', role: 'Business Owner', text: 'We use Service Finder for all our office maintenance. Vendors are reliable and professional.', avatar: '👩' },
  { name: 'Vikram Das', role: 'Apartment Manager', text: 'The real-time availability feature is a game changer. No more waiting!', avatar: '🧑' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-dark-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold gradient-text">Service Finder</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-slate-400 hover:text-white text-sm transition-colors">Services</a>
              <a href="#about" className="text-slate-400 hover:text-white text-sm transition-colors">About</a>
              {user ? (
                <Link to="/redirect" className="btn-primary text-sm">Go to Dashboard</Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-slate-300 hover:text-white text-sm transition-colors">Login</Link>
                  <Link to="/register" className="btn-primary text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Trusted by 10,000+ customers across India
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Find{' '}
              <span className="gradient-text">Trusted Services</span>
              <br />Near You
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified electricians, plumbers, carpenters and more —
              instantly. Real-time availability, live request tracking, and genuine reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                🚀 Get Started Free
              </Link>
              <Link to="/register?role=vendor" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                🏪 Register as Vendor
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
              {[['500+', 'Vendors'], ['10K+', 'Customers'], ['98%', 'Satisfaction']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-black text-white">{num}</div>
                  <div className="text-sm text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating cards decoration */}
        <div className="absolute top-20 right-10 hidden lg:block opacity-60">
          <div className="card p-4 w-48 animate-pulse-slow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-medium text-white">Raju Electrician</span>
            </div>
            <span className="badge badge-green text-xs">● Available</span>
          </div>
        </div>
        <div className="absolute bottom-20 left-10 hidden lg:block opacity-60">
          <div className="card p-4 w-48">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-xs text-slate-400">"Great service, very fast!"</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="about" className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to get the help you need</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search & Discover', desc: 'Browse verified service providers in your area. Filter by service type, availability, and ratings.' },
              { step: '02', icon: '📩', title: 'Request Service', desc: 'Send a service request with your address, preferred time, and problem description.' },
              { step: '03', icon: '✅', title: 'Get It Done', desc: 'Vendor accepts your request and arrives at your location. Leave a review after completion.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="card card-hover text-center">
                <div className="text-5xl mb-4">{icon}</div>
                <div className="text-xs font-bold text-blue-400 tracking-widest mb-2">STEP {step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Services We Cover</h2>
            <p className="text-slate-400">From home repairs to professional maintenance — we've got you covered</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon, name, desc }) => (
              <div key={name} className="card card-hover group text-center py-8">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="font-bold text-white mb-1">{name}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} className="card">
                <div className="flex text-yellow-400 mb-4">★★★★★</div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">{avatar}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Help?</h2>
          <p className="text-slate-400 mb-8">Join thousands of users who trust Service Finder for all their home service needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">Get Started Now →</Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold gradient-text">Service Finder</span>
          </div>
          <p className="text-sm text-slate-600">© 2024 Service Finder. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
