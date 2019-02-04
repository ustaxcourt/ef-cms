import { runAction } from 'cerebral/test';

import setDefaultDocumentDetailTab from './setDefaultDocumentDetailTabAction';

describe('setDefaultDocumentDetailTab', async () => {
  it('returns "Document Info" when showCaseDetailsEdit is true', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          showCaseDetailsEdit: true,
        },
      },
    });
    expect(state.currentTab).toEqual('Document Info');
  });

  it('returns "Pending Messages" when showCaseDetailsEdit is false', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          showCaseDetailsEdit: false,
        },
      },
    });
    expect(state.currentTab).toEqual('Pending Messages');
  });
});
