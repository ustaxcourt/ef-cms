import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('setAsUnsealed', () => {
  it('should set isSealed to false and sealedDate to undefined', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    updatedCase.setAsUnsealed();

    expect(updatedCase.isSealed).toEqual(false);
    expect(updatedCase.sealedDate).toEqual(undefined);
  });
});
