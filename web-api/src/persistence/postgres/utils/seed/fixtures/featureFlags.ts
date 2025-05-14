import { NewFeatureFlagTableKysely } from '@web-api/persistence/postgres/featureFlag/schema';

export const featureFlags: NewFeatureFlagTableKysely[] = [
  {
    name: 'chief-judge-name',
    value: { current: 'Maurice B. Foley' },
  },
];
