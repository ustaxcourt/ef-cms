import { MOCK_CASE } from '@shared/test/mockCase';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { Case } from '../../entities/cases/Case';
import { MOCK_ANSWER_2 } from '@shared/test/mockDocketEntry';

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

  it('removes served parties from archived docket entries when present', () => {
    const caseDTO = new CaseDTO({
      ...MOCK_CASE,
      archivedDocketEntries: [MOCK_ANSWER_2],
    });
    expect(caseDTO.archivedDocketEntries?.[0].servedParties).toBeUndefined();
  });
});
