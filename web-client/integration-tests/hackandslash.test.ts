import { fakeFile, loginAs, setupTest } from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('ADC Clerk Views Messages Journey', () => {
  const docketClerk1 = setupTest();
  const docketClerk2 = setupTest();

  const docketNumberUnderTest = '103-20';

  afterAll(() => {
    docketClerk1.closeSocket();
    docketClerk2.closeSocket();
  });

  loginAs(docketClerk1, 'docketclerk@example.com');
  loginAs(docketClerk2, 'docketclerk1@example.com');

  it('docket clerk 1 creates a draft on a case', async () => {
    docketClerk1.docketNumber = docketNumberUnderTest;

    await docketClerk1.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketClerk1.docketNumber,
    });

    await docketClerk1.runSequence('gotoUploadCourtIssuedDocumentSequence', {
      docketNumber: docketClerk1.docketNumber,
    });

    await docketClerk1.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'My Awesome Opinion',
    });

    await docketClerk1.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await docketClerk1.runSequence('validateUploadCourtIssuedDocumentSequence');

    await docketClerk1.runSequence('uploadCourtIssuedDocumentSequence');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: docketClerk1.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );
    docketClerk1.docketEntryId = newDraftOrder.docketEntryId;
    console.log(
      'docketEntryId of draft document: ',
      newDraftOrder.docketEntryId,
    );
  });

  it('docket clerk 2 serves the draft document', async () => {
    docketClerk2.docketNumber = docketNumberUnderTest;

    await docketClerk2.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketClerk2.docketNumber,
    });

    await docketClerk2.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: docketClerk1.docketEntryId,
      docketNumber: docketClerk2.docketNumber,
    });

    await docketClerk2.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'MISC',
      },
    );

    await docketClerk2.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Miscellaneous',
      },
    );

    await docketClerk2.runSequence('serveCourtIssuedDocumentSequence');

    expect(docketClerk2.getState('validationErrors')).toEqual({});
  });

  it('docket clerk 1 tries to delete an already served docket entry', async () => {
    // const caseDetailFormatted = runCompute(
    //   withAppContextDecorator(formattedCaseDetail),
    //   {
    //     state: docketClerk1.getState(),
    //   },
    // );

    await docketClerk1.runSequence('archiveDraftDocumentModalSequence', {
      docketEntryId: docketClerk1.docketEntryId,
      docketNumber: docketClerk1.docketNumber,
      // documentTitle: docketClerk1.documentTitle, // Is this param required
    });
    await docketClerk1.runSequence('archiveDraftDocumentSequence');
    expect(docketClerk1.getState('modal.showModal')).toEqual(
      'DocketEntryHasAlreadyBeenServedModal',
    );
  });
});
