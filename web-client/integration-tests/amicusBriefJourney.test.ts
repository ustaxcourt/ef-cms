import {
  AMICUS_BRIEF_DOCUMENT_TYPE,
  AMICUS_BRIEF_EVENT_CODE,
  PARTIES_CODES,
} from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
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

  const amicusBriefMissingFormFields = {
    freeText: 'Amicus brief filed by an integration test',
    otherFilingParty: 'Marie Curie',
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create case an electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('create an Amicus Brief paper filing and save for later', async () => {
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
  });

  it('fix validation errors by providing required, missing fields', async () => {
    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual([
      'freeText',
      'otherFilingParty',
      'receivedAt',
    ]);

    for (const [key, value] of Object.entries(amicusBriefMissingFormFields)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('verify a docket entry has been created for the Amicus Brief', async () => {
    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const { docketEntries } = cerebralTest.getState('caseDetail');
    const amicusBriefDocketEntry = docketEntries.find(
      doc => doc.eventCode === AMICUS_BRIEF_EVENT_CODE,
    );

    expect(amicusBriefDocketEntry).toMatchObject({
      documentTitle: amicusBriefMissingFormFields.freeText,
      documentType: AMICUS_BRIEF_DOCUMENT_TYPE,
      eventCode: AMICUS_BRIEF_EVENT_CODE,
      filedBy: amicusBriefMissingFormFields.otherFilingParty,
      isFileAttached: true,
    });

    cerebralTest.docketEntryId = amicusBriefDocketEntry.docketEntryId;
  });

  it('edit the Amicus Brief docket entry', async () => {
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
  });

  it('save the edits and serve the Amicus Brief', async () => {
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
      documentType: AMICUS_BRIEF_DOCUMENT_TYPE,
      filedBy: 'Marie Dont Curie',
      isFileAttached: true,
      servedPartiesCode: PARTIES_CODES.BOTH,
    });
  });
});
