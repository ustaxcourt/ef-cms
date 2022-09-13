import { applicationContext } from '../../test/createTestApplicationContext';
import { filterForPublic, isCaseVisibleToPublic } from './publicHelpers';

describe('publicHelpers', () => {
  const sealedCaseMock = { docketNumber: '188-45', sealedDate: 'some date' };
  const unsealedCaseMock = { docketNumber: '123-45' };

  describe('isCaseVisibleToPublic', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValueOnce(sealedCaseMock) // first call
        .mockResolvedValueOnce(unsealedCaseMock); // second call
    });
    it('returns false if case is sealed', async () => {
      const results = await isCaseVisibleToPublic({
        applicationContext,
        docketNumber: '123-45',
      });
      expect(results).toBeFalsy();
    });
    it('returns true if case is unsealed', async () => {
      const results = await isCaseVisibleToPublic({
        applicationContext,
        docketNumber: '123-45',
      });
      expect(results).toBeTruthy();
    });
  });

  describe('filterForPublic', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValueOnce(sealedCaseMock) // first call
        .mockResolvedValueOnce(unsealedCaseMock); // second call
    });
    it('returns a subset of cases which are allowed to be seen', async () => {
      const results = await filterForPublic({
        applicationContext,
        unfiltered: [sealedCaseMock, unsealedCaseMock],
      });

      expect(results.length).toBe(1);
      expect(results).toMatchObject([unsealedCaseMock]);
    });
  });
});
