import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../presenter/computeds/caseDetailHelper';

export default test => {
  return it('Petitions clerk updates case detail', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: '',
    });

    expect(test.getState('caseDetailErrors')).toEqual({
      caseType: 'Case Type is required.',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: 'Other',
    });

    expect(test.getState('caseDetailErrors')).toEqual(null);

    await test.runSequence('updateCaseValueSequence', {
      key: 'yearAmounts',
      value: [{ amount: '100' }],
    });

    expect(test.getState('caseDetailErrors')).toEqual({
      yearAmounts: [
        {
          amount: 'Please enter a valid amount.',
          index: 0,
          year: 'Please enter a valid year.',
        },
      ],
    });

    // await test.runSequence('updateCaseValueSequence', {
    //   key: 'yearAmounts',
    //   value: [{ year: '2100' }],
    // });
    //
    // expect(test.getState('caseDetailErrors')).toEqual({
    //   yearAmounts: [
    //     {
    //       amount: 'Please enter a valid amount.',
    //       index: 0,
    //       year: 'That year is in the future. Please enter a valid year.',
    //     },
    //   ],
    // });

    ////////
    // await test.runSequence('updateCaseValueSequence', {
    //   key: 'yearAmounts',
    //   value: [{ year: '2000', amount: '100' }],
    // });
    //
    // expect(test.getState('alertError')).toEqual(null);

    // await test.runSequence('updateFormValueSequence', {
    //   key: 'yearAmounts',
    //   value: [{ year: '', amount: '100' }],
    // });
    //
    // await test.runSequence('updateCaseValueSequence');
    //
    // expect(test.getState('alertError')).toEqual({
    //   title: 'Errors were found. Please correct your form and resubmit.',
    // });

    // await test.runSequence('submitUpdateCaseSequence');
    // test.setState('caseDetail', {});
    // await test.runSequence('gotoCaseDetailSequence', {
    //   docketNumber: test.docketNumber,
    // });
    // expect(test.getState('caseDetail.payGovId')).toEqual('123');
    //
    // const helper = runCompute(caseDetailHelper, {
    //   state: test.getState(),
    // });
    // expect(helper.showPaymentRecord).toEqual(true);
    //call updateCaseValueSequence

    //check for errors
    //check for success

    // test.setState('caseDetail', {});
    // await test.runSequence('gotoCaseDetailSequence', {
    //   docketNumber: test.docketNumber,
    // });
    // expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    // expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    // expect(test.getState('caseDetail.status')).toEqual('new');
    // expect(test.getState('caseDetail.documents').length).toEqual(1);
    //
    // const helper = runCompute(caseDetailHelper, {
    //   state: test.getState(),
    // });
    // expect(helper.showDocumentStatus).toEqual(true);
    // expect(helper.showIrsServedDate).toEqual(false);
    // expect(helper.showPayGovIdInput).toEqual(false);
    // expect(helper.showPaymentOptions).toEqual(true);
    // expect(helper.showActionRequired).toEqual(true);
  });
};
