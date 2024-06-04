import {
  GetFunctionConfigurationCommand,
  LambdaClient,
  UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda';

const REGION = 'us-east-1';
const FUNCTION_NAME = process.argv[2];
const ENV_VARS_KEY_VALUE_UPSERT: { [key: string]: string } = {
  DISABLE_ALL_TRAFFIC: 'false',
};

if (!FUNCTION_NAME) {
  console.error('Function name is required as a command-line argument');
  process.exit(1);
}

const getFunctionConfiguration = async (functionName: string) => {
  const client = new LambdaClient({ region: REGION });
  const command = new GetFunctionConfigurationCommand({
    FunctionName: functionName,
  });
  return await client.send(command);
};

const updateFunctionConfiguration = async (envVars: Record<string, string>) => {
  const client = new LambdaClient({ region: REGION });
  const command = new UpdateFunctionConfigurationCommand({
    Environment: { Variables: envVars },
    FunctionName: FUNCTION_NAME,
  });
  return await client.send(command);
};

const updateEnvVars = async () => {
  const functionConfig = await getFunctionConfiguration(FUNCTION_NAME);
  const existingEnvVars = functionConfig.Environment?.Variables || {};

  for (const [key, value] of Object.entries(ENV_VARS_KEY_VALUE_UPSERT)) {
    existingEnvVars[key] = value;
  }

  await updateFunctionConfiguration(existingEnvVars);
};

updateEnvVars()
  .then(() => {
    console.log('done updating env variable');
  })
  .catch(console.error);
