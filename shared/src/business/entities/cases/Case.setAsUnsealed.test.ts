import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('setAsUnsealed', () => {
  it('should set isSealed to false and sealedDate to undefined', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    updatedCase.setAsUnsealed();

    expect(updatedCase.isSealed).toEqual(false);
    expect(updatedCase.sealedDate).toEqual(undefined);
  });
});
