import {
  SSMClient,
  PutParameterCommand,
  GetParameterCommand,
} from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'us-east-1' });
const { STAGE, ENV } = process.env;

export async function putSSMItem(name: string, value: any): Promise<boolean> {
  const paramName = `/DAWSON/${STAGE || ENV}/${name}`;
  const command = new PutParameterCommand({
    Name: paramName,
    Value: value.toString(),
    Type: 'String',
    Overwrite: true,
  });

  return await ssmClient
    .send(command)
    .then(() => true)
    .catch(() => false);
}

export async function getSSMItem(name: string): Promise<string | undefined> {
  const paramName = `/DAWSON/${STAGE || ENV}/${name}`;

  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: false,
  });

  const response = await ssmClient.send(command);
  return response.Parameter?.Value;
}
