import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('getPetitionerByEmail', () => {
  const mockContactEmail = 'petitioner@example.com';

  it('returns petitioner with matching email from petitioners array', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });
    expect(myCase.getPetitionerByEmail(mockContactEmail)).toBeDefined();
  });

  it('returns undefined if matching petitioner is not found', () => {
    const myCase = new Case(MOCK_CASE, { applicationContext });

    expect(myCase.getPetitionerByEmail('nobody@example.com')).toBeUndefined();
  });
});
