import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@aws-sdk/client-ssm', () => ({
  SSMClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutParameterCommand: jest.fn(),
  GetParameterCommand: jest.fn(),
  DeleteParameterCommand: jest.fn(),
}));

jest.mock(
  '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues',
  () =>
    mockFactory('getFeatureFlagValues', [
      {
        name: 'entity-locking-feature-flag',
        value: {
          current: true,
        },
      },
    ]),
);
