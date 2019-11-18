import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, data) => {
  return it('Docket Clerk creates an order', async () => {
    await test.runSequence('openCreateOrderChooseTypeModalSequence', {});

    expect(test.getState('form.documentTitle')).toEqual('');

    await test.runSequnce('updateFormValue', {
      key: 'eventCode',
      value: data.eventCode,
    });

    if (data.expectedDocumentType) {
      expect(test.getState('form.documentType')).toEqua(
        data.expectedDocumentType,
      );
    } else {
      expect(test.getState('form.documentType').length).toBeGreaterThan(0);
    }

    await test.runSequnce('updateFormValue', {
      key: 'documentTitle',
      value: data.documentTitle,
    });

    await test.runSequnce('submitCreateOrderModalSequence');

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
