import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkConvertsAnOrderToAnOpinion = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type B`, async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = caseDetailFormatted.formattedDocketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    // Type B
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'TCOP',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'T.C. Opinion',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'T.C. Opinion [judge] [anything]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type B',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      judge: VALIDATION_ERROR_MESSAGES.judge,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'judge',
      value: 'Judge Pugh',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'freeeeee text',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const updatedOrderDocument = caseDetailFormatted.formattedDocketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedOrderDocument).toMatchObject({
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      judge: 'Judge Pugh',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form')).toMatchObject({
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      generatedDocumentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      judge: 'Judge Pugh',
    });
  });
};
