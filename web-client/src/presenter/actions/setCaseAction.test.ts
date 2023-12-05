import { MOCK_CASE } from '@shared/test/mockCase';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseAction } from './setCaseAction';

describe('setCaseAction', () => {
  it('sets state.caseDetail from props', async () => {
    const { state } = await runAction(setCaseAction, {
      props: {
        caseDetail: {
          ...MOCK_CASE,
          docketNumber: '123-45',
        },
      },
    });

    expect(state.caseDetail).toEqual({
      ...MOCK_CASE,
      docketNumber: '123-45',
    });
  });

  it('should sort the consolidated cases in the case details', async () => {
    const { state } = await runAction(setCaseAction, {
      props: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [
            { docketNumber: '111-99' },
            { docketNumber: '333-77' },
            { docketNumber: '222-88' },
            { docketNumber: '222-77' },
          ],
        },
      },
    });

    expect(state.caseDetail.consolidatedCases).toEqual([
      { docketNumber: '222-77' },
      { docketNumber: '333-77' },
      { docketNumber: '222-88' },
      { docketNumber: '111-99' },
    ]);
  });
});
