const { override } = require('customize-cra');

module.exports = override(
    (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            buffer: require.resolve('buffer/'),
            timers: require.resolve('timers-browserify'),
            stream: require.resolve('stream-browserify')
        };
        return config;
    }
);
