import { docketClerkAddsOpiniontoDocketyEntry } from './docketClerkAddsOpinionToDocketEntry';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkCreatesAnOpinion = (cerebralTest, fakeFile) => {
  return it('Docket Clerk creates an opinion', async () => {
    // prereq. already logged in as docket clerk
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    // 1. Upload PDF (uploadCourtIssuedDocketEntrySequence)
    await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'My Awesome Opinion',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    // 2. add docket entry
    // t.c. opinion
    // select judge
    // save and serve
    // const caseDetailFormatted = runCompute(
    //   withAppContextDecorator(formattedCaseDetail),
    //   {
    //     state: cerebralTest.getState(),
    //   },
    // );

    // const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    // const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
    //   prev.createdAt > current.createdAt ? prev : current,
    // );

    // console.log('********ID', newDraftOrder);

    // expect(newDraftOrder).toBeTruthy();
    // cerebralTest.draftOrders.push(newDraftOrder);
    docketClerkAddsOpiniontoDocketyEntry(cerebralTest);
  });
};
