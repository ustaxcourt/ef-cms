#!/usr/bin/env node
/* eslint-disable import/no-default-export */
/* eslint-disable promise/no-nesting */
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';
import { sassPlugin } from 'esbuild-sass-plugin';
import autoprefixer from 'autoprefixer';
import babel from 'esbuild-plugin-babel-cached';
import esbuild from 'esbuild';
import livereload from 'livereload';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import resolve from 'esbuild-plugin-resolve';

const watch = !!process.env.WATCH;

let server;

const env = {
  API_URL: process.env.API_URL,
  CHECK_DEPLOY_DATE_INTERVAL: process.env.CHECK_DEPLOY_DATE_INTERVAL,
  CI: process.env.CI,
  CIRCLE_SHA1: process.env.CIRCLE_SHA1,
  COGNITO: process.env.COGNITO,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  COGNITO_LOGIN_URL: process.env.COGNITO_LOGIN_URL,
  COGNITO_PASSWORD_RESET_REQUEST_URL:
    process.env.COGNITO_PASSWORD_RESET_REQUEST_URL,
  COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
  COGNITO_SUFFIX: process.env.COGNITO_SUFFIX,
  COGNITO_TOKEN_URL: process.env.COGNITO_TOKEN_URL,
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
  ENV: process.env.ENV,
  FILE_UPLOAD_MODAL_TIMEOUT: process.env.FILE_UPLOAD_MODAL_TIMEOUT,
  IS_LOCAL: process.env.IS_LOCAL,
  NO_SCANNER: process.env.NO_SCANNER,
  NODE_DEBUG: process.env.NODE_DEBUG,
  PDF_EXPRESS_LICENSE_KEY: process.env.PDF_EXPRESS_LICENSE_KEY,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  SCANNER_RESOURCE_URI: process.env.SCANNER_RESOURCE_URI,
  SESSION_MODAL_TIMEOUT: process.env.SESSION_MODAL_TIMEOUT,
  SESSION_TIMEOUT: process.env.SESSION_TIMEOUT,
  SKIP_VIRUS_SCAN: process.env.SKIP_VIRUS_SCAN,
  STAGE: process.env.STAGE,
  USE_COGNITO_LOCAL: process.env.USE_COGNITO_LOCAL,
  USTC_ENV: process.env.USTC_ENV,
  WS_URL: process.env.WS_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

/**
 * used for spinning up or building the UI using es build
 */
export default async function ({
  entryPoint,
  indexName,
  outdir,
  reloadServerPort,
  replaceHtmlFile,
}) {
  if (watch && !process.env.CI) {
    server = livereload.createServer({ port: reloadServerPort });
  }
  const sassMap = new Map();
  const buildOptions = {
    bundle: true,
    define: {
      global: 'window',
      'process.version': '""',
      ...Object.entries(env).reduce((acc, [key, value]) => {
        acc[`process.env.${key}`] = value ? JSON.stringify(value) : '""';
        return acc;
      }, {}),
    },
    entryNames: '[name].[hash]',
    entryPoints: [`web-client/src/${entryPoint}`],
    format: 'esm',
    loader: {
      '.html': 'text',
      '.pdf': 'file',
      '.png': 'dataurl',
      '.svg': 'dataurl',
      '.ttf': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    logLevel: 'info',
    metafile: true,
    minify: process.env.USTC_ENV === 'prod',
    outdir,
    plugins: [
      clean({
        patterns: [`./${outdir}/*`],
      }),
      resolve({
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
      }),
      sassPlugin({
        loadPaths: [
          './node_modules/@uswds',
          './node_modules/@uswds/uswds/packages',
        ],
        async transform(source, resolveDir, filePath) {
          let value = sassMap.get(filePath);
          if (!value || value.source !== source) {
            const { css } = await postcss([
              autoprefixer,
              postcssPresetEnv({ stage: 0 }),
            ]).process(source, { from: undefined });
            value = { css, source };
            sassMap.set(filePath, value);
          }
          return value.css;
        },
      }),
      babel({
        config: {
          ignore: ['node_modules'],
          plugins: [
            'babel-plugin-cerebral',
            'transform-html-import-require-to-string',
          ],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  esmodules: true,
                },
              },
            ],
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
          ],
          sourceType: 'unambiguous',
          targets: 'defaults',
        },
        filter: /\.(js|ts|jsx|tsx)$/,
      }),
      copy({
        assets: [
          {
            from: ['web-client/src/favicons'],
            keepStructure: true,
            to: ['.'],
          },
          {
            from: ['web-client/src/site.webmanifest'],
            keepStructure: true,
            to: ['.'],
          },
          {
            from: ['web-client/src/deployed-date.txt'],
            keepStructure: true,
            to: ['.'],
          },
          {
            from: [`web-client/src/${indexName}`],
            keepStructure: true,
            to: ['.'],
          },
        ],
      }),
      {
        name: 'replace-html-and-reload',
        setup(build) {
          build.onEnd(() => {
            console.log('replacing html from setup');
            replaceHtmlFile(watch);
            server?.refresh('index.html');
          });
        },
      },
    ],
    sourcemap: process.env.USTC_ENV !== 'prod',
    splitting: true,
  };

  if (!watch && !process.env.CI) {
    await esbuild.build(buildOptions);
  } else {
    const ctx = await esbuild.context(buildOptions);

    await ctx.watch().catch(() => process.exit(1));
  }
}
