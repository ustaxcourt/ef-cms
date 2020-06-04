import { runAction } from 'cerebral/test';
import { setOpenCasesAction } from './setOpenCasesAction';

describe('setOpenCasesAction', () => {
  it('sets state.openCases from props.openCaseList', async () => {
    const { state } = await runAction(setOpenCasesAction, {
      props: {
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
        openCases: [],
      },
    });

    expect(state.openCases).toEqual([
      {
        caseId: '1234',
      },
      { caseId: '2345' },
    ]);
  });
});
