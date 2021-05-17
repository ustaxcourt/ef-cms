import {
  contactSecondaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCaseSecondaryContactAddress = test => {
  return it('petitioner updates secondary contact address', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '100 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address2',
      value: 'Grand View Apartments',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address3',
      value: 'Apt. 104',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    expect(test.getState('validationErrors')).toEqual({});

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.address1).toEqual('100 Main St.');
    expect(contactSecondary.address2).toEqual('Grand View Apartments');
    expect(contactSecondary.address3).toEqual('Apt. 104');

    const {
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
