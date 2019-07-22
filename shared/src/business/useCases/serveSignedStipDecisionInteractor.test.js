const {
  serveSignedStipDecisionInteractor,
} = require('./serveSignedStipDecisionInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
let updatedCase;

const updateCaseStub = jest.fn();
const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User({
      name: 'bob',
      role: 'docketclerk',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  },
  getPersistenceGateway: () => {
    return {
      getCaseByCaseId: () => ({
        ...MOCK_CASE,
        contactPrimary: {
          email: 'contactprimary@example.com',
          name: 'Test Taxpayer',
          title: 'Executor',
        },
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            documentType: 'Signed Stipulated Decision',
            processingStatus: 'pending',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        practitioners: [
          {
            email: 'practitioner@example.com',
            name: 'Practitioner',
          },
        ],
        respondents: [
          {
            email: 'respondent@example.com',
            name: 'Respondent',
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
};

describe('Serves Signed Stipulated Decsion on all parties', () => {
  it('updates case status to closed', async () => {
    await serveSignedStipDecisionInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(updatedCase.status).toEqual('Closed');
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

  it('throws an unathorized error when a non docketclerk role attempts to serve', async () => {
    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'bob',
        role: 'petitionsclerk',
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

    expect(error).toBeDefined();
  });
});
