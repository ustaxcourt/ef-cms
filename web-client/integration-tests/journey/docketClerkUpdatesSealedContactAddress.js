import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const docketClerkUpdatesSealedContactAddress = (
  cerebralTest,
  contactType,
) => {
  return it('docket clerk updates sealed contact address', async () => {
    let contact;
    if (contactType === 'contactPrimary') {
      contact = contactPrimaryFromState(cerebralTest);
    } else if (contactType === 'contactSecondary') {
      contact = contactSecondaryFromState(cerebralTest);
    }

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contact.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: 'somewhere over the rainbow',
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('parties');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const noticeOfContactChange = docketEntries.find(
      d => d.eventCode === 'NCA',
    );

    expect(noticeOfContactChange).toBeUndefined();
  });
};
