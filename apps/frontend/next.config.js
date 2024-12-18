//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {
        // Set this to true if you would like to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false
    },
    distDir: 'out',
    output: 'export',
    env: {
        APP_ENV: process.env.APP_ENV || 'LOCAL'
    },
    reactStrictMode: false // Disable strict mode temporarily
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx
];

module.exports = composePlugins(...plugins)(nextConfig);
