import { runAction } from '@web-client/presenter/test.cerebral';
import { MOCK_CASE } from '@shared/test/mockCase';
import { setMultiDocketedOriginalCaseAction } from './setMultiDocketedOriginalCaseAction';

describe('setMultiDocketedOriginalCaseAction', () => {
  const mockCase = MOCK_CASE;

  it('should set the state.multiDocketedOriginalCaseDetail to the value of props.multiDocketedOriginalCaseDetail if it exists', async () => {
    const { state } = await runAction(setMultiDocketedOriginalCaseAction, {
      props: {
        multiDocketedOriginalCaseDetail: mockCase,
      },
    });
    expect(state.multiDocketedOriginalCaseDetail).toEqual(mockCase);
  });

  it('should unset the state.multiDocketedOriginalCaseDetail if props.multiDocketedOriginalCaseDetail does not exist', async () => {
    const { state } = await runAction(setMultiDocketedOriginalCaseAction, {
      props: {
        multiDocketedOriginalCaseDetail: undefined,
      },
    });
    expect(state.multiDocketedOriginalCaseDetail).toEqual(undefined);
  });
});
