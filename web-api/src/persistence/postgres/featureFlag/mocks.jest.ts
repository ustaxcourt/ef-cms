import { mockFactory } from '@shared/test/mockFactory';

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
