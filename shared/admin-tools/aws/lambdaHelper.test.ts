import {
  GetFunctionConfigurationCommand,
  LambdaClient,
  UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { setEnvironmentVariables } from './lambdaHelper';

const mockedEnvironment = {
  Variables: {
    LOG_LEVEL: 'info',
    NODE_ENV: 'production',
  },
};
const updatedEnvironment = { Variables: { LOG_LEVEL: 'verbose' } };

const mockedLambdaClient = mockClient(LambdaClient);

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('setEnvironmentVariables', () => {
  beforeEach(() => {
    mockedLambdaClient.reset();
    mockedLambdaClient.on(GetFunctionConfigurationCommand).rejects({
      message: 'Resource not found',
      name: 'ResourceNotFoundException',
    });
    mockedLambdaClient
      .on(GetFunctionConfigurationCommand, { FunctionName: 'extantLambda' })
      .resolves({ Environment: mockedEnvironment });
  });

  it("updates an extant lambda's environment variables", async () => {
    mockedLambdaClient
      .on(UpdateFunctionConfigurationCommand, {
        Environment: updatedEnvironment,
        FunctionName: 'extantLambda',
      })
      .resolves({});

    const result = await setEnvironmentVariables({
      Environment: updatedEnvironment,
      FunctionName: 'extantLambda',
      region: 'us-east-1',
    });

    expect(result).toEqual(1);
  });

  it('does not make an update request if the lambda does not exist', async () => {
    const result = await setEnvironmentVariables({
      Environment: updatedEnvironment,
      FunctionName: 'nonExistentLambda',
      region: 'us-east-1',
    });

    expect(result).toEqual(0);
  });

  it('throws if GetFunctionConfigurationCommand throws an error other than ResourceNotFound', async () => {
    mockedLambdaClient.on(GetFunctionConfigurationCommand).rejects({
      message: 'General error',
      name: 'Error',
    });
    expect.assertions(1);

    await expect(() =>
      setEnvironmentVariables({
        Environment: updatedEnvironment,
        FunctionName: 'nonExistentLambda',
        region: 'us-east-1',
      }),
    ).rejects.toThrow('General error');
  });

  it('adds new environment variables even if the existing lambda has none', async () => {
    mockedLambdaClient
      .on(GetFunctionConfigurationCommand, { FunctionName: 'extantLambda' })
      .resolves({ Environment: { Variables: {} } });

    const result = await setEnvironmentVariables({
      Environment: updatedEnvironment,
      FunctionName: 'extantLambda',
      region: 'us-east-1',
    });

    expect(result).toEqual(1);
  });

  it('throws if UpdateFunctionConfigurationCommand throws an error', async () => {
    mockedLambdaClient.on(UpdateFunctionConfigurationCommand).rejects({
      message: 'General error',
      name: 'Error',
    });
    expect.assertions(1);

    await expect(() =>
      setEnvironmentVariables({
        Environment: updatedEnvironment,
        FunctionName: 'extantLambda',
        region: 'us-east-1',
      }),
    ).rejects.toThrow('General error');
  });

  it('does not edit the lambda if no environment variables are specified', async () => {
    const result = await setEnvironmentVariables({
      Environment: {},
      FunctionName: 'extantLambda',
    });

    expect(result).toEqual(0);
  });
});
