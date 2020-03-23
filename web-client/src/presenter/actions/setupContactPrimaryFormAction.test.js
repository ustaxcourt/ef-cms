import { runAction } from 'cerebral/test';
import { setupContactPrimaryFormAction } from './setupContactPrimaryFormAction';

describe('setupContactPrimaryFormAction', () => {
  it('should set contactPrimary, caseId, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactPrimaryFormAction, {
      props: {
        caseDetail: {
          caseId: '7fcedcaa-0314-4a43-98b9-fcff9fd2b7d9',
          contactPrimary: {
            name: 'Rachael Ray',
          },
          partyType: 'Petitioner',
        },
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      caseId: '7fcedcaa-0314-4a43-98b9-fcff9fd2b7d9',
      contactPrimary: {
        name: 'Rachael Ray',
      },
      partyType: 'Petitioner',
    });
  });
});
