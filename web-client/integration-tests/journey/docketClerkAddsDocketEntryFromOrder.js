import { addCourtIssuedDocketEntryHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrder = (test, draftOrderIndex) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex}`, async () => {
    let caseDetailFormatted;
    let nonstandardHelperComputed;
    let addCourtIssuedDocketEntryHelperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.documentId === documentId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    // default
    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    // eventCode: O
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    addCourtIssuedDocketEntryHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryHelper),
      {
        state: test.getState(),
      },
    );

    expect(
      addCourtIssuedDocketEntryHelperComputed.showServiceStamp,
    ).toBeTruthy();
    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();
    expect(test.getState('form.serviceStamp')).toBeFalsy();

    // eventCode: OCA
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OCA',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();

    // eventCode: OAJ
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAJ',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showJudge).toBeTruthy();
    expect(test.getState('form.judge')).toBeFalsy();

    // eventCode: OAL
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAL',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDocketNumbers).toBeTruthy();
    expect(test.getState('form.docketNumbers')).toBeFalsy();

    // eventCode: OAP
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAP',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(test.getState('form.month')).toBeFalsy();
    expect(test.getState('form.day')).toBeFalsy();
    expect(test.getState('form.year')).toBeFalsy();

    // eventCode: OODS
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OODS',
    });

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(test.getState('form.month')).toBeFalsy();
    expect(test.getState('form.day')).toBeFalsy();
    expect(test.getState('form.year')).toBeFalsy();

    // test defined
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: draftOrderDocument.eventCode,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: draftOrderDocument.freeText,
    });

    if (draftOrderDocument.eventCode === 'O') {
      await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
        key: 'serviceStamp',
        value: 'Served',
      });
    }

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

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
