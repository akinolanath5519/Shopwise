import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
        ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "via.placeholder.com",
      "images.unsplash.com",
      "res.cloudinary.com",
      "www.coolcampergraphics.co.uk", // Add this domain
    ], 
  },
};

export default nextConfig;
