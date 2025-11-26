import { useState } from 'react';
import type { DecodedJWT, ValidationResult } from '../../types/jwt.types';
import { HeaderDisplay } from './HeaderDisplay';
import { PayloadDisplay } from './PayloadDisplay';
import { SignatureDisplay } from './SignatureDisplay';

interface DecodedDisplayProps {
  jwt: DecodedJWT;
  validation: ValidationResult | null;
}

type Tab = 'header' | 'payload' | 'signature';

export function DecodedDisplay({ jwt, validation }: DecodedDisplayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('header');

  const tabs: { id: Tab; label: string; color: string }[] = [
    { id: 'header', label: 'Header', color: 'blue' },
    { id: 'payload', label: 'Payload', color: 'green' },
    { id: 'signature', label: 'Signature', color: 'purple' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'header' && <HeaderDisplay header={jwt.header} />}
        {activeTab === 'payload' && (
          <PayloadDisplay payload={jwt.payload} validation={validation} />
        )}
        {activeTab === 'signature' && (
          <SignatureDisplay jwt={jwt} />
        )}
      </div>
    </div>
  );
}
