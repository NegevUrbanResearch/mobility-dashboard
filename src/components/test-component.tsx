import React from 'react';
import { AlertCircle } from 'lucide-react';

const TestComponent = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
        <div className="flex items-center">
          <AlertCircle className="text-blue-500 mr-2" />
          <p className="text-blue-700">
            Build Test Component - If you can see this, the React build is working correctly!
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Card 1 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Environment Check</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">React Version:</span>{' '}
              {React.version}
            </li>
            <li>
              <span className="font-semibold">Node Env:</span>{' '}
              {process.env.NODE_ENV}
            </li>
            <li>
              <span className="font-semibold">Public URL:</span>{' '}
              {process.env.PUBLIC_URL || 'Not set'}
            </li>
          </ul>
        </div>
        
        {/* Test Card 2 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Navigation Test</h2>
          <p className="text-gray-600 mb-4">
            Verify that your page navigation works by clicking through all pages:
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>Component Rendering</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>Styles Loading</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>Icons Working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;