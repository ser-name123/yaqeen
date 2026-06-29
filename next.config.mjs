/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://utjadhbdvcrbdlzjcqio.supabase.co; connect-src 'self' https://utjadhbdvcrbdlzjcqio.supabase.co wss://utjadhbdvcrbdlzjcqio.supabase.co ws://localhost:* wss://localhost:* http://localhost:* http://127.0.0.1:*;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
