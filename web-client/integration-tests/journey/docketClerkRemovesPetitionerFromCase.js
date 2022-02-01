import {
  CASE_STATUS_TYPES,
  PARTY_VIEW_TABS,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesPetitionerFromCase = (
  cerebralTest,
  removesSecondaryPetitioner = false,
) => {
  return it('docket clerk removes petitioner', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    const contactId = removesSecondaryPetitioner
      ? contactSecondaryFromState(cerebralTest).contactId
      : contactPrimaryFromState(cerebralTest).contactId;

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('openRemovePetitionerModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'RemovePetitionerModal',
    );

    await cerebralTest.runSequence('openRemovePetitionerModalSequence');
    await cerebralTest.runSequence('removePetitionerAndUpdateCaptionSequence');

    expect(
      getPetitionerById(cerebralTest.getState('caseDetail'), contactId),
    ).toBeUndefined();

    expect(cerebralTest.getState('alertSuccess.message')).toBe(
      'Petitioner successfully removed.',
    );
    expect(
      cerebralTest.getState('currentViewMetadata.caseDetail.partyViewTab'),
    ).toBe(PARTY_VIEW_TABS.petitionersAndCounsel);
  });
};
