#!/usr/bin/env node
/**
 * Acquires a real Cognito JWT from cognito-local and writes options.prop
 * for ZAP's Replacer add-on so authenticated API endpoints are actually tested.
 *
 * Requires: local stack running (npm run start:all:ci) with cognito-local on port 9229.
 * Writes:   options.prop in the repo root (gitignored at runtime; static placeholder kept).
 * Usage:    node scripts/get-local-zap-token.mjs
 */
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { writeFileSync } from 'fs';

const client = new CognitoIdentityProviderClient({
  region: 'local',
  endpoint: 'http://localhost:9229',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
});

const response = await client.send(new InitiateAuthCommand({
  AuthFlow: 'USER_PASSWORD_AUTH',
  ClientId: 'bvjrggnd3co403c0aahscinne',
  AuthParameters: {
    USERNAME: 'petitionsclerk@example.com',
    PASSWORD: 'Testing1234$',
  },
}));

const idToken = response.AuthenticationResult?.IdToken;
if (!idToken) {
  console.error('Failed to acquire token:', JSON.stringify(response));
  process.exit(1);
}

// Write ZAP Replacer add-on config injecting the real Bearer token into every request
writeFileSync('options.prop', [
  'replacer.full_list(0).description=auth1',
  'replacer.full_list(0).enabled=true',
  'replacer.full_list(0).matchtype=REQ_HEADER',
  'replacer.full_list(0).matchstr=Authorization',
  'replacer.full_list(0).regex=false',
  `replacer.full_list(0).replacement=Bearer ${idToken}`,
].join('\n') + '\n');

console.log('options.prop written with real petitionsclerk JWT');
