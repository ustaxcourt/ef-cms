import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsPetitionerInformation = test => {
  return it('docket clerk edits petitioner information', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);

    expect(test.getState('caseDetail.status')).not.toEqual(
      CASE_STATUS_TYPES.new,
    );

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'Bob',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'Bob Additional Name',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(contactPrimaryFromState(test).additionalName).toEqual(
      'Bob Additional Name',
    );

    expect(contactPrimaryFromState(test).name).toEqual('Bob');

    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('parties');
  });
};
