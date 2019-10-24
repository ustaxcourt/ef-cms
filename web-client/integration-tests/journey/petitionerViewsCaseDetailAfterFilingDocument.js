import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, overrides = {}) => {
  return it('petitioner views case detail after filing a document', async () => {
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

    // verify that the user was given a link to their receipt
    expect(test.getState('alertSuccess.linkUrl')).toBeDefined();

    expect(caseDetail.documents.length).toEqual(6);

    //verify that the documents were added in the correct order
    expect(caseDetail.documents[0].eventCode).toEqual('P');
    expect(caseDetail.documents[1].eventCode).toEqual('STIN');
    expect(caseDetail.docketRecord[1].eventCode).toEqual('RQT');
    expect(caseDetail.documents[2].eventCode).toEqual('M014');
    expect(caseDetail.documents[3].eventCode).toEqual('AFF');
    expect(caseDetail.documents[4].eventCode).toEqual('MISL');
    expect(caseDetail.documents[5].eventCode).toEqual('MISL');
  });
};
