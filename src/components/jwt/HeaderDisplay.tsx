import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from '../ui/CopyButton';
import type { JWTHeader } from '../../types/jwt.types';

interface HeaderDisplayProps {
  header: JWTHeader;
}

export function HeaderDisplay({ header }: HeaderDisplayProps) {
  const formattedJSON = JSON.stringify(header, null, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          JWT Header
        </h3>
        <CopyButton text={formattedJSON} label="Copy Header" />
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-700">
        <SyntaxHighlighter
          language="json"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: '#1e1e1e',
          }}
        >
          {formattedJSON}
        </SyntaxHighlighter>
      </div>

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-300 mb-2">
          Header Information
        </h4>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-blue-400 font-medium">Algorithm:</dt>
            <dd className="text-blue-200 mt-1">
              {header.alg} - {getAlgorithmDescription(header.alg)}
            </dd>
          </div>
          <div>
            <dt className="text-blue-400 font-medium">Type:</dt>
            <dd className="text-blue-200 mt-1">{header.typ}</dd>
          </div>
          {header.kid && (
            <div>
              <dt className="text-blue-400 font-medium">Key ID:</dt>
              <dd className="text-blue-200 mt-1 font-mono text-xs">
                {header.kid}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

function getAlgorithmDescription(alg: string): string {
  const descriptions: Record<string, string> = {
    HS256: 'HMAC with SHA-256',
    HS384: 'HMAC with SHA-384',
    HS512: 'HMAC with SHA-512',
    RS256: 'RSA with SHA-256',
    RS384: 'RSA with SHA-384',
    RS512: 'RSA with SHA-512',
    ES256: 'ECDSA with SHA-256',
    ES384: 'ECDSA with SHA-384',
    ES512: 'ECDSA with SHA-512',
  };

  return descriptions[alg] || 'Unknown algorithm';
}
