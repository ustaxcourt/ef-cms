import { Case } from './Case';
import { Correspondence } from '../Correspondence';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('getCorrespondenceById', () => {
  it('should get a correspondence document by id', () => {
    const mockCorrespondence = new Correspondence({
      correspondenceId: '123-abc',
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
    });
    const myCase = new Case(
      { ...MOCK_CASE, correspondence: [mockCorrespondence] },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    const result = myCase.getCorrespondenceById({
      correspondenceId: mockCorrespondence.correspondenceId,
    });

    expect(result.correspondenceId).toEqual(
      mockCorrespondence.correspondenceId,
    );
  });
});
