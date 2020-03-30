import { runAction } from 'cerebral/test';
import { setCaseAssociationAction } from './setCaseAssociationAction';

describe('setCaseAssociationAction', () => {
  it('sets state.screenMetadata.isAssociated and state.screenMetadata.pendingAssociation from props', async () => {
    const { state } = await runAction(setCaseAssociationAction, {
      props: {
        isAssociated: true,
        pendingAssociation: true,
      },
      state: {
        screenMetadata: {
          isAssociated: false,
          pendingAssociation: false,
        },
      },
    });

    expect(state.screenMetadata.isAssociated).toBeTruthy();
    expect(state.screenMetadata.pendingAssociation).toBeTruthy();
  });
});
