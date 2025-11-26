# JWT Debugger

A secure, client-side JWT (JSON Web Token) debugger built with React, TypeScript, and Vite. Decode and verify JWT tokens entirely in your browser without sending any data to external servers.

🔗 **Live Demo:** [https://miklinson.github.io/jwt-debugger/](https://miklinson.github.io/jwt-debugger/)

## Features

### Core Functionality
- **JWT Decoding**: Decode JWT tokens and view header, payload, and signature
- **Signature Verification**: Verify JWT signatures using HMAC or RSA/ECDSA algorithms
- **Token Validation**: Check token expiration and time-based claims (exp, nbf, iat)
- **Syntax Highlighting**: JSON syntax highlighting with VS Code Dark+ theme
- **Copy to Clipboard**: One-click copy for header, payload, and signature

### Supported Algorithms
- **HMAC (Symmetric)**: HS256, HS384, HS512
- **RSA (Asymmetric)**: RS256, RS384, RS512
- **ECDSA (Asymmetric)**: ES256, ES384, ES512

### Security
- **100% Client-Side**: All operations happen in your browser using Web Crypto API
- **No External Requests**: Tokens and keys never leave your device
- **No Logging**: Sensitive data is never logged to console in production
- **Private by Design**: Built for security-conscious developers

### User Experience
- **Dark Mode**: Clean, modern dark theme optimized for developers
- **Split-Pane Layout**: Input on left, decoded output on right
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Debounced Input**: Smooth performance with large tokens
- **Real-time Countdown**: Live expiration timer for tokens

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **jose** - JWT verification using Web Crypto API
- **react-syntax-highlighter** - Code syntax highlighting

## Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/miklinson/jwt-debugger.git
cd jwt-debugger

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Usage

### Basic JWT Decoding

1. Paste a JWT token in the left pane
2. The decoded header and payload will appear in the right pane
3. View time-based claims with human-readable timestamps
4. Check validation warnings for expired or invalid tokens

### Signature Verification

1. Navigate to the **Signature** tab
2. Select the algorithm (auto-detected from JWT header)
3. Enter the key:
   - For **HMAC algorithms**: Enter the secret key
   - For **RSA/ECDSA algorithms**: Paste the public key in PEM format
4. Click **Verify Signature**
5. See verification result with success/error message

### Sample JWT

Click the **"Try Sample"** button to load a sample JWT token for testing.

## Project Structure

```
jwt-debugger/
├── src/
│   ├── components/
│   │   ├── jwt/              # JWT-specific components
│   │   │   ├── DecodedDisplay.tsx
│   │   │   ├── HeaderDisplay.tsx
│   │   │   ├── PayloadDisplay.tsx
│   │   │   ├── SignatureDisplay.tsx
│   │   │   ├── ValidationWarnings.tsx
│   │   │   ├── ExpirationTimer.tsx
│   │   │   └── JWTInput.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── SplitPane.tsx
│   │   └── ui/               # Reusable UI components
│   │       └── CopyButton.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useJWTDecoder.ts
│   │   ├── useTokenValidation.ts
│   │   ├── useDebounce.ts
│   │   └── useClipboard.ts
│   ├── utils/                # Utility functions
│   │   ├── jwt.utils.ts      # JWT parsing
│   │   ├── jwt.verify.ts     # Signature verification
│   │   └── claims.utils.ts   # Claims validation
│   ├── types/                # TypeScript types
│   │   └── jwt.types.ts
│   ├── contexts/             # React contexts
│   │   └── ThemeContext.tsx
│   ├── App.tsx               # Main app component
│   └── main.tsx              # App entry point
├── public/                   # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## How It Works

### JWT Parsing
The app uses a custom Base64URL decoder to parse JWT tokens without external dependencies. The token is split into three parts (header, payload, signature) and each part is decoded and parsed as JSON.

### Signature Verification
Verification uses the [jose](https://github.com/panva/jose) library, which leverages the Web Crypto API for cryptographic operations:

- **HMAC**: Secret key is encoded as `Uint8Array` and used directly
- **RSA/ECDSA**: Public key in PEM format is imported using `importSPKI`
- All verification happens client-side in the browser

### Claims Validation
The app validates time-based claims by comparing Unix timestamps:
- **exp (Expiration Time)**: Checks if token is expired
- **nbf (Not Before)**: Checks if token is not yet valid
- **iat (Issued At)**: Validates token issuance time

A real-time countdown timer updates every second for tokens that are about to expire.

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never paste production HMAC secrets** - Use this tool for testing only with sample/development keys
2. **Public keys are safe** - RSA/ECDSA public keys can be safely used for verification
3. **No data transmission** - All operations happen locally in your browser
4. **Inspect the code** - This is open-source; review the code to verify security claims
5. **Use for debugging only** - Not intended for production token generation

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Key Dependencies

- `jose` - Modern JWT library with Web Crypto API support
- `react-syntax-highlighter` - Syntax highlighting for JSON
- `@tailwindcss/vite` - Tailwind integration for Vite

## Deployment

The project uses GitHub Actions for automatic deployment to GitHub Pages. Every push to the `main` branch triggers a new deployment.

### Manual Deployment to Other Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder to Netlify
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

The app requires Web Crypto API support for JWT verification.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by [jwt.io](https://jwt.io/) by Auth0
- Built with [jose](https://github.com/panva/jose) by Panva
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/miklinson/jwt-debugger/issues)
- Check existing issues for solutions

---

**Built with ❤️ for developers who care about security**
