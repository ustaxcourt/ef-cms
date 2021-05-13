import { contactSecondaryFromState } from '../helpers';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCaseSecondaryContactPhone = test => {
  return it('petitioner updates secondary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.phone).toEqual('9999999999');

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
