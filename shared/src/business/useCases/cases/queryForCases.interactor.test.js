const { queryForCases } = require('./queryForCases.interactor');
const { UnauthorizedError } = require('../../../errors/errors');

const mockUser = {
  role: 'admin',
};

const createMockCase = caseId => {
  return {
    caseId,
    caseType: 'other',
    createdAt: '2018-11-21T20:49:28.192Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    docketRecord: [],
    documents: [
      {
        caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        documentType: 'Petition',
        filedBy: 'Petitioner',
        userId: 'taxpayer',
        workItems: [],
      },
    ],
    irsNoticeDate: '2018-11-21T20:49:28.192Z',
    petitioners: [
      {
        name: 'Test Taxpayer',
        section: undefined,
        userId: 'taxpayer',
      },
    ],
    preferredTrialCity: 'Chattanooga, TN',
    procedureType: 'Small',
    filingType: 'Myself',
    status: 'New',
    userId: 'taxpayer',
    yearAmounts: [],
  };
};
const expectedCasesByDocument = [
  createMockCase('113f62ce-d7c8-446e-aeda-14a2a625a626'),
];
const expectedCasesByStatus = [
  createMockCase('213f62ce-d7c8-446e-aeda-14a2a625a626'),
];
const expectedCasesByUser = [
  createMockCase('313f62ce-d7c8-446e-aeda-14a2a625a626'),
];

const applicationContext = {
  getPersistenceGateway: () => {
    return {
      getCasesByDocumentId: () => expectedCasesByDocument,
      getCasesByStatus: () => expectedCasesByStatus,
      getCasesByUser: () => expectedCasesByUser,
    };
  },
  getCurrentUser: () => {
    return mockUser;
  },
  environment: { stage: 'local' },
};

describe('queryForCases', () => {
  describe('documentId is defined as an argument', () => {
    it('returns the expected cases from getCasesByDocumentId', async () => {
      mockUser.role = 'docketclerk';
      const results = await queryForCases({
        documentId: 'abc',
        applicationContext,
      });
      expect(results).toEqual(expectedCasesByDocument);
    });

    it('throws unauthorized when an unauthorized user is provided', async () => {
      mockUser.role = 'petitioner';
      let error;
      try {
        await queryForCases({
          documentId: 'abc',
          applicationContext,
        });
      } catch (err) {
        error = err;
      }

      expect(error instanceof UnauthorizedError).toBeTruthy();
    });
  });

  describe('status is defined as an argument', () => {
    it('returns the expected cases from getCasesByStatus', async () => {
      mockUser.role = 'docketclerk';
      const results = await queryForCases({
        status: 'new',
        applicationContext,
      });
      expect(results).toEqual(expectedCasesByStatus);
    });

    it('throws unauthorized when an unauthorized user is provided', async () => {
      mockUser.role = 'petitioner';
      let error;
      try {
        await queryForCases({
          status: 'new',
          applicationContext,
        });
      } catch (err) {
        error = err;
      }

      expect(error instanceof UnauthorizedError).toBeTruthy();
    });
  });

  describe('neither status or documentId is defined as an argument', () => {
    it('returns the expected user cases from getCasesByUser', async () => {
      mockUser.role = 'petitioner';
      const results = await queryForCases({
        applicationContext,
      });
      expect(results).toEqual(expectedCasesByUser);
    });

    it('throws unauthorized when an unauthorized user is provided', async () => {
      mockUser.role = 'petitionsclerk';
      let error;
      try {
        await queryForCases({
          applicationContext,
        });
      } catch (err) {
        error = err;
      }

      expect(error instanceof UnauthorizedError).toBeTruthy();
    });
  });
});
