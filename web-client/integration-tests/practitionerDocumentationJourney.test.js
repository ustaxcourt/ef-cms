import {
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  US_STATES,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest, waitForExpectedItem } from './helpers';

describe('Practitioner documentation journey', () => {
  const cerebralTest = setupTest();

  const barNumber = 'PT1234';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Admissions Clerk uploads a practitioner document', () => {
    loginAs(cerebralTest, 'admissionsclerk@example.com');

    it('view the add practitioner document page', async () => {
      await cerebralTest.runSequence('gotoPractitionerDetailSequence', {
        barNumber,
        tab: 'practitioner-documents',
      });

      await cerebralTest.runSequence('gotoPractitionerAddDocumentSequence', {
        barNumber,
      });
    });

    it('upload practitioner document but submit before completing form', async () => {
      cerebralTest.setState('form.practitionerDocumentFile', fakeFile);

      await cerebralTest.runSequence('submitAddPractitionerDocumentSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        categoryType: expect.any(String),
      });
    });

    it('complete practitioner document upload', async () => {
      cerebralTest.setState(
        'form.categoryType',
        PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
      );
      cerebralTest.expectedDescription = `my integration test ${Math.random()}`;
      cerebralTest.setState(
        'form.description',
        cerebralTest.expectedDescription,
      );

      await cerebralTest.runSequence('submitAddPractitionerDocumentSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'The file has been added.',
      );
    });

    it('confirm document upload', async () => {
      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'PractitionerInformation',
      });

      const practitionerDocuments = cerebralTest.getState(
        'practitionerDocuments',
      );

      const expectedApplicationDocument = practitionerDocuments.find(
        document => document.description === cerebralTest.expectedDescription,
      );

      cerebralTest.practitionerDocumentFileId =
        expectedApplicationDocument.practitionerDocumentFileId;

      expect(expectedApplicationDocument).toBeDefined();
    });
  });

  describe('Admissions Clerk edits a practitioner document', () => {
    it('view the edit practitioner document page', async () => {
      await cerebralTest.runSequence('gotoPractitionerDetailSequence', {
        barNumber,
        tab: 'practitioner-documents',
      });

      await cerebralTest.runSequence('gotoPractitionerEditDocumentSequence', {
        barNumber,
        practitionerDocumentFileId: cerebralTest.practitionerDocumentFileId,
      });
    });

    it('edit practitioner document', async () => {
      cerebralTest.setState(
        'form.categoryType',
        PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
      );
      cerebralTest.setState('form.location', US_STATES.UT);
      cerebralTest.expectedDescription = `my integration test ${Math.random()}`;
      cerebralTest.setState(
        'form.description',
        cerebralTest.expectedDescription,
      );

      await cerebralTest.runSequence('submitEditPractitionerDocumentSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'The document has been updated.',
      );
    });

    it('confirm document edit', async () => {
      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'PractitionerInformation',
      });

      const practitionerDocuments = cerebralTest.getState(
        'practitionerDocuments',
      );

      const expectedApplicationDocument = practitionerDocuments.find(
        document =>
          document.practitionerDocumentFileId ===
          cerebralTest.practitionerDocumentFileId,
      );

      expect(expectedApplicationDocument).toMatchObject({
        categoryName: `${PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING} - ${US_STATES.UT}`,
        categoryType:
          PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
        description: cerebralTest.expectedDescription,
      });
    });
  });

  describe('Admissions Clerk deletes a practitioner document', () => {
    it('view the practitioner document page', async () => {
      await cerebralTest.runSequence('gotoPractitionerDetailSequence', {
        barNumber,
        tab: 'practitioner-documents',
      });
    });

    it('delete the practitioner document', async () => {
      await cerebralTest.runSequence(
        'openDeletePractitionerDocumentConfirmModalSequence',
        {
          barNumber,
          practitionerDocumentFileId: cerebralTest.practitionerDocumentFileId,
        },
      );

      await cerebralTest.runSequence('deletePractitionerDocumentSequence');

      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'The document has been deleted.',
      );
    });

    it('confirm document deletion', async () => {
      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'PractitionerInformation',
      });

      const practitionerDocuments = cerebralTest.getState(
        'practitionerDocuments',
      );

      const expectedApplicationDocument = practitionerDocuments.find(
        document =>
          document.practitionerDocumentFileId ===
          cerebralTest.practitionerDocumentFileId,
      );

      expect(expectedApplicationDocument).toBeUndefined();
    });
  });
});
