import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, overrides = {}) => {
  return it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const documentCount = overrides.documentCount || 2;
    const docketNumberSuffix = overrides.docketNumberSuffix || 'W';

    const caseDetail = test.getState('caseDetail');
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );
    const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual(docketNumberSuffix);
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}${docketNumberSuffix}`,
    );
    expect(caseDetail.documents.length).toEqual(documentCount);

    //verify that event codes were added to initial documents/docket entries
    expect(caseDetail.documents[0].eventCode).toEqual('P');
    expect(caseDetail.documents[1].eventCode).toEqual('STIN');
    expect(caseDetail.docketRecord[1].eventCode).toEqual('RQT');

    expect(caseDetail.preferredTrialCity).toEqual('Seattle, Washington');

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showActionRequired).toEqual(true);

    await test.runSequence('viewDocumentSequence', {
      callback: documentBlob => {
        expect(documentBlob).toBeTruthy();
      },
      documentId: test.getState('caseDetail.documents.0.documentId'),
    });
  });
};
