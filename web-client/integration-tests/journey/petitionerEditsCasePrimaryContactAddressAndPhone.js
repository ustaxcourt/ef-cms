import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCasePrimaryContactAddressAndPhone = test => {
  return it('petitioner updates primary contact address and phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '101 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address3',
      value: 'Apt. 101',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1111111111',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '101 Main St.',
    );
    expect(test.getState('caseDetail.contactPrimary.address3')).toEqual(
      'Apt. 101',
    );
    expect(test.getState('caseDetail.contactPrimary.phone')).toEqual(
      '1111111111',
    );

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
