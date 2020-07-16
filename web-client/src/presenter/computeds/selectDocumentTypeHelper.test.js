import { DOCUMENT_EXTERNAL_CATEGORIES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { selectDocumentTypeHelper as selectDocumentTypeHelperComputed } from './selectDocumentTypeHelper';
import { withAppContextDecorator } from '../../withAppContext';

// external filing events don't currently contain Nonstandard I, Nonstandard J -- but if they did ...
DOCUMENT_EXTERNAL_CATEGORIES_MAP['Miscellaneous'].push({
  category: 'Miscellaneous',
  documentTitle: '[First, Second, etc.] Something to [anything]',
  documentType: 'Something [anything]',
  eventCode: 'ABCD',
  labelFreeText: 'What is this something for?',
  labelFreeText2: '',
  labelPreviousDocument: '',
  ordinalField: 'What iteration is this filing?',
  scenario: 'Nonstandard I',
});

DOCUMENT_EXTERNAL_CATEGORIES_MAP['Decision'].push({
  category: 'Decision',
  documentTitle: 'Stipulated Decision Entered [judge] [anything]',
  documentType: 'Stipulated Decision',
  eventCode: 'SDEC',
  labelFreeText: "Judge's Name",
  labelFreeText2: 'Decision Notes',
  labelPreviousDocument: '',
  ordinalField: '',
  scenario: 'Nonstandard J',
});

const selectDocumentTypeHelper = withAppContextDecorator(
  selectDocumentTypeHelperComputed,
  {
    ...applicationContext,
    getConstants: () => {
      return {
        ...applicationContext.getConstants(),
        CATEGORY_MAP: DOCUMENT_EXTERNAL_CATEGORIES_MAP,
      };
    },
  },
);

const state = {
  caseDetail: MOCK_CASE,
};

describe('selectDocumentTypeHelper', () => {
  it('should return an empty object if no case detail is available', () => {
    const result = runCompute(selectDocumentTypeHelper, {
      state: {},
    });
    expect(result).toEqual({});
  });

  it('should return an empty "primary" object if a matching category is not found', () => {
    state.form = {
      category: 'Bananas',
      documentType: 'Foster',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result.primary).toEqual({});
  });

  it('should return correct data for Standard document scenario', () => {
    state.form = {
      category: 'Answer (filed by respondent only)',
      documentType: 'Answer',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        showNonstandardForm: false,
      },
    });
  });

  it('should return correct data for Nonstandard A document scenario', () => {
    state.form = {
      category: 'Notice',
      documentType: 'Notice of Objection',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        previousDocumentSelectLabel: 'Which document are you objecting to?',
        previouslyFiledDocuments: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
        ],
        showNonstandardForm: true,
      },
    });
  });

  it('should return correct data for Nonstandard B document scenario', () => {
    state.form = {
      category: 'Statement',
      documentType: 'Statement',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'What is this statement for?',
      },
    });
  });

  it('should return correct data for Nonstandard C document scenario', () => {
    state.form = {
      category: 'Supporting Document',
      documentType: 'Affidavit in Support',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        previousDocumentSelectLabel:
          'Which document is this affidavit in support of?',
        previouslyFiledDocuments: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
        ],
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'Who signed this?',
      },
    });
  });

  it('should return correct data for Nonstandard D document scenario', () => {
    state.form = {
      category: 'Miscellaneous',
      documentType: 'Certificate of Service',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        previousDocumentSelectLabel:
          'Which document is this Certificate of Service for?',
        previouslyFiledDocuments: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
        ],
        showDateFields: true,
        showNonstandardForm: true,
        textInputLabel: 'Date of service',
      },
    });
  });

  it('should return correct data for Nonstandard E document scenario', () => {
    state.form = {
      category: 'Motion',
      documentType:
        'Motion to Change Place of Submission of Declaratory Judgment Case',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toMatchObject({
      primary: {
        showNonstandardForm: true,
        showTrialLocationSelect: true,
        textInputLabel: 'Requested location',
      },
    });
  });

  it('should return correct data for Nonstandard F document scenario', () => {
    state.form = {
      category: 'Supplement',
      documentType: 'Supplement',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        ordinalField: 'What iteration is this filing?',
        previousDocumentSelectLabel: 'Which document is this a supplement to?',
        previouslyFiledDocuments: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Answer',
            documentType: 'Answer',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketNumber: '101-18',
            documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            workItems: [],
          },
        ],
        showNonstandardForm: true,
      },
    });
  });

  it('should return correct data for Nonstandard G document scenario', () => {
    state.form = {
      category: 'Stipulation',
      documentType: 'Stipulation of Facts',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        ordinalField: 'What iteration is this filing?',
        showNonstandardForm: true,
      },
    });
  });

  it('should return correct data for Nonstandard H document scenario', () => {
    state.form = {
      category: 'Motion',
      documentType: 'Motion for Leave to File',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      filteredSecondaryDocumentTypes: [],
      primary: {
        showNonstandardForm: true,
        showSecondaryDocumentSelect: true,
      },
    });
  });

  it('should return correct data for Nonstandard I document scenario', () => {
    // we do not currently have any Nonstandard I documents (this is mocked out at the
    // top of the file) - leaving this test here in case we add Nonstandard I docs later
    state.form = {
      category: 'Miscellaneous',
      documentType: 'Something [anything]',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        ordinalField: 'What iteration is this filing?',
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'What is this something for?',
      },
    });
  });

  it('should return correct data for Nonstandard J document scenario', () => {
    state.form = {
      category: 'Decision',
      documentType: 'Stipulated Decision',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        showNonstandardForm: true,
        showTextInput: true,
        showTextInput2: true,
        textInputLabel: "Judge's Name",
        textInputLabel2: 'Decision Notes',
      },
    });
  });

  it('should return correct data for a secondary document', () => {
    state.form = {
      category: 'Motion',
      documentType: 'Motion for Leave to File',
      secondaryDocument: {
        category: 'Answer (filed by respondent only)',
        documentType: 'Answer',
      },
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result.filteredSecondaryDocumentTypes.length).toBeGreaterThan(0);
    expect(result.secondary.showNonstandardForm).toBeFalsy();
  });

  it('should return correct data for a secondary document with no category or documentType selected', () => {
    state.form = {
      category: 'Motion',
      documentType: 'Motion for Leave to File',
      secondaryDocument: { something: true },
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result.filteredSecondaryDocumentTypes.length).toEqual(0);
    expect(result.secondary).toBeUndefined();
  });
});
