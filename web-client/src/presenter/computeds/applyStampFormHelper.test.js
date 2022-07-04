import { applyStampFormHelper } from './applyStampFormHelper';
import { runCompute } from 'cerebral/test';

describe('applyStampFormHelper', () => {
  const CUSTOM_ORDER_MAX_LENGTH = 60;

  it('should return CUSTOM_ORDER_MAX_LENGTH for customOrderTextCharacterCount if customOrderText is not set', () => {
    const { customOrderTextCharacterCount } = runCompute(applyStampFormHelper, {
      state: {
        form: {
          customOrderText: '',
        },
      },
    });
    expect(customOrderTextCharacterCount).toEqual(CUSTOM_ORDER_MAX_LENGTH);
  });

  it('should set customOrderTextCharacterCount to the CUSTOM_ORDER_MAX_LENGTH - customOrderText.length', () => {
    const fourLetterWord = 'cool';
    const { customOrderTextCharacterCount } = runCompute(applyStampFormHelper, {
      state: {
        form: {
          customOrderText: fourLetterWord,
        },
      },
    });

    expect(customOrderTextCharacterCount).toEqual(
      CUSTOM_ORDER_MAX_LENGTH - fourLetterWord.length,
    );
  });
});
