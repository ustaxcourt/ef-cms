import {
  createISODateString,
  FORMATS,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';
import {
  GRANT_DENY_MOTION_OPTIONS,
  MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import { GrantDenyMotionForm } from './GrantDenyMotionForm';

describe('GrantDenyMotionForm', () => {
  const futureDate = () =>
    getBusinessDateInFuture({
      numberOfDays: 5,
      outputFormat: FORMATS.YYYYMMDD,
      startDate: createISODateString(),
    });

  describe('valid cases', () => {
    it('should be valid with only a disposition (granted) and no other fields', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid with disposition denied + moot + without prejudice', () => {
      const form = new GrantDenyMotionForm({
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: MOTION_DISPOSITIONS.DENIED,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when a status report due date message is provided with a future due date and filing party', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDate: futureDate(),
        dueDateMessage:
          GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
        filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.petitioners,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when isOnLeadCase is true and issueOrder is provided', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        isOnLeadCase: true,
        issueOrder:
          GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid with multiple non-empty additional order text entries', () => {
      const form = new GrantDenyMotionForm({
        additionalOrderText: ['first clause', '', 'second clause'],
        disposition: MOTION_DISPOSITIONS.GRANTED,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });
  });

  describe('validation errors', () => {
    it('should be invalid when disposition is missing', () => {
      const form = new GrantDenyMotionForm({});
      expect(form.getFormattedValidationErrors()).toMatchObject({
        disposition: 'Enter a disposition',
      });
    });

    it('should be invalid when dueDateMessage is set without dueDate', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage:
          GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
        filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.respondent,
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        dueDate:
          'Due date is required for status reports and stipulated decisions',
      });
    });

    it('should be invalid when dueDateMessage is set without filingParty', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDate: futureDate(),
        dueDateMessage:
          GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
            .statusReportOrStipulatedDecision,
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        filingParty:
          'Filing party is required when a status report or stipulated decision is ordered',
      });
    });

    it('should be invalid when on lead case without issueOrder', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        isOnLeadCase: true,
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        issueOrder: 'Select on which cases to file this order',
      });
    });

    it('should be invalid when dueDate is in the past', () => {
      const form = new GrantDenyMotionForm({
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDate: '1999-01-01',
        dueDateMessage:
          GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
        filingParty: GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.joint,
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        dueDate: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should be invalid when an additional order text entry exceeds the character limit', () => {
      const longText = 'a'.repeat(
        MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS + 1,
      );
      const form = new GrantDenyMotionForm({
        additionalOrderText: [longText],
        disposition: MOTION_DISPOSITIONS.GRANTED,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors).not.toBeNull();
      expect(JSON.stringify(errors)).toContain(
        `Limit is ${MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS} characters per entry.`,
      );
    });
  });
});
