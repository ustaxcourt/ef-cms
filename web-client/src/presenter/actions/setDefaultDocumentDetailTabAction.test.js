import { runAction } from 'cerebral/test';

import setDefaultDocumentDetailTab from './setDefaultDocumentDetailTabAction';

describe('setDefaultDocumentDetailTab', async () => {
  it('returns "Document Info" when showDocumentInfoTab is true', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          showDocumentInfoTab: true,
        },
      },
    });
    expect(state.currentTab).toEqual('Document Info');
  });

  it('returns "Pending Messages" when showDocumentInfoTab is false', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          showDocumentInfoTab: false,
        },
      },
    });
    expect(state.currentTab).toEqual('Pending Messages');
  });
});
