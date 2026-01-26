import { MOCK_CASE } from '@shared/test/mockCase';
import { CaseDTO } from './CaseDTO';
import { Case } from '../../entities/cases/Case';

describe('CaseDTO', () => {
  it('should handle rebuildCaseOptions', () => {
    const toRawObjectSpy = jest.spyOn(Case.prototype, 'toRawObject');
    new CaseDTO(MOCK_CASE, {
      authorizedUser: undefined,
    });
    expect(toRawObjectSpy).toHaveBeenCalled();
  });
  it('should handle archivedDocketEntries if it is undefined', () => {
    const caseDTO = new CaseDTO({
      ...MOCK_CASE,
      archivedDocketEntries: undefined,
    });
    expect(caseDTO.archivedDocketEntries).toBeUndefined();
  });
});
