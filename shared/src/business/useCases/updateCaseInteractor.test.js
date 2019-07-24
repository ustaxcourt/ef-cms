const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { omit } = require('lodash');
const { updateCaseInteractor } = require('./updateCaseInteractor');

const MOCK_CASE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  createdAt: new Date().toISOString(),
  docketNumber: '56789-18',
  documents: [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: 'petitioner',
      userId: 'taxpayer',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: 'petitioner',
      userId: 'taxpayer',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: 'petitioner',
      userId: 'taxpayer',
    },
  ],
  filingType: 'Myself',
  hasIrsNotice: false,
  partyType: 'Petitioner',
  petitioners: [{ name: 'Test Taxpayer' }],
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
  userId: 'userId',
};

describe('updateCase', () => {
  let applicationContext;

  it('should throw an error if the caseToUpdate passed in is an invalid case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let error;
    try {
      await updateCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseToUpdate: omit(MOCK_CASE, 'docketNumber'),
        petitioners: [{ name: 'Test Taxpayer' }],
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });

  it('should throw an error if caseToUpdate is not passed in', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let error;
    try {
      await updateCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        petitioners: [{ name: 'Test Taxpayer' }],
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('cannot process');
  });

  it('should update a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let updatedCase;

    updatedCase = await updateCaseInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: caseToUpdate,
      petitioners: [{ name: 'Test Taxpayer' }],
    });

    const returnedDocument = omit(updatedCase.documents[0], [
      'createdAt',
      'receivedAt',
    ]);
    const documentToMatch = omit(MOCK_DOCUMENTS[0], 'createdAt');
    expect(returnedDocument).toEqual(documentToMatch);
  });

  it('should update the validated documents on a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;
    caseToUpdate.documents.forEach(document => {
      document.validated = true;
      document.reviewDate = undefined;
      return document;
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };

    const updatedCase = await updateCaseInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      caseToUpdate: caseToUpdate,
      petitioners: [{ name: 'Test Taxpayer' }],
    });

    const returnedDocument = omit(updatedCase.documents[0], 'createdAt');
    const documentToMatch = omit(MOCK_DOCUMENTS[0], 'createdAt');
    expect(returnedDocument).toMatchObject(documentToMatch);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let error;
    try {
      await updateCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseToUpdate: MOCK_CASE,
        petitioners: [{ name: 'Test Taxpayer' }],
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('should throw an error if the user is unauthorized to update a case part deux', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'nope',
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let error;
    try {
      await updateCaseInteractor({
        applicationContext,
        caseId: '123',
        caseToUpdate: MOCK_CASE,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });
});
