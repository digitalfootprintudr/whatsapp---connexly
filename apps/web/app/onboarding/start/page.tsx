'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  icon: any;
}

export default function OnboardingStartPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState({
    businessName: '',
    phoneNumber: '',
    displayName: '',
    portfolioId: '',
    wabaId: '',
  });

  const [steps] = useState<OnboardingStep[]>([
    {
      id: 'authentication',
      title: 'Business Authentication',
      description: 'Authenticate using Facebook or Meta Business credentials',
      status: 'pending',
      icon: UserIcon,
    },
    {
      id: 'portfolio',
      title: 'Business Portfolio',
      description: 'Select existing portfolio or create new one',
      status: 'pending',
      icon: BuildingOfficeIcon,
    },
    {
      id: 'waba',
      title: 'WhatsApp Business Account',
      description: 'Select existing WABA or create new one',
      status: 'pending',
      icon: BuildingOfficeIcon,
    },
    {
      id: 'phone',
      title: 'Phone Number Verification',
      description: 'Enter and verify business phone number',
      status: 'pending',
      icon: PhoneIcon,
    },
    {
      id: 'display',
      title: 'Display Name',
      description: 'Set business display name for WhatsApp',
      status: 'pending',
      icon: UserIcon,
    },
  ]);

  useEffect(() => {
    // Initialize Meta SDK when component mounts
    initializeMetaSDK();
  }, []);

  const initializeMetaSDK = () => {
    // Load Meta SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      // Initialize Facebook SDK
      if (window.FB) {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      }
    };
    
    document.head.appendChild(script);
  };

  const startEmbeddedSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Meta SDK is loaded
      if (!window.FB) {
        throw new Error('Meta SDK not loaded. Please refresh the page.');
      }

      // Start the embedded signup flow
      const response = await fetch('/api/onboarding/start-embedded-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to start embedded signup process');
      }

      const { signupUrl, sessionId } = await response.json();
      
      // Launch embedded signup in popup window
      launchEmbeddedSignup(signupUrl, sessionId);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const launchEmbeddedSignup = (signupUrl: string, sessionId: string) => {
    // Open popup window for embedded signup
    const popup = window.open(
      signupUrl,
      'WhatsAppEmbeddedSignup',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      setError('Popup blocked. Please allow popups for this site.');
      return;
    }

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'EMBEDDED_SIGNUP_COMPLETE') {
        handleSignupComplete(event.data.payload);
        popup.close();
        window.removeEventListener('message', messageListener);
      } else if (event.data.type === 'EMBEDDED_SIGNUP_ERROR') {
        setError(event.data.payload.error);
        popup.close();
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);

    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  };

  const handleSignupComplete = async (payload: any) => {
    try {
      // Update onboarding data with received information
      setOnboardingData({
        businessName: payload.businessName || '',
        phoneNumber: payload.phoneNumber || '',
        displayName: payload.displayName || '',
        portfolioId: payload.portfolioId || '',
        wabaId: payload.wabaId || '',
      });

      // Mark steps as completed
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        status: index < steps.length ? 'completed' : 'pending'
      }));

      // Save onboarding data to backend
      await saveOnboardingData(payload);
      
      // Show success message
      setCurrentStep(steps.length - 1);
      
    } catch (err) {
      setError('Failed to complete onboarding process');
    }
  };

  const saveOnboardingData = async (data: any) => {
    const response = await fetch('/api/onboarding/save-embedded-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save onboarding data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Business Onboarding</h1>
          <p className="text-gray-400">
            Complete your WhatsApp Business API integration using Meta's embedded signup
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Onboarding Progress</h2>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  step.status === 'completed' ? 'bg-green-600 text-white' :
                  step.status === 'in-progress' ? 'bg-blue-600 text-white' :
                  step.status === 'error' ? 'bg-red-600 text-white' :
                  'bg-gray-600 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : step.status === 'error' ? (
                    <ExclamationTriangleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                
                {step.status === 'completed' && (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Ready to Start?</h2>
            <p className="text-gray-400">
              Click the button below to begin the WhatsApp Business embedded signup process.
              You'll be guided through each step in a secure Meta popup window.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={startEmbeddedSignup}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <span>Start Embedded Signup</span>
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">What Happens Next:</h3>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <ol className="text-blue-200 space-y-2 list-decimal list-inside">
              <li><strong>Authentication:</strong> You'll authenticate with your Facebook or Meta Business credentials</li>
              <li><strong>Business Portfolio:</strong> Select an existing portfolio or create a new one</li>
              <li><strong>WhatsApp Business Account:</strong> Choose existing WABA or create new one</li>
              <li><strong>Phone Verification:</strong> Enter and verify your business phone number</li>
              <li><strong>Display Name:</strong> Set how your business appears in WhatsApp</li>
              <li><strong>Integration Complete:</strong> Your WhatsApp Business API will be ready to use</li>
            </ol>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            The embedded signup process is powered by Meta's official Facebook Login for Business. 
            If you encounter any issues, our support team is here to help.
          </p>
          <div className="flex space-x-4">
            <a href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
              📚 Setup Guide
            </a>
            <a href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
              💬 Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
