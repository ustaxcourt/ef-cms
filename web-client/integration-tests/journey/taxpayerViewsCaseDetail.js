import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, overrides = {}) => {
  return it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketNumberSuffix = overrides.docketNumberSuffix || 'W';

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
    expect(caseDetail.documents.length).toEqual(2);
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
