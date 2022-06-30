#!/usr/bin/env node

import { sassPlugin } from 'esbuild-sass-plugin';
import babel from 'esbuild-plugin-babel';
import esbuild from 'esbuild';
import resolve from 'esbuild-plugin-resolve';
import { copy } from 'esbuild-plugin-copy';
import fs from 'fs';

const watch = !!process.env.WATCH;

const env = {
  API_URL: null,
  CHECK_DEPLOY_DATE_INTERVAL: null,
  CI: null,
  CIRCLE_SHA1: null,
  COGNITO: null,
  COGNITO_CLIENT_ID: null,
  COGNITO_LOGIN_URL: null,
  COGNITO_REDIRECT_URI: null,
  COGNITO_SUFFIX: null,
  COGNITO_TOKEN_URL: null,
  DYNAMODB_TABLE_NAME: null,
  ENV: null,
  FILE_UPLOAD_MODAL_TIMEOUT: null,
  IS_LOCAL: null,
  NO_SCANNER: null,
  NODE_DEBUG: null,
  PDF_EXPRESS_LICENSE_KEY: null,
  PUBLIC_SITE_URL: null,
  SCANNER_RESOURCE_URI: null,
  SESSION_MODAL_TIMEOUT: null,
  SESSION_TIMEOUT: null,
  SKIP_VIRUS_SCAN: null,
  STAGE: null,
  USTC_DEBUG: null,
  USTC_ENV: null,
  WS_URL: null,
};

esbuild
  .build({
    bundle: true,
    define: {
      global: 'window',
      'process.version': '""',
      // 'process.env.NODE_ENV': '"production"',
      ...Object.keys(env).reduce((acc, key) => {
        acc[`process.env.${key}`] = '""';
        return acc;
      }, {}),
    },
    entryPoints: ['web-client/src/index.js'],
    loader: {
      '.html': 'text',
      '.pdf': 'binary',
      '.png': 'dataurl',
      '.svg': 'dataurl',
      '.ttf': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    metafile: true,
    logLevel: 'info',
    minify: true,
    splitting: true,
    outdir: 'dist',
    format: 'esm',
    plugins: [
      resolve({
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        // util: 'util/',
      }),
      sassPlugin(),
      babel({
        config: {
          ignore: ['node_modules', 'shared', 'web-api'],
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
        filter: /\.(js|jsx)$/,
      }),
      copy({
        assets: [
          {
            from: ['web-client/src/favicons'],
            to: ['.'],
            keepStructure: true,
          },
          {
            from: ['web-client/src/site.webmanifest'],
            to: ['.'],
            keepStructure: true,
          },
          {
            from: ['web-client/src/deployed-date.txt'],
            to: ['.'],
            keepStructure: true,
          },
          {
            from: ['web-client/src/index.html'],
            to: ['.'],
            keepStructure: true,
          },
        ],
      }),
    ],
    watch,
  })
  .then(async result => {
    fs.writeFileSync('metadata.json', JSON.stringify(result.metafile, null, 2));
  });
