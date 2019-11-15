import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, documentId) => {
  return it('Docket Clerk adds a docket entry from the given order', async () => {
    let caseDetailFormatted;
    let helperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => (doc.documentId = documentId),
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: draftOrderDocument.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    // default
    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );
    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentTitle,
    );

    // eventCode: O
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toEqual('');

    // eventCode: OCA
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OCA',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toEqual('');

    // eventCode: OAJ
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAJ',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toEqual('');
    expect(helperComputed.showJudge).toBeTruthy();
    expect(test.getState('form.judge')).toEqual('');

    // eventCode: OAL
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAL',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeFalsy();
    expect(helperComputed.showDocketNumbers).toBeTruthy();
    expect(test.getState('form.docketNumbers')).toEqual('');

    // eventCode: OAP
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAP',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toEqual('');
    expect(helperComputed.showDate).toBeTruthy();
    expect(test.getState('form.month')).toEqual('');
    expect(test.getState('form.day')).toEqual('');
    expect(test.getState('form.year')).toEqual('');

    // eventCode: OODS
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OODS',
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(helperComputed.showFreeText).toBeFalsy();
    expect(helperComputed.showDate).toBeTruthy();
    expect(test.getState('form.month')).toEqual('');
    expect(test.getState('form.day')).toEqual('');
    expect(test.getState('form.year')).toEqual('');

    // test defined
    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: draftOrderDocument.eventCode,
    });

    await test.runSequnce('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: draftOrderDocument.freeText,
    });

    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );
    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentTitle,
    );

    await test.runSequnce('submitCourtIssuedDocketEntrySequence');

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    const newDocketEntry = caseDetailFormatted.docketRecordWithDocument.find(
      entry => entry.document.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
