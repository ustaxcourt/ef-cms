import { NewFeatureFlagKysely } from '@web-api/persistence/postgres/featureFlags/schema';

export const featureFlags: NewFeatureFlagKysely[] = [
  {
    name: 'chief-judge-name',
    value: { current: 'Maurice B. Foley' },
  },
];
