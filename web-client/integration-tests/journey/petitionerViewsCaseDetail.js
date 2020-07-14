import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

export const petitionerViewsCaseDetail = (test, overrides = {}) => {
  return it('petitioner views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const documentCount = overrides.documentCount || 2;
    const docketNumberSuffix =
      overrides.docketNumberSuffix || DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;

    const caseDetail = test.getState('caseDetail');
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual(docketNumberSuffix);
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}${docketNumberSuffix}`,
    );
    expect(caseDetail.documents.length).toEqual(documentCount);

    //verify that event codes were added to initial documents/docket entries
    expect(caseDetailFormatted.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventCode: 'P' }),
        expect.objectContaining({ eventCode: 'STIN' }),
      ]),
    );
    expect(
      caseDetailFormatted.docketRecordWithDocument[1].record.eventCode,
    ).toEqual('RQT');

    expect(caseDetail.preferredTrialCity).toEqual('Seattle, Washington');

    expect(caseDetail.associatedJudge).toBeUndefined();
    expect(caseDetail.blocked).toBeUndefined();
    expect(caseDetail.blockedDate).toBeUndefined();
    expect(caseDetail.blockedReason).toBeUndefined();
    expect(caseDetail.caseNote).toBeUndefined();
    expect(caseDetail.highPriority).toBeUndefined();
    expect(caseDetail.highPriorityReason).toBeUndefined();
    expect(caseDetail.qcCompleteForTrial).toBeUndefined();
    // expect(caseDetail.status).toBeUndefined();
    // expect(caseDetail.userId).toBeUndefined();
    expect(caseDetail.workItems).toBeUndefined();
  });
};
