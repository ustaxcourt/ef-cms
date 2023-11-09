import { CaseSearch } from './CaseSearch';

describe('Case Search entity', () => {
  it('should only require a petitioner name to be valid', () => {
    const caseSearch = new CaseSearch({ petitionerName: 'Solomon Grundy' });

    expect(caseSearch).toMatchObject({
      countryType: undefined,
      endDate: undefined,
      petitionerName: 'Solomon Grundy',
      petitionerState: undefined,
      startDate: undefined,
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should fail validation when a petitioner name is not provided', () => {
    const caseSearch = new CaseSearch({});

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.petitionerName).toEqual('Enter a name');
  });

  it('should be valid when only a start date is provided (without an end date)', () => {
    const caseSearch = new CaseSearch({
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when only an end date is provided (without a start date)', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when start date and end date are the same day', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be valid when start date is before end date', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2010',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2000',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors).toBeNull();
  });

  it('should be invalid when start date is after end date', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/2010',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.endDate).toBeDefined();
  });

  it('should be invalid when start date is after today', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: '06/01/9999',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.startDate).toBeDefined();
  });

  it('should be invalid when start date is NOT a string', () => {
    const caseSearch = new CaseSearch({
      endDate: '06/01/2000',
      petitionerName: 'Solomon Grundy',
      startDate: 'WRONG FORMAT FOR DATE',
    });

    const validationErrors = caseSearch.getFormattedValidationErrors();

    expect(validationErrors!.startDate).toBeDefined();
  });
});
