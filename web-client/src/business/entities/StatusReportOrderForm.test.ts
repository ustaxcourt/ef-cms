import {
  FORMATS,
  createISODateString,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';
import {
  MAX_STATUS_REPORT_ORDER_TEXT_CHARACTERS,
  STATUS_REPORT_ORDER_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { StatusReportOrderForm } from './StatusReportOrderForm';

const getValidBase = () => ({
  docketEntryDescription: 'Status Report Order',
  issueOrder: STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
  orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
  dueDate: getBusinessDateInFuture({
    numberOfDays: 2,
    outputFormat: FORMATS.YYYYMMDD,
    startDate: createISODateString(),
  }),
});

describe('StatusReportOrderForm', () => {
  describe('valid cases', () => {
    it('should be valid with all required fields provided', () => {
      const form = new StatusReportOrderForm(getValidBase());
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when no orderType is provided and dueDate is omitted', () => {
      const form = new StatusReportOrderForm({
        docketEntryDescription: 'Status Report Order',
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when additionalOrderTextArray contains substantive text', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        additionalOrderTextArray: ['Parties shall comply with the order.'],
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when additionalOrderTextArray contains an empty string', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        additionalOrderTextArray: [''],
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when additionalOrderTextArray is null', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        additionalOrderTextArray: null,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when strickenFromTrialSessions is set and jurisdiction is provided', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        strickenFromTrialSessions: 'true',
        jurisdiction: STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when orderType is stipulatedDecision', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        orderType:
          STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when issueOrder is allCasesInGroup', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        issueOrder:
          STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });
  });

  describe('invalid cases', () => {
    it('should be invalid when docketEntryDescription is missing', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        docketEntryDescription: undefined,
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        docketEntryDescription: 'Enter a docket entry description',
      });
    });

    it('should be invalid when docketEntryDescription exceeds 80 characters', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        docketEntryDescription: 'a'.repeat(81),
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        docketEntryDescription: 'Enter a docket entry description',
      });
    });

    it('should be invalid when orderType is set but dueDate is missing', () => {
      const { dueDate: _dueDate, ...base } = getValidBase();
      const form = new StatusReportOrderForm(base);
      expect(form.getFormattedValidationErrors()).toMatchObject({
        dueDate:
          'Due date is required for status reports and stipulated decisions',
      });
    });

    it('should be invalid when dueDate is in the past', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        dueDate: '2000-01-01',
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        dueDate: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should be invalid when dueDate is not a valid date', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        dueDate: 'not-a-date',
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        dueDate: 'Enter a valid date',
      });
    });

    it('should be invalid when strickenFromTrialSessions is set but jurisdiction is an invalid value', () => {
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        strickenFromTrialSessions: 'true',
        jurisdiction: 'invalidValue',
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        jurisdiction: `"jurisdiction" must be one of [${STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained}, ${STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.restored}, null]`,
      });
    });

    it('should be invalid when an additionalOrderTextArray entry exceeds maximum length', () => {
      const longText = 'a'.repeat(MAX_STATUS_REPORT_ORDER_TEXT_CHARACTERS + 1);
      const form = new StatusReportOrderForm({
        ...getValidBase(),
        additionalOrderTextArray: [longText],
      });
      expect(form.getFormattedValidationErrors()).toMatchObject({
        'additionalOrderTextArray-0': `"additionalOrderTextArray[0]" length must be less than or equal to ${MAX_STATUS_REPORT_ORDER_TEXT_CHARACTERS} characters long`,
      });
    });
  });
});
