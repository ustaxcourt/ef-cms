import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { validateCaseWorksheetInteractor } from './validateCaseWorksheetInteractor';

describe('validateCaseWorksheetInteractor', () => {
  it('should return the expected errors when the case worksheet is invalid', () => {
    const mockInvalidCaseWorksheet: RawCaseWorksheet = {
      docketNumber: undefined as any, // Docket number is required
      entityName: 'CaseWorksheet',
    };

    const errors = validateCaseWorksheetInteractor({
      caseWorksheet: mockInvalidCaseWorksheet,
    });

    expect(Object.keys(errors!)).toEqual(['docketNumber']);
  });

  it('should return null when the case worksheet is valid', () => {
    const mockValidCaseWorksheet: RawCaseWorksheet = {
      docketNumber: '111-11',
      entityName: 'CaseWorksheet',
    };

    const errors = validateCaseWorksheetInteractor({
      caseWorksheet: mockValidCaseWorksheet,
    });

    expect(errors).toBeNull();
  });
});
