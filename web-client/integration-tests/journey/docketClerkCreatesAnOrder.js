import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, data) => {
  return it('Docket Clerk creates an order', async () => {
    await test.runSequence('openCreateOrderChooseTypeModalSequence', {});

    expect(test.getState('form.documentTitle')).toBeFalsy();

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: data.eventCode,
    });

    if (data.expectedDocumentType) {
      expect(test.getState('form.documentType')).toEqual(
        data.expectedDocumentType,
      );
    } else {
      expect(test.getState('form.documentType').length).toBeGreaterThan(0);
    }

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: data.documentTitle,
    });

    await test.runSequence('submitCreateOrderModalSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: 'Some order content',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments[caseDraftDocuments.length - 1];
    expect(newDraftOrder).toBeTruthy();
    test.draftOrders.push(newDraftOrder);
  });
};
