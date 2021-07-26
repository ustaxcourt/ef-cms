import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds and serves a docket entry from the given order ${draftOrderIndex}`, async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    // default
    expect(cerebralTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(cerebralTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAP',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Order for Amended Petition',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type D',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'month',
        value: '2',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'day',
        value: '2',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: '2050',
      },
    );

    const caseDetail = cerebralTest.getState('caseDetail');
    const servedDocketEntry = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );

    cerebralTest.docketRecordEntry = servedDocketEntry;

    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
  });
};
