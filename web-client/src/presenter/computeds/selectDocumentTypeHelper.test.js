import { CATEGORY_MAP } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { TRIAL_CITIES } from '../../../../shared/src/business/entities/TrialCities';
import { getTrialCityName } from './formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { selectDocumentTypeHelper } from './selectDocumentTypeHelper';
import { trialCitiesHelper } from './trialCitiesHelper';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP,
    TRIAL_CITIES,
  },
  getTrialCityName,
  trialCitiesHelper,
};

describe('selectDocumentTypeHelper', () => {
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
        previousDocumentSelectLabel: 'Which Document Are You Objecting To?',
        previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
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
        textInputLabel: 'What Is This Statement For?',
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
          'Which Document Is This Affidavit in Support Of?',
        previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: 'Who Signed This?',
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
          'Which Document Is This Certificate of Service For?',
        previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
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
        trialCities: {
          Alabama: ['Birmingham, Alabama', 'Mobile, Alabama'],
        },
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
        ordinalField: 'What Iteration Is This Filing?',
        previousDocumentSelectLabel: 'Which Document Is This a Supplement To?',
        previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
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
        ordinalField: 'What Iteration Is This Filing?',
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
});
