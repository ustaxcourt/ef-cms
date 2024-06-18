import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

let secretsClientCache: SecretsManagerClient;

export function getSecretsClient(): SecretsManagerClient {
  if (!secretsClientCache) {
    secretsClientCache = new SecretsManagerClient({
      maxAttempts: 3,
      region: 'us-east-1',
    });
  }
  return secretsClientCache;
}
