import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactPhone = test => {
  return it('petitioner updates primary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.phone).toEqual('999-999-9999');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
