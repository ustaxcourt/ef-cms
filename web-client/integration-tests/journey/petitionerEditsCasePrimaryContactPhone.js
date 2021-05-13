import { contactPrimaryFromState } from '../helpers';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCasePrimaryContactPhone = test => {
  return it('petitioner updates primary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    const contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.phone).toEqual('9999999999');

    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const noticeDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
