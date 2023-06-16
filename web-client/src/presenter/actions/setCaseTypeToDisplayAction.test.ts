import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseTypeToDisplayAction } from './setCaseTypeToDisplayAction';

describe('setCaseTypeToDisplayAction', () => {
  it('sets state.openClosedCases.caseType to the value of props.tabName', async () => {
    const result = await runAction(setCaseTypeToDisplayAction, {
      props: {
        tabName: 'Open',
      },
    });

    expect(result.state).toMatchObject({
      openClosedCases: {
        caseType: 'Open',
      },
    });
  });
});
