import {
  createISODateString,
  FORMATS,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';
import { MotionOrderResponseForm } from './MotionOrderResponseForm';
import {
  MOTION_ORDER_RESPONSE_OPTIONS,
  MAX_ORDER_RESPONSE_TEXT_CHARACTERS,
} from '@shared/business/entities/EntityConstants';

describe('MotionOrderResponseForm', () => {
  describe('valid cases', () => {
    it('should be valid when isOnLeadCase is false and no motionOrderResponse is provided', () => {
      const form = new MotionOrderResponseForm({
        responseDate: getBusinessDateInFuture({
          numberOfDays: 2,
          outputFormat: FORMATS.YYYYMMDD,
          startDate: createISODateString(),
        }),
        additionalOrderText: 'Some additional text',
        isOnLeadCase: false,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when isOnLeadCase is true and motionOrderResponse is provided', () => {
      const responseDate = getBusinessDateInFuture({
        numberOfDays: 3,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });
      const dueDate = getBusinessDateInFuture({
        numberOfDays: 4,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });
      const form = new MotionOrderResponseForm({
        motionOrderResponse:
          MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
        responseDate,
        dueDate,
        additionalOrderText: 'Live long and prosper',
        isOnLeadCase: true,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
      });
      expect(form.getFormattedValidationErrors()).toBeNull();
    });
  });

  describe('validation errors', () => {
    it('should be invalid when required fields are missing', () => {
      const form = new MotionOrderResponseForm({
        isOnLeadCase: false,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        responseDate: 'Response Date is required.',
        issueOrderFor: 'Select on which cases to file this order',
      });
    });

    it('should be invalid when motionOrderResponse is provided but dueDate is missing', () => {
      const responseDate = getBusinessDateInFuture({
        numberOfDays: 17,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });
      const form = new MotionOrderResponseForm({
        motionOrderResponse:
          MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
        responseDate,
        isOnLeadCase: true,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
      });
      const errors = form.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        dueDate: 'Due Date is required when a Reply is ordered',
      });
    });

    it('should be invalid when dueDate is before responseDate', () => {
      const responseDate = getBusinessDateInFuture({
        numberOfDays: 25,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });
      const invalidDueDate = getBusinessDateInFuture({
        numberOfDays: 1,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });

      const form = new MotionOrderResponseForm({
        motionOrderResponse:
          MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY,
        responseDate,
        dueDate: invalidDueDate,
        isOnLeadCase: true,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
      });

      const errors = form.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        dueDate:
          'Due date cannot be prior to response date. Enter a valid date.',
      });
    });

    it('should be invalid when additionalOrderText exceeds maximum length', () => {
      const longText = Array(MAX_ORDER_RESPONSE_TEXT_CHARACTERS + 10)
        .fill('a')
        .join('');
      const form = new MotionOrderResponseForm({
        responseDate: getBusinessDateInFuture({
          numberOfDays: 4,
          outputFormat: FORMATS.YYYYMMDD,
          startDate: createISODateString(),
        }),
        additionalOrderText: longText,
        isOnLeadCase: false,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY,
      });

      const errors = form.getFormattedValidationErrors();
      expect(errors).toMatchObject({
        additionalOrderText: 'Limit is 240 characters.',
      });
    });

    it('should be invalid when issueOrderFor is not valid for non-lead cases', () => {
      const form = new MotionOrderResponseForm({
        responseDate: getBusinessDateInFuture({
          numberOfDays: 1,
          outputFormat: FORMATS.YYYYMMDD,
          startDate: createISODateString(),
        }),
        isOnLeadCase: false,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
      });

      const errors = form.getFormattedValidationErrors();
      expect(errors).toEqual({
        issueOrderFor: `"issueOrderFor" must be [${MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.THIS_CASE_ONLY}]`,
      });
    });

    it('should be invalid when motionOrderResponse is not one of the allowed values', () => {
      const responseDate = getBusinessDateInFuture({
        numberOfDays: 4,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });
      const dueDate = getBusinessDateInFuture({
        numberOfDays: 5,
        outputFormat: FORMATS.YYYYMMDD,
        startDate: createISODateString(),
      });

      const form = new MotionOrderResponseForm({
        motionOrderResponse: 'Not a valid reply option',
        responseDate,
        dueDate,
        isOnLeadCase: true,
        issueOrderFor:
          MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES,
      });

      const errors = form.getFormattedValidationErrors();
      expect(errors).toEqual({
        motionOrderResponse:
          'Order reply must be one of [Order Reply, Order Reply/SR]',
      });
    });
  });
});
