import { Document } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { runCompute } from 'cerebral/test';
import { selectDocumentTypeHelper } from './selectDocumentTypeHelper';

// external filing events don't currently contain Nonstandard I, Nonstandard J -- but if they did ...
Document.CATEGORY_MAP['Miscellaneous'].push({
  category: 'Miscellaneous',
  documentTitle: '[First, Second, etc.] Amendment to [anything]',
  documentType: 'Amendment [anything]',
  eventCode: 'ADMT',
  labelFreeText: 'What is This Amendment For?',
  labelFreeText2: '',
  labelPreviousDocument: '',
  ordinalField: 'What Iteration is This Filing?',
  scenario: 'Nonstandard I',
});

Document.CATEGORY_MAP['Decision'].push({
  category: 'Decision',
  documentTitle: 'Stipulated Decision Entered [judge] [anything]',
  documentType: 'Stipulated Decision Entered',
  eventCode: 'SDEC',
  labelFreeText: "Judge's Name",
  labelFreeText2: 'Decision Notes',
  labelPreviousDocument: '',
  ordinalField: '',
  scenario: 'Nonstandard J',
});

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP: Document.CATEGORY_MAP,
  },
};

describe('selectDocumentTypeHelper', () => {
  it('should return an empty object if no case detail is available', async () => {
    const result = runCompute(selectDocumentTypeHelper, {
      state: {},
    });
    expect(result).toEqual({});
  });

  it('should return an empty "primary" object if a matching category is not found', async () => {
    state.form = {
      category: 'Bananas',
      documentType: 'Foster',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result.primary).toEqual({});
  });

  it('should return correct data for Standard document scenario', async () => {
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

  it('should return correct data for Nonstandard A document scenario', async () => {
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
          'Petition',
          'Answer',
          'Proposed Stipulated Decision',
        ],
        showNonstandardForm: true,
      },
    });
  });

  it('should return correct data for Nonstandard B document scenario', async () => {
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
        textInputLabel: 'What is this Statement for?',
      },
    });
  });

  it('should return correct data for Nonstandard C document scenario', async () => {
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
          'Petition',
          'Answer',
          'Proposed Stipulated Decision',
        ],
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'Who signed this?',
      },
    });
  });

  it('should return correct data for Nonstandard D document scenario', async () => {
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
          'Petition',
          'Answer',
          'Proposed Stipulated Decision',
        ],
        showDateFields: true,
        showNonstandardForm: true,
        textInputLabel: 'Date of Service',
      },
    });
  });

  it('should return correct data for Nonstandard E document scenario', async () => {
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
        textInputLabel: 'Requested Location',
      },
    });
  });

  it('should return correct data for Nonstandard F document scenario', async () => {
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
          'Petition',
          'Answer',
          'Proposed Stipulated Decision',
        ],
        showNonstandardForm: true,
      },
    });
  });

  it('should return correct data for Nonstandard G document scenario', async () => {
    state.form = {
      category: 'Answer (filed by respondent only)',
      documentType: 'Amendment to Answer',
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

  it('should return correct data for Nonstandard H document scenario', async () => {
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

  it('should return correct data for Nonstandard I document scenario', async () => {
    state.form = {
      category: 'Miscellaneous',
      documentType: 'Amendment [anything]',
    };
    const result = runCompute(selectDocumentTypeHelper, {
      state,
    });
    expect(result).toEqual({
      primary: {
        ordinalField: 'What Iteration is This Filing?',
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'What is This Amendment For?',
      },
    });
  });

  it('should return correct data for Nonstandard J document scenario', async () => {
    state.form = {
      category: 'Decision',
      documentType: 'Stipulated Decision Entered',
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

  it('should return correct data for a secondary document', async () => {
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

  it('should return correct data for a secondary document with no category or documentType selected', async () => {
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
