import {
  contactSecondaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCaseSecondaryContactPhone = test => {
  return it('petitioner updates secondary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.phone).toEqual('9999999999');

    const {
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
