const {
  getInteractorForGettingCases,
} = require('./getInteractorForGettingCases');

const { getCasesByUser } = require('../getCasesByUser.interactor');
const {
  getCasesForRespondent,
} = require('../respondent/getCasesForRespondent.interactor');
const { getCasesByDocumentId } = require('../getCasesByDocumentId.interactor');
const { getCasesByStatus } = require('../getCasesByStatus.interactor');

describe('getInteractorForGettingCases', () => {
  it('throws an error with a bad user', async () => {
    let error;
    const user = { userId: 'baduser' };

    try {
      await getInteractorForGettingCases({
        documentId: '123',
        user,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns the correct interactor for the taxpayer', async () => {
    const user = { userId: 'taxpayer', role: 'petitioner' };
    const result = await getInteractorForGettingCases({
      user,
    });
    expect(result).toEqual(getCasesByUser);
  });

  it('returns the correct interactor for the respondent', async () => {
    const user = { userId: 'respondent', role: 'respondent' };
    const result = await getInteractorForGettingCases({
      user,
    });
    expect(result).toEqual(getCasesForRespondent);
  });

  [
    ['docketclerk', getCasesByStatus],
    ['petitionsclerk', getCasesByStatus],
    ['seniorattorney', getCasesByStatus],
    ['intakeclerk', getCasesByStatus],
  ].map(([testUserId, expectedUserCase]) => {
    it('returns the correct interactor for the docketclerk', async () => {
      const user = { userId: testUserId, role: testUserId };
      const result = await getInteractorForGettingCases({
        user,
      });
      expect(result).toEqual(expectedUserCase);
    });
  });

  [
    ['docketclerk', getCasesByDocumentId],
    ['petitionsclerk', getCasesByDocumentId],
    ['seniorattorney', getCasesByDocumentId],
    ['intakeclerk', getCasesByDocumentId],
  ].map(([testUserId, expectedUserCase]) => {
    it('returns the correct interactor for the users when documentId is set', async () => {
      const user = { userId: testUserId, role: testUserId };
      const result = await getInteractorForGettingCases({
        documentId: 'abc',
        user,
      });
      expect(result).toEqual(expectedUserCase);
    });
  });
});
