import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { getPetitionerById } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkRemovesIntervenorFromCase = cerebralTest => {
  return it('docket clerk removes intervenor from petitioners', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: cerebralTest.intervenorContactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('openRemovePetitionerModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'RemovePetitionerModal',
    );

    await cerebralTest.runSequence('openRemovePetitionerModalSequence');
    await cerebralTest.runSequence('removePetitionerAndUpdateCaptionSequence');

    expect(cerebralTest.getState('alertSuccess.message')).toBe(
      'Intervenor successfully removed.',
    );

    expect(
      getPetitionerById(
        cerebralTest.getState('caseDetail'),
        cerebralTest.intervenorContactId,
      ),
    ).toBeUndefined();
  });
};
