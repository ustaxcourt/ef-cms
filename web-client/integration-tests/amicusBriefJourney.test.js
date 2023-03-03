import {
  AMICUS_BRIEF_EVENT_CODE,
  PARTIES_CODES,
} from '../../shared/src/business/entities/EntityConstants';
import {
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Amicus Brief Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('create an Amicus Brief docket entry', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: AMICUS_BRIEF_EVENT_CODE,
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'documentTitle',
      'freeText',
      'otherFilingParty',
    ];

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'The title of this document',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Marie Curie',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const amicusbriefDocument = cerebralTest.getState(
      'caseDetail.docketEntries.0',
    );

    expect(amicusbriefDocument).toMatchObject({
      documentTitle: 'The title of this document',
      documentType: 'Amicus Brief',
      eventCode: AMICUS_BRIEF_EVENT_CODE,
      filedBy: 'Marie Curie',
      isFileAttached: true,
    });

    cerebralTest.docketEntryId = amicusbriefDocument.docketEntryId;
  });

  it('edit and serve the Amicus Brief', async () => {
    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PaperFiling');

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'The final title of this document',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Marie Dont Curie',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const amicusbriefDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === AMICUS_BRIEF_EVENT_CODE);

    expect(amicusbriefDocument).toMatchObject({
      documentTitle: 'The final title of this document',
      documentType: 'Amicus Brief',
      filedBy: 'Marie Dont Curie',
      isFileAttached: true,
      servedPartiesCode: PARTIES_CODES.BOTH,
    });
  });
});
