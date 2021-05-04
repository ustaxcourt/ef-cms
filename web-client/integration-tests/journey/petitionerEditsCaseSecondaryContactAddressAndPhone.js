import { contactSecondaryFromState } from '../helpers';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCaseSecondaryContactAddressAndPhone = test => {
  return it('petitioner updates secondary contact address and phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '101 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address3',
      value: 'Apt. 101',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1111111111',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.address1).toEqual('101 Main St.');
    expect(contactSecondary.address3).toEqual('Apt. 101');
    expect(contactSecondary.phone).toEqual('1111111111');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const noticeDocument = caseDetailFormatted.formattedDocketEntries.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address and Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
