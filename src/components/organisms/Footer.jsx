import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Roadmap', href: '#' },
      { name: 'Changelog', href: '#' }
    ],
    Resources: [
      { name: 'Blog', href: '/resources' },
      { name: 'Guides', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' }
    ],
    Company: [
      { name: 'About', href: '#about' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' }
    ]
  };
  
  return (
    <footer className="bg-surface/50 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MentorSlap</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get unstuck, get mentored, get moving. The productivity platform built for solo entrepreneurs and digital creators.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <ApperIcon name="Github" size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <ApperIcon name="Linkedin" size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-slate-100 font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-slate-400 text-sm">
            © 2024 MentorSlap. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm">
            Made with ❤️ for entrepreneurs who refuse to stay stuck.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;