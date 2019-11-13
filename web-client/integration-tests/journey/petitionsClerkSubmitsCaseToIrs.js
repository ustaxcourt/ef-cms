import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export default test => {
  return it('Petitions clerk submits case to IRS holding queue', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
    });

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');

    // check that save occurred
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T05:00:00.000Z',
    );
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.batchedForIRS,
    );
    expect(test.getState('alertSuccess.title')).toEqual(
      'The petition is now batched for IRS service.',
    );
    expect(test.getState('caseDetailErrors')).toEqual({});
  });
};
