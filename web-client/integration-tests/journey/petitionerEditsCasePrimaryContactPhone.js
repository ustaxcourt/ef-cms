import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCasePrimaryContactPhone = test => {
  return it('petitioner updates primary contact phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary.phone')).toEqual(
      '9999999999',
    );

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );
    expect(
      caseDetailFormatted.docketRecordWithDocument[3].record.description,
    ).toContain('Notice of Change of Telephone Number');
  });
};
