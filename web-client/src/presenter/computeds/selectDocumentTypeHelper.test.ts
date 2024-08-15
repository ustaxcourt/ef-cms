import { INITIAL_DOCUMENT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import {
  MAX_TITLE_LENGTH,
  getOptionsForCategory,
  getOrdinalValuesForUploadIteration,
  getValidPreviouslyFiledDocuments,
} from './selectDocumentTypeHelper';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

describe('selectDocumentTypeHelper', () => {
  describe('getOptionsForCategory', () => {
    const mockSelectedDocketEntryId = MOCK_CASE.docketEntries.find(
      d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
    ).docketEntryId;

    it('should return an empty object if categoryInformation is undefined', () => {
      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: undefined,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({});
    });

    it('should return correct data for Standard document scenario', () => {
      const mockCategoryInformation = {
        scenario: 'Standard',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        showNonstandardForm: false,
      });
    });

    it('should return correct data for Nonstandard A document scenario', () => {
      const mockCategoryInformation = {
        labelPreviousDocument: 'Which document are you objecting to?',
        scenario: 'Nonstandard A',
      };

      const mockDocuments = MOCK_DOCUMENTS.map(d => {
        return {
          ...d,
          isOnDocketRecord: true,
          isStricken: false,
          servedAt: '2019-08-25T05:00:00.000Z',
        };
      });

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: mockDocuments,
        },
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: mockSelectedDocketEntryId,
      });

      expect(result).toMatchObject({
        previousDocumentSelectLabel: 'Which document are you objecting to?',
        previouslyFiledDocuments: mockDocuments.filter(
          d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
        ),
        showNonstandardForm: true,
      });
    });

    it('should return correct data for Nonstandard B document scenario', () => {
      const mockCategoryInformation = {
        labelFreeText: 'What is this statement for?',
        scenario: 'Nonstandard B',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'What is this statement for?',
      });
    });

    it('should return correct data for Nonstandard C document scenario', () => {
      const mockCategoryInformation = {
        labelFreeText: 'Who signed this?',
        labelPreviousDocument:
          'Which document is this affidavit in support of?',
        scenario: 'Nonstandard C',
      };

      const mockDocuments = MOCK_DOCUMENTS.map(d => {
        return {
          ...d,
          isOnDocketRecord: true,
          isStricken: false,
          servedAt: '2019-08-25T05:00:00.000Z',
        };
      });

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: mockDocuments,
        },
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: mockSelectedDocketEntryId,
      });

      expect(result).toMatchObject({
        previousDocumentSelectLabel:
          'Which document is this affidavit in support of?',
        previouslyFiledDocuments: mockDocuments.filter(
          d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
        ),
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'Who signed this?',
      });
    });

    it('should return correct data for Nonstandard D document scenario', () => {
      const mockCategoryInformation = {
        labelFreeText: 'Date of service',
        labelPreviousDocument:
          'Which document is this Certificate of Service for?',
        scenario: 'Nonstandard D',
      };

      const mockDocuments = MOCK_DOCUMENTS.map(d => {
        return {
          ...d,
          isOnDocketRecord: true,
          isStricken: false,
          servedAt: '2019-08-25T05:00:00.000Z',
        };
      });

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: mockDocuments,
        },
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: mockSelectedDocketEntryId,
      });

      expect(result).toMatchObject({
        previousDocumentSelectLabel:
          'Which document is this Certificate of Service for?',
        previouslyFiledDocuments: mockDocuments.filter(
          d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
        ),
        showDateFields: true,
        showNonstandardForm: true,
        textInputLabel: 'Date of service',
      });
    });

    it('should return correct data for Nonstandard E document scenario', () => {
      const mockCategoryInformation = {
        labelFreeText: 'Requested location',
        scenario: 'Nonstandard E',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toMatchObject({
        showNonstandardForm: true,
        showTrialLocationSelect: true,
        textInputLabel: 'Requested location',
      });
    });

    it('should return correct data for Nonstandard F document scenario', () => {
      const mockCategoryInformation = {
        labelPreviousDocument: 'Which document is this a supplement to?',
        ordinalField: 'What iteration is this filing?',
        scenario: 'Nonstandard F',
      };

      const mockDocuments = MOCK_DOCUMENTS.map(d => {
        return {
          ...d,
          isOnDocketRecord: true,
          isStricken: false,
          servedAt: '2019-08-25T05:00:00.000Z',
        };
      });

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: mockDocuments,
        },
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: mockSelectedDocketEntryId,
      });

      expect(result).toMatchObject({
        ordinalField: 'What iteration is this filing?',
        previousDocumentSelectLabel: 'Which document is this a supplement to?',
        previouslyFiledDocuments: mockDocuments.filter(
          d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
        ),
        showNonstandardForm: true,
      });
    });

    it('should return correct data for Nonstandard G document scenario', () => {
      const mockCategoryInformation = {
        ordinalField: 'What iteration is this filing?',
        scenario: 'Nonstandard G',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        ordinalField: 'What iteration is this filing?',
        showNonstandardForm: true,
      });
    });

    it('should return correct data for Nonstandard H document scenario', () => {
      const mockCategoryInformation = {
        scenario: 'Nonstandard H',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        showNonstandardForm: true,
        showSecondaryDocumentSelect: true,
      });
    });

    it('should return correct data for Nonstandard I document scenario', () => {
      // we do not currently have any Nonstandard I documents (this is mocked out at the
      // top of the file) - leaving this test here in case we add Nonstandard I docs later
      const mockCategoryInformation = {
        labelFreeText: 'What is this something for?',
        ordinalField: 'What iteration is this filing?',
        scenario: 'Nonstandard I',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        ordinalField: 'What iteration is this filing?',
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'What is this something for?',
      });
    });

    it('should return correct data for Nonstandard J document scenario', () => {
      const mockCategoryInformation = {
        labelFreeText: "Judge's Name",
        labelFreeText2: 'Decision Notes',
        scenario: 'Nonstandard J',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        showNonstandardForm: true,
        showTextInput: true,
        showTextInput2: true,
        textInputLabel: "Judge's Name",
        textInputLabel2: 'Decision Notes',
      });
    });
  });

  describe('getOrdinalValuesForUploadIteration', () => {
    it('should return a list of numbers 1-15 as strings and "Other"', () => {
      const result = getOrdinalValuesForUploadIteration();

      expect(result).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        'Other',
      ]);
    });
  });

  describe('getValidPreviouslyFiledDocuments', () => {
    it('should return a list of docketEntries with STIN filtered out', () => {
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        undefined,
      );

      expect(result.length).toEqual(1);
      expect(result[0].documentType).toEqual(
        INITIAL_DOCUMENT_TYPES.petition.documentType,
      );
    });

    it('should return a list of docketEntries with the selectedDocketEntryId filtered out', () => {
      const mockSelectedDocketEntryId = 'f9fbccfb-88cb-4bf6-a90d-174b6f4130d0';
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: 'bf2e090b-aba3-42e4-82fd-340abc8852b6',
            documentType:
              INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee
                .documentType,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            docketEntryId: mockSelectedDocketEntryId,
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        mockSelectedDocketEntryId,
      );

      expect(result.length).toEqual(1);
      expect(result[0]).toMatchObject(mockCaseDetail.docketEntries[0]);
    });

    it('should return documentTitle with additionalInfo', () => {
      const mockSelectedDocketEntryId = 'f9fbccfb-88cb-4bf6-a90d-174b6f4130d0';
      const mockExhibit = {
        addToCoversheet: true,
        additionalInfo: 'First',
        docketEntryId: '3913f8a9-891a-4c9c-827e-1a02b403fa63',
        documentTitle: 'Exhibit(s)',
        documentType: 'Exhibit(s)',
        isOnDocketRecord: true,
        isStricken: false,
        servedAt: '2019-08-25T05:00:00.000Z',
      };

      const mockCaseDetail = {
        docketEntries: [
          mockExhibit,
          {
            docketEntryId: mockSelectedDocketEntryId,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        mockSelectedDocketEntryId,
      );

      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo
          .mock.calls[0][0],
      ).toMatchObject({ docketEntry: mockExhibit });
      expect(result[0].documentTitle).toEqual('Exhibit(s) First');
    });

    it('should return documentTitle truncated to MAX_TITLE_LENGTH', () => {
      applicationContext
        .getUtilities()
        .getDocumentTitleWithAdditionalInfo.mockReturnValueOnce(
          "MOTION FOR PROTECTIVE ORDER PURSUANT TO RULE 103 REGARDING RESPONDING TO RESP'S INTERROGATORIES & REQUEST FOR PRODUCTION OF DOCUMENTS. by Petrs. Michael R. Bridges & Casie L. Bridges; Marvin R. Allen & Susan A. Allen; & Michael R. Bridges & Casie L. Bridges (EXHIBIT)",
        );
      const mockSelectedDocketEntryId = 'f9fbccfb-88cb-4bf6-a90d-174b6f4130d0';
      const mockExhibit = {
        addToCoversheet: true,
        additionalInfo: 'First',
        docketEntryId: '3913f8a9-891a-4c9c-827e-1a02b403fa63',
        documentTitle: 'Exhibit(s)',
        documentType: 'Exhibit(s)',
        isOnDocketRecord: true,
        isStricken: false,
        servedAt: '2019-08-25T05:00:00.000Z',
      };

      const mockCaseDetail = {
        docketEntries: [
          mockExhibit,
          {
            docketEntryId: mockSelectedDocketEntryId,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        mockSelectedDocketEntryId,
      );

      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo
          .mock.calls[0][0],
      ).toMatchObject({ docketEntry: mockExhibit });
      expect(result[0].documentTitle.length).toBe(MAX_TITLE_LENGTH);
      expect(result[0].documentTitle).toEqual(
        "MOTION FOR PROTECTIVE ORDER PURSUANT TO RULE 103 REGARDING RESPONDING TO RESP'S INTERROGATORIES & R…",
      );
    });

    it('should return documentTitle undefined if utility function returns undefined', () => {
      applicationContext
        .getUtilities()
        .getDocumentTitleWithAdditionalInfo.mockReturnValueOnce(undefined);
      const mockSelectedDocketEntryId = 'f9fbccfb-88cb-4bf6-a90d-174b6f4130d0';
      const mockExhibit = {
        addToCoversheet: true,
        additionalInfo: 'First',
        docketEntryId: '3913f8a9-891a-4c9c-827e-1a02b403fa63',
        documentTitle: 'Exhibit(s)',
        documentType: 'Exhibit(s)',
        isOnDocketRecord: true,
        isStricken: false,
        servedAt: '2019-08-25T05:00:00.000Z',
      };

      const mockCaseDetail = {
        docketEntries: [
          mockExhibit,
          {
            docketEntryId: mockSelectedDocketEntryId,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        mockSelectedDocketEntryId,
      );

      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
      ).toHaveBeenCalled();
      expect(
        applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo
          .mock.calls[0][0],
      ).toMatchObject({ docketEntry: mockExhibit });
      expect(result[0].documentTitle).toBeUndefined();
    });

    it('should not return unserved documents', () => {
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isOnDocketRecord: true,
            isStricken: false,
            servedAt: '',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        undefined,
      );

      expect(result.length).toEqual(0);
    });

    it('should not return stricken documents', () => {
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isOnDocketRecord: true,
            isStricken: true,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        undefined,
      );

      expect(result.length).toEqual(0);
    });

    it('should not return documents that are not on the docket record', () => {
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
            isOnDocketRecord: false,
            isStricken: false,
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
      };

      const result = getValidPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        undefined,
      );

      expect(result.length).toEqual(0);
    });
  });
});
