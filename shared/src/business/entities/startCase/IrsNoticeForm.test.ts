import {
  CASE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@shared/business/entities/EntityConstants';
import {
  IrsNoticeForm,
  RawIrsNoticeForm,
} from '@shared/business/entities/startCase/IrsNoticeForm';

describe('IrsNoticeForm', () => {
  const VALID_ENTITY: RawIrsNoticeForm = {
    caseType: CASE_TYPES[0],
    key: 'RANDOM_KEY',
  };

  it('should create a valid instance of "IrsNoticeForm" entity', () => {
    const entity = new IrsNoticeForm(VALID_ENTITY);

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('caseType', () => {
      it('should return an error message for "caseType" if its undefined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          caseType: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ caseType: 'Select a case type' });
      });

      it('should return an error message for "caseType" if its an invalid choice', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          caseType: 'SOMETHING_RANDOM',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ caseType: 'Select a case type' });
      });

      describe('BUG REPORT', () => {
        ['Disclosure1', 'Disclosure2'].forEach((caseType: string) => {
          it(`should support "${caseType}" case type`, () => {
            const entity = new IrsNoticeForm({
              ...VALID_ENTITY,
              caseType,
            });

            expect(entity).toBeDefined();

            const errors = entity.getFormattedValidationErrors();
            expect(errors).toEqual(null);
          });
        });
      });
    });

    describe('file', () => {
      it('should not return an error message for "file" if its undefined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          file: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });
    });

    describe('noticeIssuedDate', () => {
      it('should not return an error message for "noticeIssuedDate" if its undefined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          noticeIssuedDate: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "noticeIssuedDate" if its not in the correct format', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          noticeIssuedDate: 'SOMETHING_RANDOM',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          noticeIssuedDate: 'Enter date in format MM/DD/YYYY.',
        });
      });

      it('should return an error message for "noticeIssuedDate" if its a future date', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          noticeIssuedDate: '3000-01-01T01:01:01.000Z',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          noticeIssuedDate: 'Date cannot be in the future.',
        });
      });
    });

    describe('size', () => {
      it('should not return an error message for "size" if its undefined and "file" is undefined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          file: undefined,
          size: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "size" if its undefined and "file" is defined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          file: {},
          size: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ size: 'Your ATP file size is empty' });
      });

      it('should return an error message for "size" if its over the limit and "file" is defined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          file: {},
          size: MAX_FILE_SIZE_BYTES + 1,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          size: 'Your ATP file size is too big. The maximum file size is 250MB.',
        });
      });

      it('should return an error message for "size" if its under the minimum and "file" is defined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          file: {},
          size: 0,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          size: 'Your ATP file size is empty',
        });
      });
    });

    describe('taxYear', () => {
      it('should not return an error message for "taxYear" if its undefined', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          taxYear: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "taxYear" if its over the character limit', () => {
        const entity = new IrsNoticeForm({
          ...VALID_ENTITY,
          taxYear: 'a'.repeat(IrsNoticeForm.taxYearLimit + 1),
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ taxYear: 'Limit is 100 characters.' });
      });
    });
  });
});
