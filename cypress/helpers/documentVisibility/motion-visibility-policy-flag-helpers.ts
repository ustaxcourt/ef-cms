import {
  calculateISODate,
  formatDateString,
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
    'yyyy-MM-dd',
  );
  toggleMotionVisibilityPolicyFlag(yesterday);
}

export function setMotionVisibilityPolicyDateToToday(): void {
  const today = formatDateString(calculateISODate({}), 'yyyy-MM-dd');
  toggleMotionVisibilityPolicyFlag(today);
}

export function setMotionVisibilityPolicyDateToTomorrow(): void {
  const tomorrow = formatDateString(
    calculateISODate({ howMuch: 1, units: 'days' }),
    'yyyy-MM-dd',
  );
  toggleMotionVisibilityPolicyFlag(tomorrow);
}

export function restoreMotionVisibilityPolicyFlag(): void {
  cy.get('@ORIGINAL_FEATURE_FLAG_VALUE').then(originalFeatureFlagValue => {
    toggleMotionVisibilityPolicyFlag(String(originalFeatureFlagValue));
  });
}
