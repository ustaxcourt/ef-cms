import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactAddress = test => {
  return it('petitioner updates primary contact address', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '100 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: 'Grand View Apartments',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address3',
      value: 'Apt. 104',
    });

    await test.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.address1).toEqual('100 Main St.');
    expect(contactPrimary.address2).toEqual('Grand View Apartments');
    expect(contactPrimary.address3).toEqual('Apt. 104');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
