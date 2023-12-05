import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { applyStampFormHelper as applyStampFormHelperComputed } from './applyStampFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('applyStampFormHelper', () => {
  const CUSTOM_ORDER_MAX_LENGTH = 60;

  const { DATE_FORMATS, MOTION_DISPOSITIONS } =
    applicationContext.getConstants();

  const applyStampFormHelper = withAppContextDecorator(
    applyStampFormHelperComputed,
    applicationContext,
  );

  const baseState = {
    form: {},
    pdfForSigning: {},
    validationErrors: {},
  };

  describe('canSaveStampOrder', () => {
    it('should be false when the form.disposition is not set to either "Denied" or "Granted"', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be false when the stamp is not applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            stampApplied: false,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be true when the form.disposition is set and stamp is applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          form: {
            disposition: MOTION_DISPOSITIONS.GRANTED,
          },
          pdfForSigning: {
            stampApplied: true,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(true);
    });
  });

  describe('customOrderTextCharacterCount', () => {
    it('should return CUSTOM_ORDER_MAX_LENGTH if customText is not set', () => {
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            ...baseState,
            form: {
              customText: '',
            },
          },
        },
      );
      expect(customOrderTextCharacterCount).toEqual(CUSTOM_ORDER_MAX_LENGTH);
    });

    it('should return the CUSTOM_ORDER_MAX_LENGTH - customText.length if customText is set', () => {
      const fourLetterWord = 'cool';
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            ...baseState,
            form: {
              customText: fourLetterWord,
            },
          },
        },
      );

      expect(customOrderTextCharacterCount).toEqual(
        CUSTOM_ORDER_MAX_LENGTH - fourLetterWord.length,
      );
    });
  });

  describe('hideClass', () => {
    it('should be empty when the stamp has been applied and the pdf has not already been stamped', () => {
      const { hideClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            isPdfAlreadyStamped: false,
            stampApplied: true,
          },
        },
      });

      expect(hideClass).toEqual('');
    });

    it('should be "hide" when the stamp has NOT been applied and the pdf has already been signed', () => {
      const { hideClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            isPdfAlreadyStamped: true,
            stampApplied: false,
          },
        },
      });

      expect(hideClass).toEqual('hide');
    });
  });

  describe('minDate', () => {
    it('should be set to todays date formatted as "YYYY-MM-DD"', () => {
      const mockDate = '1765-09-23';
      applicationContext.getUtilities().formatNow.mockReturnValue(mockDate);

      const { minDate } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(minDate).toEqual(minDate);
      expect(applicationContext.getUtilities().formatNow).toHaveBeenCalledWith(
        DATE_FORMATS.YYYYMMDD,
      );
    });
  });

  describe('dateErrorClass', () => {
    it('should be set to "stamp-form-group" if there are no validationErrors on date', () => {
      const { dateErrorClass } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(dateErrorClass).toEqual('stamp-form-group');
    });

    it('should be set to "stamp-form-group-error" if there are validationErrors on date', () => {
      const { dateErrorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          validationErrors: {
            date: true,
          },
        },
      });

      expect(dateErrorClass).toEqual('stamp-form-group-error');
    });
  });

  describe('dispositionErrorClass', () => {
    it('should be set to "stamp-form-group" if there are no validationErrors on disposition', () => {
      const { dispositionErrorClass } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(dispositionErrorClass).toEqual('stamp-form-group');
    });

    it('should be set to "stamp-form-group-error" if there are validationErrors on disposition', () => {
      const { dispositionErrorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          validationErrors: {
            disposition: true,
          },
        },
      });

      expect(dispositionErrorClass).toEqual('stamp-form-group-error');
    });
  });
});
