import { useState } from 'react';
import { useJWTDecoder } from './hooks/useJWTDecoder';
import { useTokenValidation } from './hooks/useTokenValidation';
import { Header } from './components/layout/Header';
import { SplitPane } from './components/layout/SplitPane';
import { JWTInput } from './components/jwt/JWTInput';
import { DecodedDisplay } from './components/jwt/DecodedDisplay';
import { ValidationWarnings } from './components/jwt/ValidationWarnings';

function App() {
  const [rawToken, setRawToken] = useState('');
  const decodedJWT = useJWTDecoder(rawToken);
  const validation = useTokenValidation(decodedJWT?.payload);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <SplitPane
        left={<JWTInput value={rawToken} onChange={setRawToken} />}
        right={
          <div className="space-y-4">
            {validation && <ValidationWarnings validation={validation} />}

            {decodedJWT ? (
              <DecodedDisplay jwt={decodedJWT} validation={validation} />
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  No JWT Token
                </h2>
                <p className="text-gray-500 dark:text-gray-500">
                  Paste a JWT token in the left pane to get started
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

export default App;
