import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
  return it('Docket Clerk adds a docket entry from the given order', async () => {
    let caseDetailFormatted;
    let helperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => (doc.documentId = documentId),
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
      `${draftOrderDocument.eventCode} - ${draftOrderDocument.documentType}`,
    );

    // eventCode: O
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();

    // eventCode: OCA
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OCA',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();

    // eventCode: OAJ
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAJ',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();
    expect(helperComputed.showJudge).toBeTruthy();
    expect(test.getState('form.judge')).toBeFalsy();

    // eventCode: OAL
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAL',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeFalsy();
    expect(helperComputed.showDocketNumbers).toBeTruthy();
    expect(test.getState('form.docketNumbers')).toBeFalsy();

    // eventCode: OAP
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAP',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();
    expect(helperComputed.showDate).toBeTruthy();
    expect(test.getState('form.month')).toBeFalsy();
    expect(test.getState('form.day')).toBeFalsy();
    expect(test.getState('form.year')).toBeFalsy();

    // eventCode: OODS
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OODS',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(helperComputed.showFreeText).toBeFalsy();
    expect(helperComputed.showDate).toBeTruthy();
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

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(test.getState('form.documentType')).toEqual(
      `${draftOrderDocument.eventCode} - ${draftOrderDocument.documentType}`,
    );

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    const newDocketEntry = caseDetailFormatted.docketRecordWithDocument.find(
      entry => entry.document.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
