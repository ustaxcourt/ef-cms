import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('addCorrespondence', () => {
  it('should successfully add correspondence', () => {
    const caseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockDocketClerkUser,
    });

    caseEntity.fileCorrespondence({
      correspondenceId: 'yeehaw',
      documentTitle: 'Correspondence document',
    });

    expect(caseEntity.correspondence.length).toEqual(1);
  });
});
