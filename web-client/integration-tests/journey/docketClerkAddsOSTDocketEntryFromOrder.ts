import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { updateForm } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsOSTDocketEntryFromOrder = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex} with the OST event code`, async () => {
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
      documentTitle:
        'Order of Service of Transcript (Bench Opinion) [Anything]',
      documentType: 'Order of Service of Transcript (Bench Opinion)',
      eventCode: 'OST',
      freeText: 'Some order content',
      scenario: 'Type A',
    };

    await updateForm(
      cerebralTest,
      updateKeyValues,
      'updateCourtIssuedDocketEntryFormValueSequence',
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );
  });
};
