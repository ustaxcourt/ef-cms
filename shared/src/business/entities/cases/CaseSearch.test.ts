import { CaseSearch } from './CaseSearch';

describe('Case Search entity', () => {
  it('needs only a petitioner name to be valid', () => {
    const caseSearch = new CaseSearch({ petitionerName: 'Solomon Grundy' });
    expect(caseSearch).toMatchObject({
      countryType: undefined,
      endDate: undefined,
      petitionerName: 'Solomon Grundy',
      petitionerState: undefined,
      startDate: undefined,
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('fails validation without a petitioner name', () => {
    const caseSearch = new CaseSearch({});

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.petitionerName).toEqual(
      CaseSearch.VALIDATION_ERROR_MESSAGES.petitionerName,
    );
  });

  it('is valid with only startDate', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid with only endDate', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid when startDate == endDate', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is valid when startDate < endDate', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2010',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toEqual(null);
  });

  it('is invalid when startDate > endDate', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2010',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.endDate).toBeDefined();
  });

  it('is invalid when startDate is more than now', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/9999',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.startDate).toBeDefined();
  });

  it('is invalid when startDate is not a string', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: 'WRONG FORMAT FOR DATE',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.startDate).toBeDefined();
  });
});
