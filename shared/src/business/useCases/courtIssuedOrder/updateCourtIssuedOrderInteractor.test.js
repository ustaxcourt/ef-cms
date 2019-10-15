const sinon = require('sinon');
const {
  updateCourtIssuedOrderInteractor,
} = require('./updateCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('updateCourtIssuedOrderInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    role: 'petitioner',
    userId: 'taxpayer',
  };

  it('should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: 'practitioner',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          getUserById: async () => ({ name: 'bob' }),
          updateCase: async () => caseRecord,
        }),
      };
      await updateCourtIssuedOrderInteractor({
        applicationContext,
        documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('update existing document within case', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: 'petitionsclerk',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'bob',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          updateCase: updateCaseSpy,
        }),
      };
      await updateCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(
      updateCaseSpy.getCall(0).args[0].caseToUpdate.documents.length,
    ).toEqual(3);
  });
});
