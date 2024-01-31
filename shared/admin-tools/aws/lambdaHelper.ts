import {
  Environment as EnvironmentType,
  GetFunctionConfigurationCommand,
  LambdaClient,
  UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda';

const supportedRegions = ['us-west-1', 'us-east-1'];
const lambdaClientCache = {};

const getLambdaClient = ({ region }: { region: string }): LambdaClient => {
  if (!lambdaClientCache[region]) {
    lambdaClientCache[region] = new LambdaClient({ region });
  }
  return lambdaClientCache[region];
};

const functionExists = async ({
  FunctionName,
  region,
}: {
  FunctionName: string;
  region: string;
}): Promise<boolean> => {
  let exists: boolean = false;
  const getFunctionConfigurationCommand = new GetFunctionConfigurationCommand({
    FunctionName,
  });
  try {
    await getLambdaClient({ region }).send(getFunctionConfigurationCommand);
    exists = true;
  } catch (err: any) {
    if (!err || !('name' in err) || err.name !== 'ResourceNotFoundException') {
      throw err;
    }
  }
  return exists;
};

const getEnvironment = async ({
  FunctionName,
  region,
}: {
  FunctionName: string;
  region: string;
}): Promise<EnvironmentType> => {
  const getFunctionConfigurationCommand = new GetFunctionConfigurationCommand({
    FunctionName,
  });
  const { Environment } = await getLambdaClient({ region }).send(
    getFunctionConfigurationCommand,
  );
  return Environment || {};
};

const putEnvironment = async ({
  Environment,
  FunctionName,
  region,
}: {
  Environment: EnvironmentType;
  FunctionName: string;
  region: string;
}): Promise<boolean> => {
  const updateFunctionConfigurationCommand =
    new UpdateFunctionConfigurationCommand({ Environment, FunctionName });
  try {
    await getLambdaClient({ region }).send(updateFunctionConfigurationCommand);
    return true;
  } catch (err) {
    console.error('Unable to update lambda configuration:', err);
    throw err;
  }
};

export const setEnvironmentVariables = async ({
  Environment,
  FunctionName,
  region,
}: {
  Environment: EnvironmentType;
  FunctionName: string;
  region?: string;
}): Promise<number> => {
  let updates = 0;
  if (!Environment || !('Variables' in Environment) || !Environment.Variables) {
    return updates;
  }
  const regions = region && region.length > 0 ? [region] : supportedRegions;
  for (const reg of regions) {
    if (!(await functionExists({ FunctionName, region: reg }))) {
      console.error(`Lambda ${FunctionName} does not exist in region ${reg}.`);
      continue;
    }
    const env = await getEnvironment({ FunctionName, region: reg });
    const newEnv =
      env && 'Variables' in env && typeof env.Variables !== 'undefined'
        ? { Variables: { ...env.Variables, ...Environment.Variables } }
        : Environment;
    if (
      await putEnvironment({ Environment: newEnv, FunctionName, region: reg })
    ) {
      console.log(`Lambda ${FunctionName} has been updated in region ${reg}.`);
      updates++;
    }
  }
  return updates;
};
