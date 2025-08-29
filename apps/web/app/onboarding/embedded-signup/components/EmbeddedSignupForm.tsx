'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LinkIcon,
  KeyIcon,
  GlobeAltIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import React from 'react'; // Added missing import for React

export default function EmbeddedSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Create Meta App',
      description: 'Create a new Meta App in the Meta for Developers console',
      icon: KeyIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-medium text-blue-300 mb-2">Step 1: Go to Meta for Developers</h4>
            <a 
              href="https://developers.facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Open Meta for Developers</span>
            </a>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300">Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Click "Create App" or "My Apps" → "Create App"</li>
              <li>Select "Business" as the app type</li>
              <li>Enter your app name (e.g., "Your Business WhatsApp")</li>
              <li>Add your business email</li>
              <li>Click "Create App"</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Add WhatsApp Product',
      description: 'Add WhatsApp as a product to your Meta App',
      icon: ChatBubbleLeftRightIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-medium text-green-300 mb-2">Step 2: Add WhatsApp Product</h4>
            <p className="text-green-200 text-sm">In your app dashboard, add WhatsApp as a product</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300">What to do:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Go to your app dashboard</li>
              <li>Click "Add Product"</li>
              <li>Search for "WhatsApp"</li>
              <li>Click "Set Up" on WhatsApp</li>
              <li>Follow the setup wizard</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Configure WhatsApp Business',
      description: 'Set up your WhatsApp Business Account and phone number',
      icon: PhoneIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-medium text-purple-300 mb-2">Step 3: WhatsApp Business Setup</h4>
            <p className="text-purple-200 text-sm">Configure your business account and verify phone number</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300">Configuration steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Complete business profile information</li>
              <li>Verify your business phone number</li>
              <li>Set up business hours and description</li>
              <li>Configure messaging templates</li>
              <li>Get your access token</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Get Credentials',
      description: 'Collect your API credentials and configuration details',
      icon: KeyIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-medium text-yellow-300 mb-2">Step 4: Collect Credentials</h4>
            <p className="text-yellow-200 text-sm">Gather all the required information for integration</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300">You'll need these credentials:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
              <li><strong>Meta App ID:</strong> Found in your app dashboard</li>
              <li><strong>Meta App Secret:</strong> In app settings → Basic</li>
              <li><strong>WhatsApp Business Account ID:</strong> In WhatsApp → Getting Started</li>
              <li><strong>Phone Number ID:</strong> In WhatsApp → Phone Numbers</li>
              <li><strong>Access Token:</strong> Generate in WhatsApp → Getting Started</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Complete Integration',
      description: 'Enter your credentials to complete the setup',
      icon: CheckCircleIcon,
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-medium text-green-300 mb-2">Step 5: Complete Setup</h4>
            <p className="text-green-200 text-sm">Enter your credentials to finish the integration</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300">Next steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Go back to Settings → WhatsApp Business</li>
              <li>Choose "Manual Setup" option</li>
              <li>Enter all the credentials you collected</li>
              <li>Save your configuration</li>
              <li>Test the connection</li>
            </ol>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <a 
              href="/settings/whatsapp" 
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Go to WhatsApp Settings</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Setup Progress</h2>
          <span className="text-sm text-gray-400">Step {currentStep} of {steps.length}</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {steps.map((step) => (
            <span key={step.id} className={step.id <= currentStep ? 'text-blue-400' : ''}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-lg">
            {currentStepData?.icon && React.createElement(currentStepData.icon, { className: "w-6 h-6 text-white" })}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{currentStepData?.title}</h3>
            <p className="text-gray-400">{currentStepData?.description}</p>
          </div>
        </div>

        <div className="mb-6">
          {currentStepData?.content}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
            {currentStep < steps.length && <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <InformationCircleIcon className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Need Help?</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-400">
          <p>
            If you encounter any issues during the setup process, here are some helpful resources:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Official Documentation</h4>
              <a 
                href="https://developers.facebook.com/docs/whatsapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                WhatsApp Business API Docs
              </a>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Video Tutorials</h4>
              <a 
                href="/help" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Watch Setup Videos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
