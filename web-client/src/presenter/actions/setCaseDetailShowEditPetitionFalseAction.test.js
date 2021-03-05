import { runAction } from 'cerebral/test';
import { setCaseDetailShowEditPetitionFalseAction } from './setCaseDetailShowEditPetitionFalseAction';

describe('setCaseDetailShowEditPetitionFalseAction', () => {
  it('sets state.currentViewMetadata.caseDetail.showEditPetition to true', async () => {
    const { state } = await runAction(
      setCaseDetailShowEditPetitionFalseAction,
      {
        state: {},
      },
    );

    expect(state.currentViewMetadata.caseDetail.showEditPetition).toBeFalsy();
  });
});
