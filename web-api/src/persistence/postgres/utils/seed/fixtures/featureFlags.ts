import { NewFeatureFlagKysely } from '@web-api/database-types';

export const featureFlags: NewFeatureFlagKysely[] = [
  {
    name: 'chief-judge-name',
    value: { current: 'Maurice B. Foley' },
  },
  {
    name: 'entity-locking-feature-flag',
    value: { current: true },
  },
  {
    name: 'document-visibility-policy-change-date',
    value: { current: '2023-05-01' },
  },
];
