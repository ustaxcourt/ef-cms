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
    try {
      await getInteractorForGettingCases({
        userId: 'baduser',
        documentId: '123',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns the correct interactor for the taxpayer', async () => {
    const result = await getInteractorForGettingCases({
      userId: 'taxpayer',
    });
    expect(result).toEqual(getCasesByUser);
  });

  it('returns the correct interactor for the respondent', async () => {
    const result = await getInteractorForGettingCases({
      userId: 'respondent',
    });
    expect(result).toEqual(getCasesForRespondent);
  });

  [
    ['docketclerk', getCasesByStatus],
    ['petitionsclerk', getCasesByStatus],
    ['seniorattorney', getCasesByStatus],
    ['intakeclerk', getCasesByStatus],
  ].map(([userId, expectedUserCase]) => {
    it('returns the correct interactor for the docketclerk', async () => {
      const result = await getInteractorForGettingCases({
        userId,
      });
      expect(result).toEqual(expectedUserCase);
    });
  });

  [
    ['docketclerk', getCasesByDocumentId],
    ['petitionsclerk', getCasesByDocumentId],
    ['seniorattorney', getCasesByDocumentId],
    ['intakeclerk', getCasesByDocumentId],
  ].map(([userId, expectedUserCase]) => {
    it('returns the correct interactor for the users when documentId is set', async () => {
      const result = await getInteractorForGettingCases({
        userId,
        documentId: 'abc',
      });
      expect(result).toEqual(expectedUserCase);
    });
  });
});
