import { applicationContext } from '../../applicationContext';
import { petitionQcHelper as petitionQcHelperComputed } from './petitionQcHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('petitionQcHelper', () => {
  const petitionQcHelper = withAppContextDecorator(
    petitionQcHelperComputed,
    applicationContext,
  );
  let mockState;

  describe('isPetitionFile', () => {
    it('should be false when the documentSelectedForPreview is NOT a petition file', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'requestForPlaceOfTrialFile',
        },
      };

      const { isPetitionFile } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(isPetitionFile).toBe(false);
    });

    it('should be true when the documentSelectedForPreview is a petition file', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
      };

      const { isPetitionFile } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(isPetitionFile).toBe(true);
    });
  });
});
