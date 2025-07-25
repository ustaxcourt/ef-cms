import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} from '@aws-sdk/client-ssm';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getSsmClient } from '@web-api/persistence/ssm/getSsmClient';

const LOCAL_SSM_DATA: Record<string, string> = {
  'maintenance-mode': 'false',
};

export async function getSsmParameter({
  applicationContext,
  parameterName,
}: {
  applicationContext: ServerApplicationContext;
  parameterName: string;
}): Promise<string | undefined> {
  if (applicationContext.environment.stage === 'local')
    return LOCAL_SSM_DATA[parameterName];

  const SSMClient: SSMClient = getSsmClient();
  const { stage } = applicationContext.environment;
  const paramName = `/DAWSON/${stage}/${parameterName}`;

  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: false,
  });

  const response = await SSMClient.send(command);
  return response.Parameter?.Value;
}

export async function updateSsmParameter({
  applicationContext,
  parameterName,
  value,
}: {
  applicationContext: ServerApplicationContext;
  parameterName: string;
  value: any;
}): Promise<void> {
  if (applicationContext.environment.stage === 'local') {
    LOCAL_SSM_DATA[parameterName] = value.toString() as string;
    return;
  }
  const SSMClient: SSMClient = getSsmClient();
  const { stage } = applicationContext.environment;
  const paramName = `/DAWSON/${stage}/${parameterName}`;

  const command = new PutParameterCommand({
    Name: paramName,
    Value: value.toString(),
    Type: 'String',
    Overwrite: true,
  });

  await SSMClient.send(command);
}
