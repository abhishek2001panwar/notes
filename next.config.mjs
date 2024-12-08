/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public'
});
const nextConfig = {
    images: {
        domains: ['plus.unsplash.com','media.istockphoto.com' , 'zmdhetisakujelnwjwng.supabase.co'], // Add other domains here if needed
      },

    
};

export default withPWAConfig(nextConfig);
