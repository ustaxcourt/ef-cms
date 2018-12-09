const assert = require('assert');
const { fileAnswer } = require('./fileAnswer');

describe('fileAnswer', () => {
  let applicationContext;
  let documents = [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
    },
  ];

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadDocument: () => Promise.resolve('abc'),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await fileAnswer({
        answerDocument: 'abc',
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '00101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('problem in body or url ');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadDocument: () =>
            Promise.resolve('a6b81f4d-1e47-423a-8caf-6d2fdc3d3859'),
        };
      },
      getUseCases: () => {
        return {
          updateCase: () =>
            Promise.resolve({
              docketNumber: '00101-18',
              caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            }),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await fileAnswer({
        answerDocument: 'abc',
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '00101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });
});
