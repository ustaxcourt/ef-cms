import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactAddress = cerebralTest => {
  return it('petitioner updates primary contact address', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '100 Main St.',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: 'Grand View Apartments',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address3',
      value: 'Apt. 104',
    });

    await cerebralTest.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.address1).toEqual('100 Main St.');
    expect(contactPrimary.address2).toEqual('Grand View Apartments');
    expect(contactPrimary.address3).toEqual('Apt. 104');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
