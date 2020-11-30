import {
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  INITIAL_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import {
  getOptionsForCategory,
  getPreviouslyFiledDocuments,
} from './selectDocumentTypeHelper';

describe('selectDocumentTypeHelper', () => {
  // const CATEGORY_MAP = cloneDeep(DOCUMENT_EXTERNAL_CATEGORIES_MAP); // end-around deep-freeze of constants for purposes of test

  // external filing events don't currently contain Nonstandard I, Nonstandard J -- but if they did ...
  // CATEGORY_MAP['Miscellaneous'].push({
  //   category: 'Miscellaneous',
  //   documentTitle: '[First, Second, etc.] Something to [anything]',
  //   documentType: 'Something [anything]',
  //   eventCode: 'ABCD',
  //   labelFreeText: 'What is this something for?',
  //   labelFreeText2: '',
  //   labelPreviousDocument: '',
  //   ordinalField: 'What iteration is this filing?',
  //   scenario: 'Nonstandard I',
  // });

  // CATEGORY_MAP['Decision'].push({
  //   category: 'Decision',
  //   documentTitle: 'Stipulated Decision Entered [judge] [anything]',
  //   documentType: 'Stipulated Decision',
  //   eventCode: 'SDEC',
  //   labelFreeText: "Judge's Name",
  //   labelFreeText2: 'Decision Notes',
  //   labelPreviousDocument: '',
  //   ordinalField: '',
  //   scenario: 'Nonstandard J',
  // });

  // const state = {
  //   caseDetail: MOCK_CASE,
  // };

  describe('getOptionsForCategory', () => {
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
      const mockSelectedDocketEntryId = MOCK_CASE.docketEntries.find(
        d => d.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode,
      ).docketEntryId;
      const mockCategoryInformation = {
        labelPreviousDocument: 'Which document are you objecting to?',
        scenario: 'Nonstandard A',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: mockSelectedDocketEntryId,
      });

      expect(result).toEqual({
        previousDocumentSelectLabel: 'Which document are you objecting to?',
        previouslyFiledDocuments: MOCK_CASE.docketEntries.filter(
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
        labelFreeText: 'What is this statement for?',
        scenario: 'Nonstandard B',
      };
      state.form = {
        category: 'Supporting Document',
        documentType: 'Affidavit in Support',
      };

      const result = getOptionsForCategory({
        applicationContext,
        caseDetail: MOCK_CASE,
        categoryInformation: mockCategoryInformation,
        selectedDocketEntryId: undefined,
      });

      expect(result).toEqual({
        primary: {
          previousDocumentSelectLabel:
            'Which document is this affidavit in support of?',
          previouslyFiledDocuments: MOCK_CASE.docketEntries.filter(
            d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
          ),
          showNonstandardForm: true,
          showTextInput: true,
          textInputLabel: 'Who signed this?',
        },
      });
    });

    // it('should return correct data for Nonstandard D document scenario', () => {
    //   state.form = {
    //     category: 'Miscellaneous',
    //     documentType: 'Certificate of Service',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     primary: {
    //       previousDocumentSelectLabel:
    //         'Which document is this Certificate of Service for?',
    //       previouslyFiledDocuments: MOCK_CASE.docketEntries.filter(
    //         d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
    //       ),
    //       showDateFields: true,
    //       showNonstandardForm: true,
    //       textInputLabel: 'Date of service',
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard E document scenario', () => {
    //   state.form = {
    //     category: 'Motion',
    //     documentType:
    //       'Motion to Change Place of Submission of Declaratory Judgment Case',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toMatchObject({
    //     primary: {
    //       showNonstandardForm: true,
    //       showTrialLocationSelect: true,
    //       textInputLabel: 'Requested location',
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard F document scenario', () => {
    //   state.form = {
    //     category: 'Supplement',
    //     documentType: 'Supplement',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     primary: {
    //       ordinalField: 'What iteration is this filing?',
    //       previousDocumentSelectLabel:
    //         'Which document is this a supplement to?',
    //       previouslyFiledDocuments: MOCK_CASE.docketEntries.filter(
    //         d => d.eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
    //       ),
    //       showNonstandardForm: true,
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard G document scenario', () => {
    //   state.form = {
    //     category: 'Stipulation',
    //     documentType: 'Stipulation of Facts',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     primary: {
    //       ordinalField: 'What iteration is this filing?',
    //       showNonstandardForm: true,
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard H document scenario', () => {
    //   state.form = {
    //     category: 'Motion',
    //     documentType: 'Motion for Leave to File',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     filteredSecondaryDocumentTypes: [],
    //     primary: {
    //       showNonstandardForm: true,
    //       showSecondaryDocumentSelect: true,
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard I document scenario', () => {
    //   // we do not currently have any Nonstandard I documents (this is mocked out at the
    //   // top of the file) - leaving this test here in case we add Nonstandard I docs later
    //   state.form = {
    //     category: 'Miscellaneous',
    //     documentType: 'Something [anything]',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     primary: {
    //       ordinalField: 'What iteration is this filing?',
    //       showNonstandardForm: true,
    //       showTextInput: true,
    //       textInputLabel: 'What is this something for?',
    //     },
    //   });
    // });

    // it('should return correct data for Nonstandard J document scenario', () => {
    //   state.form = {
    //     category: 'Decision',
    //     documentType: 'Stipulated Decision',
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result).toEqual({
    //     primary: {
    //       showNonstandardForm: true,
    //       showTextInput: true,
    //       showTextInput2: true,
    //       textInputLabel: "Judge's Name",
    //       textInputLabel2: 'Decision Notes',
    //     },
    //   });
    // });

    // it('should return correct data for a secondary document', () => {
    //   state.form = {
    //     category: 'Motion',
    //     documentType: 'Motion for Leave to File',
    //     secondaryDocument: {
    //       category: 'Answer (filed by respondent only)',
    //       documentType: 'Answer',
    //     },
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result.filteredSecondaryDocumentTypes.length).toBeGreaterThan(0);
    //   expect(result.secondary.showNonstandardForm).toBeFalsy();
    // });

    // it('should return correct data for a secondary document with no category or documentType selected', () => {
    //   state.form = {
    //     category: 'Motion',
    //     documentType: 'Motion for Leave to File',
    //     secondaryDocument: { something: true },
    //   };

    //   const result = getOptionsForCategory({
    //     applicationContext,
    //     caseDetail,
    //     categoryInformation,
    //     selectedDocketEntryId,
    //   });

    //   expect(result.filteredSecondaryDocumentTypes.length).toEqual(0);
    //   expect(result.secondary).toBeUndefined();
    // });
  });

  describe('getPreviouslyFiledDocuments', () => {
    it('should return a list of docketEntries with STIN filtered out', () => {
      const mockCaseDetail = {
        docketEntries: [
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          },
          {
            docketEntryId: '',
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
          },
        ],
      };

      const result = getPreviouslyFiledDocuments(
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
          },
          {
            docketEntryId: mockSelectedDocketEntryId,
            documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
          },
        ],
      };

      const result = getPreviouslyFiledDocuments(
        applicationContext,
        mockCaseDetail,
        mockSelectedDocketEntryId,
      );

      expect(result.length).toEqual(1);
      expect(result[0]).toMatchObject(mockCaseDetail.docketEntries[0]);
    });
  });
});
