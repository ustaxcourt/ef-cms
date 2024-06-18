import { getSecret } from '@web-api/persistence/secrets/getSecret';

export function getSecretsGateway() {
  return {
    getSecret,
  };
}
