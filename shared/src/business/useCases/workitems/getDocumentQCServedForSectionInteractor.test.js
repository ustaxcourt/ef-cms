const sinon = require('sinon');
const {
  getDocumentQCServedForSection,
} = require('./getDocumentQCServedForSectionInteractor');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getDocumentQCServedForSectionInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('returns an empty array if the work item was not found in persistence', async () => {
    const getDocumentQCServedForSectionStub = sinon.stub().returns([]);
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk1',
        };
      },
      getPersistenceGateway: () => ({
        getDocumentQCServedForSection: getDocumentQCServedForSectionStub,
      }),
    };
    const result = await getDocumentQCServedForSection({
      applicationContext,
      section: 'docket',
    });
    expect(getDocumentQCServedForSectionStub.called).toBe(true);
    expect(result.length).toEqual(0);
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'unauthorizedRole',
          userId: 'unauthorizedUser',
        };
      },
      getPersistenceGateway: () => ({
        getDocumentQCServedForSection: async () => [mockWorkItem],
      }),
    };

    await expect(
      getDocumentQCServedForSection({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => ({
        getDocumentQCServedForSection: async () => [
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'taxpayer' },
            messages: [],
            section: 'docket',
            sentBy: 'docketclerk',
          },
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'taxpayer' },
            messages: [],
            section: 'irsBatchSection',
            sentBy: 'docketclerk',
          },
        ],
      }),
    };
    const result = await getDocumentQCServedForSection({
      applicationContext,
      section: 'docket',
    });
    expect(result).toMatchObject([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: { sentBy: 'taxpayer' },
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
