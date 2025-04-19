import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate a subscription
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-indigo-500">Skill Bridge</h2>
            <p className="mt-2 text-sm text-gray-400">
              Empowering learners with quality education and skill development.
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect with Us</h3>
            <div className="flex space-x-6 text-gray-400">
              <Link to="#" className="hover:text-indigo-500">
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-indigo-500">
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-indigo-500">
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-indigo-500">
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-400">Email: support@skillbridge.com</p>
            <p className="text-sm text-gray-400 mt-1">Phone: +1 (123) 456-7890</p>
            <p className="text-sm text-gray-400 mt-1">Location: San Francisco, CA</p>
          </div>
        </div>

        {/* Newsletter Subscription
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="flex justify-center items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-r-md text-white hover:bg-indigo-700">
              Subscribe
            </button>
          </form>
        </div> */}

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Skill Bridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
