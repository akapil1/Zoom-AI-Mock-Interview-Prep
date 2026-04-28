import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["reversal-crawfish-catering.ngrok-free.dev"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self' https: data: blob:;",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appssdk.zoom.us;",
              "style-src 'self' 'unsafe-inline' https:;",
              "img-src 'self' data: blob: https:;",
              "font-src 'self' data: https:;",
              "connect-src 'self' https: wss:;",
              "frame-ancestors 'self' https://*.zoom.us;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;