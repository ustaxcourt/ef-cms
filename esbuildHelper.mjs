#!/usr/bin/env node
/* eslint-disable import/no-default-export */
/* eslint-disable promise/no-nesting */
import { createServer, request } from 'http';

const clients = [];
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';
import { sassPlugin } from 'esbuild-sass-plugin';
import autoprefixer from 'autoprefixer';
import babel from 'esbuild-plugin-babel-cached';
import esbuild from 'esbuild';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import resolve from 'esbuild-plugin-resolve';

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

/**
 * used for spinning up or building the UI using es build
 */
export default function ({
  entryPoint,
  hostPort,
  indexName,
  jsRegex,
  outdir,
  replaceHtmlFile,
  servePort,
}) {
  const sassMap = new Map();

  esbuild
    .build({
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
          // util: 'util/',
        }),
        sassPlugin({
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
      ],
      sourcemap: process.env.USTC_ENV !== 'prod',
      splitting: true,
      watch: watch
        ? {
            onRebuild(error, result) {
              replaceHtmlFile();
              clients.forEach(res => res.write('data: update\n\n'));
              clients.length = 0;
              error && console.error(error);

              fs.writeFileSync(
                'metadata.json',
                JSON.stringify(result.metafile, null, 2),
              );
            },
          }
        : false,
    })
    .catch(() => process.exit(1))

    .then(() => {
      replaceHtmlFile();

      if (watch) {
        esbuild.serve({ port: servePort, servedir: outdir }, {}).then(() => {
          createServer((req, res) => {
            const { headers, method, url } = req;

            if (req.url === '/esbuild') {
              return clients.push(
                res.writeHead(200, {
                  'Cache-Control': 'no-cache',
                  Connection: 'keep-alive',
                  'Content-Type': 'text/event-stream',
                }),
              );
            }

            let pathWithouthQuery = url.includes('?') ? url.split('?')[0] : url;
            const path = ~pathWithouthQuery.split('/').pop().indexOf('.')
              ? url
              : '/index.html'; //for PWA with router

            req.pipe(
              request(
                {
                  headers,
                  hostname: 'localhost',
                  method,
                  path,
                  port: servePort,
                },
                prxRes => {
                  // const jsRegex = /index\.[A-Z0-9]+\.js/;
                  if (jsRegex.test(url)) {
                    const jsReloadCode =
                      ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();';

                    const newHeaders = {
                      ...prxRes.headers,
                      'content-length':
                        parseInt(prxRes.headers['content-length'], 10) +
                        jsReloadCode.length,
                    };

                    res.writeHead(prxRes.statusCode, newHeaders);
                    res.write(jsReloadCode);
                  } else {
                    res.writeHead(prxRes.statusCode, prxRes.headers);
                  }
                  prxRes.pipe(res, { end: true });
                },
              ),
              { end: true },
            );
          }).listen(hostPort);
        });
      }
    });
}
