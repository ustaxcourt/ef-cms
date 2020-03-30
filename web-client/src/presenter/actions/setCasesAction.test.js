import { runAction } from 'cerebral/test';
import { setCasesAction } from './setCasesAction';

describe('setCasesAction', () => {
  it('sets state.cases from props.caseList', async () => {
    const { state } = await runAction(setCasesAction, {
      props: {
        caseList: [
          {
            caseId: '1234',
          },
          {
            caseId: '2345',
          },
        ],
      },
      state: {
        cases: [],
      },
    });

    expect(state.cases).toEqual([
      {
        caseId: '1234',
      },
      { caseId: '2345' },
    ]);
  });
});
