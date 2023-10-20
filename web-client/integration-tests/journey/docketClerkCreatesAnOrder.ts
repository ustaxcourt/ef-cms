import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkCreatesAnOrder = (cerebralTest, data) => {
  return it('Docket Clerk creates an order', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'openCreateOrderChooseTypeModalSequence',
      {},
    );

    expect(cerebralTest.getState('modal.documentTitle')).toBeFalsy();

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: data.eventCode,
    });

    if (data.expectedDocumentType) {
      expect(cerebralTest.getState('modal.documentType')).toEqual(
        data.expectedDocumentType,
      );
    } else {
      expect(
        cerebralTest.getState('modal.documentType').length,
      ).toBeGreaterThan(0);
    }

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: data.documentTitle,
    });

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('currentPage')).toBe('CreateOrder');

    expect(cerebralTest.getState('featureFlags')).toMatchObject({
      'consolidated-cases-add-docket-numbers': expect.anything(),
      'document-visibility-policy-change-date': expect.anything(),
      'e-consent-fields-enabled-feature-flag': expect.anything(),
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: 'Some order content',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentContents',
      value: data.documentContents || 'Some order content',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );

    expect(cerebralTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      newDraftOrder.docketEntryId,
    );

    expect(newDraftOrder).toBeTruthy();
    if (!cerebralTest.draftOrders) {
      cerebralTest.draftOrders = [];
    }
    cerebralTest.draftOrders.push(newDraftOrder);
    cerebralTest.docketEntryId = newDraftOrder.docketEntryId;
  });
};
