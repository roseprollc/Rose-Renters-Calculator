export const auth0Config = {
  authorizationParams: {
    redirect_uri: process.env.AUTH0_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email'
  },
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  secret: process.env.AUTH0_SECRET
}; 