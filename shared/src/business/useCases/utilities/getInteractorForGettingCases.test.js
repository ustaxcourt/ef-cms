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
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'anybillybobthorntoncharacter',
          role: 'anybillybobthorntonrole',
        };
      },
    };
    let error;

    try {
      await getInteractorForGettingCases({
        documentId: '123',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('returns the correct interactor for the taxpayer', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
    };
    const result = await getInteractorForGettingCases({
      applicationContext,
    });
    expect(result).toEqual(getCasesByUser);
  });

  it('returns the correct interactor for the respondent', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: 'respondent',
          role: 'respondent',
        };
      },
    };
    const result = await getInteractorForGettingCases({
      applicationContext,
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
      const applicationContext = {
        getCurrentUser: () => {
          return {
            userId: testUserId,
            role: testUserId,
          };
        },
      };
      const result = await getInteractorForGettingCases({
        applicationContext,
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
    const applicationContext = {
      getCurrentUser: () => {
        return {
          userId: testUserId,
          role: testUserId,
        };
      },
    };
    it('returns the correct interactor for the users when documentId is set', async () => {
      const result = await getInteractorForGettingCases({
        documentId: 'abc',
        applicationContext,
      });
      expect(result).toEqual(expectedUserCase);
    });
  });
});
