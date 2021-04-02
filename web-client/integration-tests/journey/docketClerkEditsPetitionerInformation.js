import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsPetitionerInformation = test => {
  return it('docket clerk edits petitioner information', async () => {
    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'Bob',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('petitioner');
  });
};
