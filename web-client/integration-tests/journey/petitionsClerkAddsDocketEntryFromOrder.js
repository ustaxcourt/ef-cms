import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkAddsDocketEntryFromOrder = test => {
  return it('Petitions Clerk adds a docket entry from the given order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test;

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.documentId === documentId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'serviceStamp',
      value: 'Served',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Entry added to Docket Record.',
    );

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.docketRecord.find(
      entry => entry.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
