import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../presenter/computeds/caseDetailHelper';

export default test => {
  return it('Petitions clerk updates case detail', async () => {
    expect(test.getState('caseDetailErrors')).toEqual(null);

    //yearAmounts
    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '1,000', year: '1999' }],
    });

    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual(null);

    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '1,000.95', year: '1999' }],
    });

    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual(null);

    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '000', year: '2100' }],
    });

    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual({
      yearAmounts: [
        {
          amount: 'Please enter a valid amount.',
          index: 0,
          year: 'That year is in the future. Please enter a valid year.',
        },
      ],
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '10', year: '1990' }],
    });

    await test.runSequence('validateCaseDetailSequence');

    // irsNoticeDate

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });

    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual(null);

    // payGovId and payGovDate
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovId',
      value: '123',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'payGovYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'payGovMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'payGovDay',
      value: '24',
    });
    await test.runSequence('validateCaseDetailSequence');

    expect(test.getState('caseDetailErrors')).toEqual(null);

    //error on save
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: '',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'procedureType',
      value: '',
    });

    await test.runSequence('submitUpdateCaseSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      caseType: 'Case Type is required.',
      procedureType: 'Procedure Type is required.',
    });
    expect(test.getState('alertError')).toEqual({
      alertError: {
        message: 'Case Type is required. Procedure Type is required. ',
        title: 'There is an error with this page.',
      },
    });

    //user changes value and hits save
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });
    //submit and route to case detail
    await test.runSequence('submitUpdateCaseSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.payGovId')).toEqual('123');
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T00:00:00.000Z',
    );
    expect(test.getState('caseDetail.payGovDate')).toEqual(
      '2018-12-24T00:00:00.000Z',
    );

    //
    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showPaymentRecord).toEqual(true);
  });
};
