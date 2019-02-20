import { runCompute } from 'cerebral/test';

import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';

export default test => {
  return it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');
    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailPetitioner');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual('W');
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}W`,
    );
    expect(caseDetail.documents.length).toEqual(1);
    expect(caseDetail.preferredTrialCity).toEqual('Chattanooga, TN');
    await test.runSequence('viewDocumentSequence', {
      documentId: test.getState('caseDetail.documents.0.documentId'),
      callback: documentBlob => {
        expect(documentBlob).toBeTruthy();
      },
    });
  });
};
