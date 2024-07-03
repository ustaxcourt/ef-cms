import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setCaseCaption', () => {
  it('should set the case caption and update the case title', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    updatedCase.setCaseCaption('A whole new caption');

    expect(updatedCase.caseCaption).toEqual('A whole new caption');
  });
});
