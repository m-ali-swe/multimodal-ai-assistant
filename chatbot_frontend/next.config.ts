import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`, 
      },
    ];
  },
};


export default nextConfig;
