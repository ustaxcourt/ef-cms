import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseAssociationAction } from './setCaseAssociationAction';

describe('setCaseAssociationAction', () => {
  it('sets state.screenMetadata.isAssociated and state.screenMetadata.pendingAssociation and state.screenMetadata.isDirectlyAssociated from props', async () => {
    const { state } = await runAction(setCaseAssociationAction, {
      props: {
        isAssociated: true,
        isDirectlyAssociated: true,
        pendingAssociation: true,
      },
      state: {
        screenMetadata: {
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: false,
        },
      },
    });

    expect(state.screenMetadata.isAssociated).toBe(true);
    expect(state.screenMetadata.pendingAssociation).toBe(true);
    expect(state.screenMetadata.isDirectlyAssociated).toBe(true);
  });
});
