import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { stashCaseDetailByCaseIdAction } from './stashCaseDetailByCaseIdAction';

describe('stashCaseDetailByCaseIdAction', () => {
  it('should retrieve trial sessions', async () => {
    const result = await runAction(stashCaseDetailByCaseIdAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: 'okay' },
      },
      state: {
        caseDetailHelper: {},
        formattedCaseDetail: {
          caseId: 'okay',
        },
      },
    });

    expect(result.output.caseDetails.okay).toMatchObject({
      caseId: 'okay',
    });
  });
});
