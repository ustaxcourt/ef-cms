#!/usr/bin/env node

import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { writeFileSync } from 'fs';

const client = new CognitoIdentityProviderClient({
  region: 'local',
  endpoint: 'http://localhost:9229',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
});

const username = process.argv[2] || process.env.USERNAME || 'petitionsclerk@example.com';
// Derive a short role slug for the output filename (e.g. "petitioner" from "petitioner@example.com")
const roleSlug = username.split('@')[0];

const response = await client.send(new InitiateAuthCommand({
  AuthFlow: 'USER_PASSWORD_AUTH',
  ClientId: 'bvjrggnd3co403c0aahscinne',
  AuthParameters: {
    USERNAME: username,
    PASSWORD: process.env.PASSWORD || 'Testing1234$',
  },
}));

const idToken = response.AuthenticationResult?.IdToken;
if (!idToken) {
  console.error('Failed to acquire token:', JSON.stringify(response));
  process.exit(1);
}

const outFile = `options-${roleSlug}.prop`;

// Write ZAP Replacer add-on config injecting the real Bearer token into every request
writeFileSync(outFile, [
  'replacer.full_list(0).description=auth1',
  'replacer.full_list(0).enabled=true',
  'replacer.full_list(0).matchtype=REQ_HEADER',
  'replacer.full_list(0).matchstr=Authorization',
  'replacer.full_list(0).regex=false',
  `replacer.full_list(0).replacement=Bearer ${idToken}`,
].join('\n') + '\n');

console.log(`${outFile} written with real ${roleSlug} JWT`);
