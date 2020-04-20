const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  saveIntermediateDocketEntryInteractor,
} = require('./saveIntermediateDocketEntryInteractor');
const { User } = require('../../entities/User');

describe('saveIntermediateDocketEntryInteractor', () => {
  const workItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    isQC: true,
    section: 'docket',
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    createdAt: '',
    docketNumber: '45678-18',
    docketRecord: [
      {
        description: 'first record',
        docketRecordId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filingDate: '2018-03-01T00:01:00.000Z',
        index: 1,
      },
    ],
    documents: [
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b1',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
    ],
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: User.ROLES.petitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };
  it('should throw an error if not authorized', async () => {
    await expect(
      saveIntermediateDocketEntryInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates the docket record item', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Olivia Jade',
        role: User.ROLES.docketClerk,
        section: 'docket',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);

    await expect(
      saveIntermediateDocketEntryInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Memorandum in Support',
        },
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
