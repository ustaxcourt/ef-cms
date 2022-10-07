import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveSelectedDocketNumbersAction } from './saveSelectedDocketNumbersAction';

describe('saveSelectedDocketNumbersAction', () => {
  it('should set the docketNumbersWithSuffix into the state.addedDocketNumbers when submitting', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      consolidatedCases: [
        {
          checked: true,
          docketNumberWithSuffix: '101-50S',
        },
        {
          checked: true,
          docketNumberWithSuffix: '102-20P',
        },
      ],
    };
    const { state } = await runAction(saveSelectedDocketNumbersAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        addedDocketNumbers: undefined,
        caseDetail,
      },
    });

    expect(state.addedDocketNumbers).toEqual(['101-50S', '102-20P']);
  });
});
