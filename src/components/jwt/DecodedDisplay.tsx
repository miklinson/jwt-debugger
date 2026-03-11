import { useState } from 'react';
import type { DecodedJWT, ValidationResult, PartialDecodedJWT, DecodeStatus } from '../../types/jwt.types';
import { HeaderDisplay } from './HeaderDisplay';
import { PayloadDisplay } from './PayloadDisplay';
import { SignatureDisplay } from './SignatureDisplay';

interface DecodedDisplayProps {
  jwt: DecodedJWT | PartialDecodedJWT;
  validation: ValidationResult | null;
}

type Tab = 'header' | 'payload' | 'signature';

export function DecodedDisplay({ jwt, validation }: DecodedDisplayProps) {
  const isPartial = 'isComplete' in jwt;
  const partialJwt = isPartial ? (jwt as PartialDecodedJWT) : null;

  // Default to payload tab for partial tokens (most useful), header for complete
  const defaultTab: Tab = isPartial && !partialJwt?.isComplete ? 'payload' : 'header';
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const tabs: { id: Tab; label: string; color: string; status?: DecodeStatus }[] = [
    {
      id: 'header',
      label: 'Header',
      color: 'blue',
      status: partialJwt?.header.status
    },
    {
      id: 'payload',
      label: 'Payload',
      color: 'green',
      status: partialJwt?.payload.status
    },
    {
      id: 'signature',
      label: 'Signature',
      color: 'purple',
      status: partialJwt?.signature.status
    },
  ];

  // Get status indicator color
  const getStatusColor = (status?: DecodeStatus) => {
    if (!status || status === 'decoded') return null;
    return status === 'masked' ? 'bg-yellow-500' : 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* Partial decode warning banner */}
      {isPartial && !partialJwt?.isComplete && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-yellow-700 dark:text-yellow-300 text-sm">
            Partial JWT: Some parts could not be decoded
          </span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const statusColor = getStatusColor(tab.status);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {tab.label}
                {statusColor && (
                  <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'header' && (
          <HeaderDisplay header={isPartial ? partialJwt!.header : jwt.header} />
        )}
        {activeTab === 'payload' && (
          <PayloadDisplay
            payload={isPartial ? partialJwt!.payload : jwt.payload}
            validation={validation}
          />
        )}
        {activeTab === 'signature' && (
          <SignatureDisplay jwt={jwt} />
        )}
      </div>
    </div>
  );
}
