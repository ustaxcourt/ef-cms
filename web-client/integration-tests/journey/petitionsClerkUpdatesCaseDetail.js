import { Case } from '../../../shared/src/business/entities/cases/Case';
import { runCompute } from 'cerebral/test';

import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = Case;

export default test => {
  return it('Petitions clerk updates case detail', async () => {
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('updateCaseValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
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
    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    // irsNoticeDate - invalid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: 'twentyoughteight',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[1],
    });

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
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
    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );

    // irsNoticeDate - valid
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
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
    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

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
    await test.runSequence('submitCaseDetailEditSaveSequence');

    expect(test.getState('caseDetailErrors')).toEqual({});

    //error on save
    await test.runSequence('updateCaseValueSequence', {
      key: 'caseType',
      value: '',
    });
    await test.runSequence('updateCaseValueSequence', {
      key: 'procedureType',
      value: '',
    });

    await test.runSequence('submitCaseDetailEditSaveSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      caseType: VALIDATION_ERROR_MESSAGES.caseType,
      procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
    });
    expect(test.getState('alertError')).toEqual({
      messages: [
        VALIDATION_ERROR_MESSAGES.caseType,
        VALIDATION_ERROR_MESSAGES.procedureType,
      ],
      title: 'Please correct the following errors on the page:',
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
    await test.runSequence('submitCaseDetailEditSaveSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.payGovId')).toEqual('123');
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
    expect(test.getState('caseDetail.payGovDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );

    //
    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showPaymentRecord).toEqual(true);
  });
};
