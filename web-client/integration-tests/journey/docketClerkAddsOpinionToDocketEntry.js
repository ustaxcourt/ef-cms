import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { updateForm } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsOpiniontoDocketyEntry = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex}`, async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const docketEntryId = cerebralTest.draftOrders
      ? cerebralTest.draftOrders[draftOrderIndex].docketEntryId
      : cerebralTest.docketEntryId;

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    const updateKeyValues = {
      documentTitle: 'T.C. Opinion [judge] [Anything]',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'Some opinion content',
      scenario: 'Type B',
    };

    await updateForm(
      cerebralTest,
      updateKeyValues,
      'updateCourtIssuedDocketEntryFormValueSequence',
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
};
