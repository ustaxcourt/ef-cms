const { CASE_SEARCH_MIN_YEAR } = require('../EntityConstants');
const { CaseSearch } = require('./CaseSearch');

const errorMessages = CaseSearch.VALIDATION_ERROR_MESSAGES;

describe('Case Search entity', () => {
  it('needs only a petitioner name to be valid', () => {
    const caseSearch = new CaseSearch({ petitionerName: 'Solomon Grundy' });
    expect(caseSearch).toMatchObject({
      countryType: undefined,
      petitionerName: 'Solomon Grundy',
      petitionerState: undefined,
      yearFiledMax: undefined,
      yearFiledMin: CASE_SEARCH_MIN_YEAR,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();
    expect(validationErrors).toEqual(null);
  });

  it('fails validation without a petitioner name', () => {
    const caseSearch = new CaseSearch({});
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors.petitionerName).toEqual(
      errorMessages.petitionerName,
    );
  });

  it('is valid with only yearFiledMin', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      yearFiledMin: 2000,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid with only yearFiledMax', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      yearFiledMax: 2000,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid when yearFiledMin == yearFiledMax', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      yearFiledMax: 2000,
      yearFiledMin: 2000,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid when yearFiledMin < yearFiledMax', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      yearFiledMax: 2010,
      yearFiledMin: 2000,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is invalid when yearFiledMin > yearFiledMax', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      yearFiledMax: 2000,
      yearFiledMin: 2010,
    });
    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors.yearFiledMax).toBeDefined();
  });
});
