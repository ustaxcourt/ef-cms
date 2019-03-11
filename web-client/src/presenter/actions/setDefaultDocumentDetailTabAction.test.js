import { runAction } from 'cerebral/test';

import { setDefaultDocumentDetailTabAction } from './setDefaultDocumentDetailTabAction';

describe('setDefaultDocumentDetailTab', async () => {
  it('returns "Document Info" when showDocumentInfoTab is true', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      state: {
        documentDetailHelper: {
          showDocumentInfoTab: true,
        },
      },
    });
    expect(state.currentTab).toEqual('Document Info');
  });

  it('returns "Messages" when showDocumentInfoTab is false', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTabAction, {
      state: {
        documentDetailHelper: {
          showDocumentInfoTab: false,
        },
      },
    });
    expect(state.currentTab).toEqual('Messages');
  });
});
