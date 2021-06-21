import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const docketClerkUpdatesSealedContactAddress = (test, contactType) => {
  return it('docket clerk updates sealed contact address', async () => {
    let contact;
    if (contactType === 'contactPrimary') {
      contact = contactPrimaryFromState(test);
    } else if (contactType === 'contactSecondary') {
      contact = contactSecondaryFromState(test);
    }

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contact.contactId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: 'somewhere over the rainbow',
    });

    await test.runSequence('submitEditPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('parties');

    const docketEntries = test.getState('caseDetail.docketEntries');
    const noticeOfContactChange = docketEntries.find(
      d => d.eventCode === 'NCA',
    );

    expect(noticeOfContactChange).toBeUndefined();
  });
};
