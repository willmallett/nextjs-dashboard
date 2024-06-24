/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        ppr: 'incremental', // enable Partial Pre-rendering for specific routes
    }
};

module.exports = nextConfig;
