import {
  fakeFile,
  loginAs,
  setupTest,
  waitForLoadingComponentToHide,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket clerk attempts to delete a draft that has already been served', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('docket clerk creates a draft on a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'My Awesome Draft',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const draft = caseDetailFormatted.draftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );
    cerebralTest.docketEntryId = draft.docketEntryId;
  });

  it('docket clerk serves the draft document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'MISC',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Miscellaneous',
      },
    );

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

    await waitForLoadingComponentToHide({ cerebralTest });
  });

  it('docket clerk tries to delete the draft that they just served', async () => {
    await cerebralTest.runSequence('archiveDraftDocumentModalSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('archiveDraftDocumentSequence');
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'DocketEntryHasAlreadyBeenServedModal',
    );
  });
});
