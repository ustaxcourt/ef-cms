import { runAction } from 'cerebral/test';
import { setCaseDetailShowEditPetitionFalseAction } from './setCaseDetailShowEditPetitionFalseAction';

describe('setCaseDetailShowEditPetitionFalseAction', () => {
  it('sets state.currentViewMetadata.caseDetail.showEditPetition to false', async () => {
    const { state } = await runAction(
      setCaseDetailShowEditPetitionFalseAction,
      {
        state: {
          currentViewMetadata: {
            caseDetail: {
              showEditPetition: true,
            },
          },
        },
      },
    );

    expect(state.currentViewMetadata.caseDetail.showEditPetition).toBeFalsy();
  });
});
