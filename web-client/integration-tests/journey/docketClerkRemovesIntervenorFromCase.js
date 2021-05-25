import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesIntervenorFromCase = test => {
  return it('docket clerk removes intervenor from petitioners', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: test.intervenorContactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openRemovePetitionerModalSequence');

    expect(test.getState('modal.showModal')).toBe('RemovePetitionerModal');

    await test.runSequence('openRemovePetitionerModalSequence');
    await test.runSequence('removePetitionerAndUpdateCaptionSequence');

    expect(test.getState('alertSuccess.message')).toBe(
      'Intervenor successfully removed.',
    );

    expect(
      getPetitionerById(test.getState('caseDetail'), test.intervenorContactId),
    ).toBeUndefined();
  });
};
