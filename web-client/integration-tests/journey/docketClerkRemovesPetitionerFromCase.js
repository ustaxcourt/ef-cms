import {
  CASE_STATUS_TYPES,
  PARTY_VIEW_TABS,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesPetitionerFromCase = test => {
  return it('docket clerk removes petitioner', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    const contactPrimaryContactId = contactPrimaryFromState(test).contactId;

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimaryContactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openRemovePetitionerModalSequence');

    expect(test.getState('modal.showModal')).toBe('RemovePetitionerModal');

    await test.runSequence('openRemovePetitionerModalSequence');
    await test.runSequence('removePetitionerAndUpdateCaptionSequence');

    expect(
      getPetitionerById(test.getState('caseDetail'), contactPrimaryContactId),
    ).toBeUndefined();

    expect(test.getState('alertSuccess.message')).toBe(
      'Petitioner successfully removed.',
    );
    expect(test.getState('currentViewMetadata.caseDetail.partyViewTab')).toBe(
      PARTY_VIEW_TABS.petitionersAndCounsel,
    );
  });
};
