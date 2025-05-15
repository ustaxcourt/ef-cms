import { NewFeatureFlagTableKysely } from '@web-api/persistence/postgres/featureFlag/schema';

export const featureFlags: NewFeatureFlagTableKysely[] = [
  {
    name: 'chief-judge-name',
    value: { current: 'Maurice B. Foley' },
  },
  {
    name: 'document-visibility-policy-change-date',
    value: { current: '2023-05-01' },
  },
  {
    name: 'e-consent-fields-enabled-feature-flag',
    value: { current: true },
  },
];
