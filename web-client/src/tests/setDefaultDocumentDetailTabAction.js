import { runAction } from 'cerebral/test';

import setDefaultDocumentDetailTab from '../presenter/actions/setDefaultDocumentDetailTabAction';

describe('setDefaultDocumentDetailTab', async () => {
  it('returns "Document Info" when isEditablePetition is true', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          isEditablePetition: true,
        },
      },
    });
    expect(state.currentTab).toEqual('Document Info');
  });

  it('returns "Pending Messages" when isEditablePetition is false', async () => {
    const { state } = await runAction(setDefaultDocumentDetailTab, {
      state: {
        documentDetailHelper: {
          isEditablePetition: false,
        },
      },
    });
    expect(state.currentTab).toEqual('Pending Messages');
  });
});
