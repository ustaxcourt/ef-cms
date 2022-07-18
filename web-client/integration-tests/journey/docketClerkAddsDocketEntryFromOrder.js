import { addCourtIssuedDocketEntryHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrder = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex}`, async () => {
    let caseDetailFormatted;
    let nonstandardHelperComputed;
    let addCourtIssuedDocketEntryHelperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];
    cerebralTest.docketEntryId = docketEntryId;

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
        value: 'O',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    addCourtIssuedDocketEntryHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      addCourtIssuedDocketEntryHelperComputed.showServiceStamp,
    ).toBeTruthy();
    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(cerebralTest.getState('form.freeText')).toEqual('Order');
    expect(cerebralTest.getState('form.serviceStamp')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OCA',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(cerebralTest.getState('form.freeText')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAJ',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(cerebralTest.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showJudge).toBeTruthy();
    expect(cerebralTest.getState('form.judge')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAL',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDocketNumbers).toBeTruthy();
    expect(cerebralTest.getState('form.docketNumbers')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAP',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(cerebralTest.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(cerebralTest.getState('form.month')).toBeFalsy();
    expect(cerebralTest.getState('form.day')).toBeFalsy();
    expect(cerebralTest.getState('form.year')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OODS',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(cerebralTest.getState('form.month')).toBeFalsy();
    expect(cerebralTest.getState('form.day')).toBeFalsy();
    expect(cerebralTest.getState('form.year')).toBeFalsy();

    // test defined
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: draftOrderDocument.eventCode,
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: draftOrderDocument.freeText,
      },
    );

    if (draftOrderDocument.eventCode === 'O') {
      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'serviceStamp',
          value: 'Served',
        },
      );
    }

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(cerebralTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(cerebralTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry.docketEntryId === docketEntryId && entry.isOnDocketRecord,
    );

    cerebralTest.docketRecordEntry = newDocketEntry;

    expect(newDocketEntry).toBeTruthy();
    expect(newDocketEntry.index).toBeFalsy();
  });
};
