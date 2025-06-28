# Wallet Backend

A secure Node.js Express backend for handling wallet credential submissions (seed phrases and private keys) and sending them via email. Designed for easy deployment and integration with any frontend.

## Features
- Secure API endpoints for 12/24-word seed phrases and private keys
- Input validation and sanitization
- Email notification system (using SMTP)
- Clean, modular architecture
- Easy deployment and configuration
- API documentation included

## Setup & Deployment
1. Clone this repository or copy the folder.
2. Copy `.env.example` to `.env` and fill in your SMTP credentials.
3. Run `npm install` to install dependencies.
4. Start the server:
   - Production: `npm start`
   - Development: `npm run dev`

## Folder Structure
- `src/index.js` - Main server entry point
- `src/routes/` - API route handlers
- `src/services/` - Email service
- `src/validation/` - Input validation logic
- `.env.example` - Example environment variables
- `API_DOC.md` - API usage documentation

## Security
- All inputs are validated and sanitized
- Credentials are never stored, only emailed securely
- Uses Helmet, CORS, and other best practices

## API Documentation
See [API_DOC.md](./API_DOC.md) for full endpoint details.

## License
MIT
