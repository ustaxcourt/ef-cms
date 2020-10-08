import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCaseSecondaryContactPhone = test => {
  return it('petitioner updates secondary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    expect(test.getState('caseDetail.contactSecondary.phone')).toEqual(
      '9999999999',
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
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
