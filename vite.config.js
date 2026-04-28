import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const sentryRelease =
    process.env.SENTRY_RELEASE || process.env.VITE_RELEASE || `mrzvir@${mode}`;
  const hasSentryBuildConfig = Boolean(
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT
  );

  return {
    build: {
      sourcemap: true
    },
    plugins: hasSentryBuildConfig
      ? [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            silent: true,
            errorHandler(error) {
              console.warn(
                `Sentry source map upload skipped: ${error.message}`
              );
            },
            release: {
              name: sentryRelease
            },
            sourcemaps: {
              assets: './dist/**'
            },
            telemetry: false
          })
        ]
      : [],
    server: {
      host: '0.0.0.0',
      port: 5173
    },
    preview: {
      host: '0.0.0.0',
      port: 4173
    }
  };
});
