import { runCompute } from 'cerebral/test';

import { formattedCaseDetail } from '../presenter/computeds/formattedCaseDetail';

describe('formattedCaseDetail', () => {
  it('should convert the status to general docket when it is general', async () => {
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          status: 'general',
        },
      },
    });
    expect(result.status).toEqual('general docket');
  });
});
