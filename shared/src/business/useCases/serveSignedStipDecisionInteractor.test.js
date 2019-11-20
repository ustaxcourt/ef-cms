const {
  serveSignedStipDecisionInteractor,
} = require('./serveSignedStipDecisionInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
let updatedCase;
const { UnauthorizedError } = require('../../errors/errors');

const updateCaseStub = jest.fn();
const sendBulkTemplatedEmailStub = jest.fn();

const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User({
      name: 'bob',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  },
  getDispatchers: () => ({
    sendBulkTemplatedEmail: sendBulkTemplatedEmailStub,
  }),
  getPersistenceGateway: () => {
    return {
      getCaseByCaseId: () => ({
        ...MOCK_CASE,
        contactPrimary: {
          email: 'contactprimary@example.com',
          name: 'Test Petitioner',
          title: 'Executor',
        },
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            documentType: 'Stipulated Decision',
            processingStatus: 'pending',
            userId: 'petitioner',
            workItems: [],
          },
        ],
        practitioners: [
          {
            email: 'practitioner@example.com',
            name: 'Practitioner',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        respondents: [
          {
            email: 'respondent@example.com',
            name: 'Respondent',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      }),
      updateCase: ({ caseToUpdate }) => {
        updatedCase = caseToUpdate;
        updateCaseStub();
      },
    };
  },
  getUtilities: () => {
    return {
      createISODateString: () => '2018-06-01T00:00:00.000Z',
    };
  },
  logger: {
    info: () => null,
    time: () => null,
    timeEnd: () => null,
  },
};

describe('Serves Signed Stipulated Decision on all parties', () => {
  it('updates case status to closed', async () => {
    await serveSignedStipDecisionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(updatedCase.status).toEqual(Case.STATUS_TYPES.closed);
  });

  it('updates the document status to served', async () => {
    await serveSignedStipDecisionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updatedCase.documents[0].status).toEqual('served');
  });

  it('includes parties to be served on the document', async () => {
    await serveSignedStipDecisionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(updatedCase.documents[0].servedParties).toHaveLength(3);
  });

  it('throws an unauthorized error when a non docketclerk or petitionsclerk role attempts to serve', async () => {
    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'bob',
        role: User.ROLES.adc,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };
    let error = null;
    try {
      await serveSignedStipDecisionInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });
});
