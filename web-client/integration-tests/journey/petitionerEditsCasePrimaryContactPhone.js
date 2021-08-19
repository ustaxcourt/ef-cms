import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactPhone = cerebralTest => {
  return it('petitioner updates primary contact phone', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '9999999999',
    });

    await cerebralTest.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(contactPrimary.phone).toEqual('999-999-9999');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
