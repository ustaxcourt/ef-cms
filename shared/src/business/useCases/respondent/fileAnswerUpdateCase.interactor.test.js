const { fileAnswerUpdateCase } = require('./fileAnswerUpdateCase.interactor');
const sinon = require('sinon');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('fileAnswerUpdateCaseInteractor', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;

  afterEach(() => {
    documents = MOCK_DOCUMENTS;
  });

  it('should attach the respondent information to the case when calling updateCase', async () => {
    const saveCaseStub = sinon.stub().resolves({
      docketNumber: '101-18',
      caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documents,
    });
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: saveCaseStub,
          uploadDocument: () =>
            Promise.resolve('a6b81f4d-1e47-423a-8caf-6d2fdc3d3859'),
        };
      },
      environment: { stage: 'local' },
    };
    documents = [
      ...documents,
      { documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859' },
    ];

    let response = await fileAnswerUpdateCase({
      userId: 'respondent',
      caseToUpdate: {
        documents,
        docketNumber: '101-18',
        caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      },
      applicationContext,
    });

    expect(response.respondent).to.contain({
      respondentId: 'respondent',
      name: 'Test Respondent',
      barNumber: '12345',
    });
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () =>
          Promise.resolve({
            firstName: 'bob',
            lastName: 'marley',
            barNumber: '12345',
          }),
      }),
      getPersistenceGateway: () => {
        return {
          uploadDocument: () => Promise.resolve('abc'),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    documents = [
      ...documents,
      { documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859' },
    ];
    try {
      await fileAnswerUpdateCase({
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d385X',
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).to.contain('cannot process ValidationError');
  });

  it('throws an error if new document is not passed in on case.documents', async () => {
    let error;
    try {
      await fileAnswerUpdateCase({
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext: null,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).to.contain(
      'Answer document cannot be null or invalid',
    );
  });
});
