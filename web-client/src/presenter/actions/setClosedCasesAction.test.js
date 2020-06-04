import { runAction } from 'cerebral/test';
import { setClosedCasesAction } from './setClosedCasesAction';

describe('setClosedCasesAction', () => {
  it('sets state.openCases from props.closedCaseList', async () => {
    const { state } = await runAction(setClosedCasesAction, {
      props: {
        closedCaseList: [
          {
            caseId: '1234',
          },
          {
            caseId: '2345',
          },
        ],
      },
      state: {
        closedCases: [],
      },
    });

    expect(state.closedCases).toEqual([
      {
        caseId: '1234',
      },
      { caseId: '2345' },
    ]);
  });
});
