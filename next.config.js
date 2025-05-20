const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  // Дополнительные опции Sentry
  silent: true, // Подавляет все логи в консоли
  hideSourceMaps: true, // Скрывает source maps в production
});
