import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { StatusReportOrderForm } from './StatusReportOrderForm';
import {
  FORMATS,
  calculateISODate,
  formatDateString,
} from '../utilities/DateHandler';

describe('StatusReportOrderForm', () => {
  const FUTURE_DATE = formatDateString(
    calculateISODate({ howMuch: 5, units: 'days' }),
    FORMATS.YYYYMMDD,
  );

  const PAST_DATE = formatDateString(
    calculateISODate({ howMuch: -5, units: 'days' }),
    FORMATS.YYYYMMDD,
  );

  const validForm = {
    docketEntryDescription: 'Order for status report',
    dueDate: FUTURE_DATE,
    orderType: STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
  };

  describe('validation', () => {
    it('should be valid when all required fields are present', () => {
      const form = new StatusReportOrderForm(validForm);
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should require docketEntryDescription', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        docketEntryDescription: undefined,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors!.docketEntryDescription).toBeDefined();
    });

    it('should require dueDate when orderType is set', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        dueDate: undefined,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors!.dueDate).toBeDefined();
    });

    it('should not require dueDate when orderType is not set', () => {
      const form = new StatusReportOrderForm({
        docketEntryDescription: 'Order for status report',
        orderType: null,
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should fail validation when dueDate is in the past', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        dueDate: PAST_DATE,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors!.dueDate).toContain('prior to today');
    });

    it('should be valid when strickenFromTrialSessions is set and jurisdiction is null', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        jurisdiction: null,
        strickenFromTrialSessions: 'true',
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when strickenFromTrialSessions is not set and jurisdiction is null', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        jurisdiction: null,
        strickenFromTrialSessions: null,
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should accept valid jurisdiction values', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        jurisdiction:
          STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
        strickenFromTrialSessions: 'true',
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should accept valid issueOrder values', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        issueOrder:
          STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should accept stipulatedDecision as orderType', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        orderType:
          STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should allow additionalOrderText up to 256 characters', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        additionalOrderText: 'a'.repeat(256),
      });
      expect(form.getFormattedValidationErrors()).toEqual(null);
    });

    it('should reject additionalOrderText over 256 characters', () => {
      const form = new StatusReportOrderForm({
        ...validForm,
        additionalOrderText: 'a'.repeat(257),
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors!.additionalOrderText).toBeDefined();
    });
  });
});
