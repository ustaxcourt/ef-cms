#!/usr/bin/env node

import { sassPlugin } from 'esbuild-sass-plugin';
import babel from 'esbuild-plugin-babel';
import esbuild from 'esbuild';
import resolve from 'esbuild-plugin-resolve';
import { copy } from 'esbuild-plugin-copy';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

import fs from 'fs';

const watch = !!process.env.WATCH;

const env = {
  API_URL: process.env.API_URL,
  CHECK_DEPLOY_DATE_INTERVAL: process.env.CHECK_DEPLOY_DATE_INTERVAL,
  CI: process.env.CI,
  CIRCLE_SHA1: process.env.CIRCLE_SHA1,
  COGNITO: process.env.COGNITO,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  COGNITO_LOGIN_URL: process.env.COGNITO_LOGIN_URL,
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
  USTC_DEBUG: process.env.USTC_DEBUG,
  USTC_ENV: process.env.USTC_ENV,
  WS_URL: process.env.WS_URL,
};

esbuild
  .build({
    bundle: true,
    define: {
      global: 'window',
      'process.version': '""',
      ...Object.entries(env).reduce((acc, [key, value]) => {
        acc[`process.env.${key}`] = value ? `"${value}"` : '""';
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
      sassPlugin({
        async transform(source) {
          const { css } = await postcss([
            autoprefixer,
            postcssPresetEnv({ stage: 0 }),
          ]).process(source, { from: undefined });
          return css;
        },
      }),
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
