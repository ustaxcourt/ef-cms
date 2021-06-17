import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactAddressAndPhone = test => {
  return it('petitioner updates primary contact address and phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '101 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address3',
      value: 'Apt. 101',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '1111111111',
    });

    await test.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.address1).toEqual('101 Main St.');
    expect(contactPrimary.address3).toEqual('Apt. 101');
    expect(contactPrimary.phone).toEqual('1111111111');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address and Telephone Number for Mona Schultz',
    );

    expect(noticeDocument).toBeTruthy();
  });
};
