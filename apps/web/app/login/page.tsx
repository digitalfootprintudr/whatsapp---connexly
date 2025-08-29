'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async (userEmail: string, userPassword: string, role: string) => {
    setIsLoading(true);
    setEmail(userEmail);
    setPassword(userPassword);
    
    try {
      await signIn('credentials', { 
        email: userEmail, 
        password: userPassword, 
        callbackUrl: '/' 
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginOptions = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Super Admin',
      description: 'Full platform access',
      icon: ShieldCheckIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      borderColor: 'border-purple-500'
    },
    {
      email: 'vendor@example.com',
      password: 'vendor123',
      role: 'Vendor Admin',
      description: 'Business management access',
      icon: BuildingOfficeIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-500'
    },
    {
      email: 'agent@example.com',
      password: 'agent123',
      role: 'Agent',
      description: 'Customer support access',
      icon: UserGroupIcon,
      color: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Connexly</h1>
          <p className="text-gray-400">WhatsApp Marketing Platform</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Sign in</h2>
          
          {/* Quick Login Buttons */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-300 mb-3 text-center">Quick Login</p>
            <div className="space-y-3">
              {quickLoginOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickLogin(option.email, option.password, option.role)}
                    disabled={isLoading}
                    className={`w-full ${option.color} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 border ${option.borderColor} flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{option.role}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or sign in manually</span>
            </div>
          </div>
          
          <form
            onSubmit={async e => {
              e.preventDefault();
              setIsLoading(true);
              try {
                await signIn('credentials', { email, password, callbackUrl: '/' });
              } catch (error) {
                console.error('Login error:', error);
              } finally {
                setIsLoading(false);
              }
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                required 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          {/* Demo Credentials Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Demo Credentials (click buttons above):
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• <span className="text-purple-400">Super Admin:</span> admin@example.com / admin123</p>
              <p>• <span className="text-blue-400">Vendor Admin:</span> vendor@example.com / vendor123</p>
              <p>• <span className="text-green-400">Agent:</span> agent@example.com / agent123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

