import { waitForCondition } from '../helpers';

export const docketClerkServesPaperFilingFromDocumentQC = cerebralTest => {
  return it('Docket clerk serves paper filing from document QC', async () => {
    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openConfirmPaperServiceModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const servedPaperFiling = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.docketEntryId === cerebralTest.docketEntryId);
    expect(servedPaperFiling.servedAt).toBeDefined();
  });
};
