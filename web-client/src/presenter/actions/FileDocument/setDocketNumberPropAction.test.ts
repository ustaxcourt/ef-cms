import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketNumberPropAction } from './setDocketNumberPropAction';

describe('setDocketNumberPropAction', () => {
  const mockDocketNumber = '105-20';

  it('should return state.caseDetail.docketNumber as props', async () => {
    const { output } = await runAction(setDocketNumberPropAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: mockDocketNumber },
      },
    });

    expect(output.docketNumber).toEqual(mockDocketNumber);
  });
});
