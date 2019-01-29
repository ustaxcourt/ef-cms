const { updateCase } = require('./updateCase.interactor');
const { omit } = require('lodash');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

const MOCK_CASE = {
  userId: 'userId',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  docketNumber: '56789-18',
  status: 'New',
  caseType: 'Other',
  procedureType: 'Regular',
  createdAt: new Date().toISOString(),
  preferredTrialCity: 'Washington, D.C.',
  petitioners: [{ name: 'Test Taxpayer' }],
  documents: [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      userId: 'taxpayer',
    },
  ],
};

describe('updateCase', () => {
  let applicationContext;

  it('should throw an error if the persistence layer returns an invalid case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(omit(MOCK_CASE, 'documents')),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: MOCK_CASE.caseId,
        caseToUpdate: MOCK_CASE,
        userId: 'petitionsclerk',
        petitioners: [{ name: 'Test Taxpayer' }],
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull;
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });

  it('should throw an error if the caseToUpdate passed in is an invalid case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: MOCK_CASE.caseId,
        caseToUpdate: omit(MOCK_CASE, 'documents'),
        userId: 'petitionsclerk',
        petitioners: [{ name: 'Test Taxpayer' }],
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });

  it('should update a case', async () => {
    const caseToUpdate = Object.assign(MOCK_CASE);
    caseToUpdate.documents = MOCK_DOCUMENTS;
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };
    let updatedCase;

    updatedCase = await updateCase({
      caseId: caseToUpdate.caseId,
      caseToUpdate: caseToUpdate,
      userId: 'petitionsclerk',
      petitioners: [{ name: 'Test Taxpayer' }],
      applicationContext,
    });

    const returnedDocument = omit(updatedCase.documents[0], 'createdAt');
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
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };

    const updatedCase = await updateCase({
      caseId: caseToUpdate.caseId,
      caseToUpdate: caseToUpdate,
      userId: 'petitionsclerk',
      petitioners: [{ name: 'Test Taxpayer' }],
      applicationContext,
    });

    const returnedDocument = omit(updatedCase.documents[0], 'createdAt');
    const documentToMatch = omit(MOCK_DOCUMENTS[0], 'createdAt');
    expect(returnedDocument).toEqual(documentToMatch);
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: MOCK_CASE.caseId,
        caseToUpdate: MOCK_CASE,
        userId: 'someuser',
        petitioners: [{ name: 'Test Taxpayer' }],
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await updateCase({
        caseId: '123',
        caseToUpdate: MOCK_CASE,
        userId: 'someuser',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });
});
