import { addCourtIssuedDocketEntryHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsAndServesDocketEntryFromOrder = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds and serves a docket entry from the given order ${draftOrderIndex}`, async () => {
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

    // eventCode: O
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

    // eventCode: OCA
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

    // eventCode: OAJ
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

    // eventCode: OAL
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

    // eventCode: OAP
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

    // eventCode: OODS
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
