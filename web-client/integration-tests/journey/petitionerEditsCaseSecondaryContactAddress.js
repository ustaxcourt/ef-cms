import { contactSecondaryFromState } from '../helpers';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

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

    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const noticeDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
