import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { getSecretsClient } from '@web-api/persistence/secrets/getSecretsClient';

export async function getSecret({
  secretName,
}: {
  secretName: string;
}): Promise<string | undefined> {
  const response = await getSecretsClient().send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );

  return response.SecretString;
}
