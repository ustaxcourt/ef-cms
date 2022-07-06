import { applyStampFormHelper } from './applyStampFormHelper';
import { runCompute } from 'cerebral/test';

describe('applyStampFormHelper', () => {
  const CUSTOM_ORDER_MAX_LENGTH = 60;

  describe('customOrderTextCharacterCount', () => {
    it('should return CUSTOM_ORDER_MAX_LENGTH if customOrderText is not set', () => {
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            form: {
              customOrderText: '',
            },
            pdfForSigning: {},
          },
        },
      );
      expect(customOrderTextCharacterCount).toEqual(CUSTOM_ORDER_MAX_LENGTH);
    });

    it('should return the CUSTOM_ORDER_MAX_LENGTH - customOrderText.length if customOrderText is set', () => {
      const fourLetterWord = 'cool';
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            form: {
              customOrderText: fourLetterWord,
            },
            pdfForSigning: {},
          },
        },
      );

      expect(customOrderTextCharacterCount).toEqual(
        CUSTOM_ORDER_MAX_LENGTH - fourLetterWord.length,
      );
    });
  });

  describe('canSaveStampOrder', () => {
    it('should be false when the form.status is not set to either "Denied" or "Granted"', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          form: {
            status: undefined,
          },
          pdfForSigning: {},
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be false when the stamp is not applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          form: {},
          pdfForSigning: {
            stampApplied: false,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be true when the form.status is set and stamp is applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          form: {
            status: 'Granted',
          },
          pdfForSigning: {
            stampApplied: true,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(true);
    });
  });
});
