import {
  calculateISODate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export const MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG =
  'motion-visibility-policy-change-date';

export function toggleMotionVisibilityPolicyFlag(flagValue: string): void {
  cy.task('toggleFeatureFlag', {
    flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
    flagValue,
  });
}

export function setMotionVisibilityPolicyDateToYesterday(): void {
  const yesterday = formatDateString(
    calculateISODate({ howMuch: -1, units: 'days' }),
    FORMATS.YYYYMMDD,
  );
  toggleMotionVisibilityPolicyFlag(yesterday);
}

export function setMotionVisibilityPolicyDateToToday(): void {
  const today = formatDateString(calculateISODate({}), FORMATS.YYYYMMDD);
  toggleMotionVisibilityPolicyFlag(today);
}

export function setMotionVisibilityPolicyDateToTomorrow(): void {
  const tomorrow = formatDateString(
    calculateISODate({ howMuch: 1, units: 'days' }),
    FORMATS.YYYYMMDD,
  );
  toggleMotionVisibilityPolicyFlag(tomorrow);
}

export function setOriginalMotionVisibilityPolicyFlag(): void {
  cy.task('getRawFeatureFlagValue', {
    flag: MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  }).as('ORIGINAL_FEATURE_FLAG_VALUE');
}

export function restoreMotionVisibilityPolicyFlag(): void {
  cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(originalFeatureFlagValue => {
    toggleMotionVisibilityPolicyFlag(String(originalFeatureFlagValue));
  });
}
