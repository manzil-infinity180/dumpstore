import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckIcon, StarIcon, BookmarkIcon, CalendarIcon, UploadIcon, DrumIcon as DragIcon, TagIcon, Github, Linkedin } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";

const features = [
  { icon: BookmarkIcon, tag: "Cloud-Powered Storage", outline: "Store unlimited bookmarks in the cloud without impacting browser performance" },
  { icon: UploadIcon, tag: "One-Click Import", outline: "Import all your Chrome bookmarks in a single click with our Chrome extension" },
  { icon: TagIcon, tag: "AI-Powered Organization", outline: "Get summaries, titles, and tags automatically using AI (Gemini, Claude, or OpenAI)" },
  { icon: CalendarIcon, tag: "Google Calendar Integration", outline: "Add events to your Google Calendar with just one click" },
  { icon: DragIcon, tag: "Drag and Drop", outline: "Easily organize your bookmarks with intuitive drag and drop functionality" },
  { icon: BookmarkIcon, tag: "Smart Categories", outline: "Automatically categorize your bookmarks for effortless organization" },
];

const reviews = [
  { name: "John Doe", rating: 5, text: "Dumpstore has revolutionized how I manage my bookmarks!" },
  { name: "Jane Smith", rating: 4, text: "Great service, the AI-powered summaries are a game-changer." },
  { name: "Mike Johnson", rating: 5, text: "The Chrome extension makes importing a breeze. Highly recommended!" }
];

const LandingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'free'>('free');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <div className="absolute inset-0 bg-opacity-50 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="relative flex-grow flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center max-w-6xl mx-auto w-full">
            <div className="text-2xl font-bold">Dumpstore</div>
            <div className="hidden sm:flex space-x-4">
              <a href="#features" className="hover:text-blue-600">Features</a>
              <a href="#extension" className="hover:text-blue-600">Chrome Extension</a>
              <a href="#pricing" className="hover:text-blue-600">Pricing</a>
              <a href="#reviews" className="hover:text-blue-600">Reviews</a>
            </div>
            <div>
              <Link to="/login" className="hover:text-blue-600 cursor-pointer">Login</Link>
              <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ml-4">Sign Up</button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-6xl mx-auto">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 text-blue-600 ring-1 ring-blue-600/10 hover:ring-blue-600/20 mb-8">
                <span>Organize your bookmarks like never before</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Bookmarks, Supercharged
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto text-gray-600">
                Import from Chrome, organize with AI, and access from anywhere. Say goodbye to browser clutter!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
                  Get Started Free
                </button>
                <button onClick={() => window.location.href = '#extension'} className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300">
                  Install Extension
                </button>
              </div>

              {/* Floating Icons Component */}
              {/* <FloatingIcons /> */}

              {/* Trusted by users */}
              {/* <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Trusted by <span className="font-semibold">10,000+</span> users
                </p>
              </div> */}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-500 mr-2" />
                      <h3 className="font-semibold text-lg">{feature.tag}</h3>
                    </div>
                    <p className="text-gray-600">{feature.outline}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Chrome Extension Section */}
          <section id="extension" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Chrome Extension</h2>
                <p className="text-xl mb-6">Import all your Chrome bookmarks with just one click. Our powerful extension makes transitioning to Dumpstore effortless.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
                  Add to Chrome
                </button>
              </div>
              {/* <div className="md:w-1/2">
                <img src="/placeholder.svg" alt="Chrome Extension Demo" className="w-full h-auto rounded-lg shadow-lg" />
              </div> */}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
              <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
                  <p className="text-gray-600 mb-4">Perfect for getting started</p>
                  <p className="text-4xl font-bold mb-6">$0.00<span className="text-lg font-normal">/month</span></p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Unlimited bookmarks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Chrome extension</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Basic AI features (Gemini)</span>
                    </li>
                  </ul>
                  <button 
                    className={`w-full py-2 px-4 rounded-lg font-semibold ${selectedPlan === 'free' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => setSelectedPlan('free')}
                  >
                    {selectedPlan === 'free' ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full opacity-50">
                  {/* <div className="absolute top-4 right-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">Coming Soon</div> */}
                  <h3 className="text-2xl font-bold mb-4">Pro Plan</h3>
                  <p className="text-gray-600 mb-4">For power users</p>
                  <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg font-normal">/month</span></p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>All Free features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Advanced AI (Claude or OpenAI)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <button 
                    className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-200 text-gray-800 cursor-not-allowed"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="font-semibold mr-2">{review.name}</div>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
       <footer className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Dumpstore. All rights reserved.</div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a>
              </div>
              <div className="flex space-x-4">
                <a href="https://github.com/manzil-infinity180" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <Github size={20} />
                </a>
                <a href="https://x.com/manzil_rahul" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <FaXTwitter size={20} />
                </a>
                <a href="https://www.linkedin.com/in/rahul-vishwakarma-553874256/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;