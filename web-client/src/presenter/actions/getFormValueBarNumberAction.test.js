import { getFormValueBarNumberAction } from './getFormValueBarNumberAction';
import { runAction } from 'cerebral/test';

describe('getFormValueBarNumberAction', () => {
  it('returns the barNumber from the advancedSearchForm state', async () => {
    const result = await runAction(getFormValueBarNumberAction, {
      state: {
        advancedSearchForm: {
          practitionerSearchByBarNumber: {
            barNumber: 'PD1234',
          },
        },
      },
    });

    expect(result.output).toEqual({
      barNumber: 'PD1234',
    });
  });
});
