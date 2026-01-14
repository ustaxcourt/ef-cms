import { FeatureFlagTable } from '@web-api/persistence/postgres/featureFlag/schema';

export const featureFlags: FeatureFlagTable[] = [
  {
    name: 'section-outbox-number-of-days',
    value: { current: 7 },
  },
  {
    name: 'chief-judge-name',
    value: { current: 'Maurice B. Foley' },
  },
  {
    name: 'allowed-terminal-ips',
    value: { current: [] },
  },
  {
    name: 'document-visibility-policy-change-date',
    value: { current: '2023-05-01' },
  },
  {
    name: 'e-consent-fields-enabled-feature-flag',
    value: { current: true },
  },
  {
    name: 'clerk-of-court-configuration',
    value: {
      current: {
        name: 'Stephanie A. Servoss',
        title: 'Clerk of the Court',
      },
    },
  },
  {
    name: 'restricted-event-codes',
    value: { current: 'M116' },
  },
];
