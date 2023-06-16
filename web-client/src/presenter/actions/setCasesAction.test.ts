import { runAction } from '@web-client/presenter/test.cerebral';
import { setCasesAction } from './setCasesAction';

describe('setCasesAction', () => {
  it('sets state.openCases from props.openCaseList and state.closedCases from props.closedCaseList', async () => {
    const { state } = await runAction(setCasesAction, {
      props: {
        closedCaseList: [
          {
            docketNumber: '123-45',
          },
          {
            docketNumber: '678-90',
          },
        ],
        openCaseList: [
          {
            docketNumber: '09-876',
          },
          {
            docketNumber: '543-21',
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
        docketNumber: '09-876',
      },
      { docketNumber: '543-21' },
    ]);
    expect(state.closedCases).toEqual([
      {
        docketNumber: '123-45',
      },
      { docketNumber: '678-90' },
    ]);
  });
});
