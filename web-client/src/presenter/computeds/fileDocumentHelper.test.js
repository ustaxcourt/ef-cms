import { CATEGORY_MAP } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { TRIAL_CITIES } from '../../../../shared/src/business/entities/TrialCities';
import { fileDocumentHelper } from './fileDocumentHelper';
import { getTrialCityName } from './formattedTrialCity';
import { runCompute } from 'cerebral/test';
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

describe('fileDocumentHelper', () => {
  it('should return correct data for Standard document scenario', async () => {
    state.form = { category: 'Answer', documentType: 'Answer' };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel: '',
      previouslyFiledDocuments: [],
      showDateFields: false,
      showNonstandardForm: false,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: '',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard A document scenario', async () => {
    state.form = {
      category: 'Notice',
      documentType: 'Notice of Objection to [Document Name]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel: 'Which Document Are You Objecting to?',
      previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: '',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard B document scenario', async () => {
    state.form = {
      category: 'Statement',
      documentType: 'Statement [anything]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel: '',
      previouslyFiledDocuments: [],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: true,
      showTrialLocationSelect: false,
      textInputLabel: 'What is This Statement for?',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard C document scenario', async () => {
    state.form = {
      category: 'Supporting Document',
      documentType: 'Affidavit Of [Name] in Support Of [Document Name]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel:
        'What Document is this Affidavit in Support Of?',
      previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: true,
      showTrialLocationSelect: false,
      textInputLabel: 'Who Signed This?',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard D document scenario', async () => {
    state.form = {
      category: 'Miscellaneous',
      documentType: 'Certificate of Service [Document Name] [Date]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel:
        'What Document is this Certificate of Service for?',
      previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
      showDateFields: true,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: 'Date of Service',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard E document scenario', async () => {
    state.form = {
      category: 'Motion',
      documentType:
        'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toMatchObject({
      ordinalField: '',
      previousDocumentSelectLabel: '',
      previouslyFiledDocuments: [],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: true,
      textInputLabel: 'Requested Place of Submission of Declatory Judgement',
      trialCities: {
        Alabama: ['Birmingham, Alabama', 'Mobile, Alabama'],
      },
    });
  });

  it('should return correct data for Nonstandard F document scenario', async () => {
    state.form = {
      category: 'Supplement',
      documentType: '[First, Second, etc.] Supplement to [Document Name]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: 'What Iteration is This Filing?',
      previousDocumentSelectLabel: 'Which Document is This a Supplement to?',
      previouslyFiledDocuments: ['Petition', 'Answer', 'Stipulated Decision'],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: '',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard G document scenario', async () => {
    state.form = {
      category: 'Answer',
      documentType: '[First, Second, etc.] Amendment to Answer',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: 'What Iteration is This Filing?',
      previousDocumentSelectLabel: '',
      previouslyFiledDocuments: [],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: false,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: '',
      trialCities: {},
    });
  });

  it('should return correct data for Nonstandard H document scenario', async () => {
    state.form = {
      category: 'Motion',
      documentType: 'Motion for Leave to File [Document Name]',
    };
    const result = runCompute(fileDocumentHelper, {
      state,
    });
    expect(result).toEqual({
      ordinalField: '',
      previousDocumentSelectLabel: '',
      previouslyFiledDocuments: [],
      showDateFields: false,
      showNonstandardForm: true,
      showSecondaryDocumentSelect: true,
      showTextInput: false,
      showTrialLocationSelect: false,
      textInputLabel: '',
      trialCities: {},
    });
  });
});
