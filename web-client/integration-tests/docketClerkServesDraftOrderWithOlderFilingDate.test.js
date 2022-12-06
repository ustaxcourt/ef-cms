import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { loginAs, setupTest, waitForCondition } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

let formattedCaseDetail = withAppContextDecorator(formattedCaseDetailComputed);

describe('Docket clerk serves a draft order which has a filing date in the past', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(40000);
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
    cerebralTest.docketNumber = '320-21';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('docket clerk adds docket entry from draft', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const draftOrderToServe = formattedCase.draftDocuments.find(
      doc => doc.documentTitle === 'Order that is a draft',
    );

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderToServe.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'serviceStamp',
        value: 'Served',
      },
    );

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetail',
    });

    formattedCaseDetail = withAppContextDecorator(formattedCaseDetailComputed);

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const caseOrderDocketEntry =
      caseDetailFormatted.formattedDocketEntries.find(
        d => d.docketEntryId === draftOrderToServe.docketEntryId,
      );

    expect(caseOrderDocketEntry).toBeDefined();
    expect(caseOrderDocketEntry.isOnDocketRecord).toEqual(true);
    expect(caseOrderDocketEntry.createdAtFormatted).toEqual(
      caseOrderDocketEntry.servedAtFormatted,
    );
  });
});
