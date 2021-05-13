import { contactPrimaryFromState } from '../helpers';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCasePrimaryContactAddress = test => {
  return it('petitioner updates primary contact address', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '100 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Grand View Apartments',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address3',
      value: 'Apt. 104',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.address1).toEqual('100 Main St.');
    expect(contactPrimary.address2).toEqual('Grand View Apartments');
    expect(contactPrimary.address3).toEqual('Apt. 104');

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
