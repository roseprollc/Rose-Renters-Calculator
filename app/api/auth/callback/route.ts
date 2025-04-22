import { handleAuth } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export const GET = handleAuth({
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get the returnTo parameter from the URL
      const url = new URL(req.url!);
      const returnTo = url.searchParams.get('returnTo') || '/dashboard';
      
      // Set the returnTo URL in the response
      res.setHeader('Location', returnTo);
      
      return res;
    } catch (error) {
      console.error('Auth callback error:', error);
      return Response.redirect(
        new URL('/api/auth/error', req.url!).toString(),
        302
      );
    }
  }
}); 