import { runAction } from 'cerebral/test';
import { setCasesAction } from './setCasesAction';

describe('setCasesAction', () => {
  it('sets state.openCases from props.openCaseList and state.closedCases from props.closedCaseList', async () => {
    const { state } = await runAction(setCasesAction, {
      props: {
        closedCaseList: [
          {
            caseId: '1234',
          },
          {
            caseId: '2345',
          },
        ],
        openCaseList: [
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
        openCases: [],
      },
    });

    expect(state.openCases).toEqual([
      {
        caseId: '1234',
      },
      { caseId: '2345' },
    ]);
    expect(state.closedCases).toEqual([
      {
        caseId: '1234',
      },
      { caseId: '2345' },
    ]);
  });
});
