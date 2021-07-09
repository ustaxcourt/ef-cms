import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsPetitionerInformation = cerebralTest => {
  return it('docket clerk edits petitioner information', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'Bob',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'Bob Additional Name',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(contactPrimaryFromState(cerebralTest).additionalName).toEqual(
      'Bob Additional Name',
    );

    expect(contactPrimaryFromState(cerebralTest).name).toEqual('Bob');

    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('parties');
  });
};
