import { updateDocketEntryMetaInteractor } from './updateDocketEntryMetaInteractor';
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { NotFoundError } = require('../../../errors/errors');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('updateDocketEntryMetaInteractor', () => {
  let docketRecord;
  let documents;

  const mockUserId = applicationContext.getUniqueId();

  beforeEach(() => {
    documents = [
      {
        documentId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Test Petitioner',
        filingDate: '2019-01-01T00:01:00.000Z',
        freeText: 'some free text',
        servedAt: '2019-01-01T00:01:00.000Z',
        servedParties: [{ name: 'Some Party' }],
        userId: mockUserId,
      },
      {
        documentId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        documentType: 'Order',
        eventCode: 'O',
        filingDate: '2019-01-01T00:01:00.000Z',
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: [{ name: 'Some Other Party' }],
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
        userId: mockUserId,
      },
    ];

    docketRecord = [
      {
        description: 'Test Entry 0',
        docketRecordId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        documentId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        eventCode: 'P',
        filedBy: 'Test User',
        filingDate: '2019-01-01T00:01:00.000Z',
        index: 0,
      },
      {
        description: 'Test Entry 1',
        docketRecordId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        documentId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        eventCode: 'O',
        filedBy: 'Test User',
        filingDate: '2019-01-02T00:01:00.000Z',
        index: 1,
      },
      {
        description: 'Test Entry 2',
        eventCode: 'O',
        filedBy: 'Test User',
        filingDate: '2019-01-02T00:01:00.000Z',
        index: 2,
      },
    ];

    const caseByCaseId = {
      'cccba5a9-b37b-479d-9201-067ec6e33ccc': {
        ...MOCK_CASE,
        caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
        docketRecord,
        documents,
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'abcba5a9-b37b-479d-9201-067ec6e33abc',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => {
        return caseByCaseId[caseId];
      });
  });

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a Not Found error if the case does not exist', async () => {
    await expect(
      updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call the persistence method to load the case by its docket number', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
      },
      docketRecordIndex: 0,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
  });

  it('should update the docket record action', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        action: 'Updated Action',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    expect(updatedDocketEntry.action).toEqual('Updated Action');
  });

  it('should update the docket record description', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        description: 'Updated Description',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    expect(updatedDocketEntry.description).toEqual('Updated Description');
  });

  it('should update the docket record and document filedBy', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        partyPrimary: true,
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    const updatedDocument = result.documents.find(
      document => document.documentId === updatedDocketEntry.documentId,
    );
    expect(updatedDocketEntry.filedBy).toEqual('Petr. Test Petitioner');
    expect(updatedDocument.filedBy).toEqual('Petr. Test Petitioner');
  });

  it('should update the docket record filingDate', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    expect(updatedDocketEntry.filingDate).toEqual('2020-01-01T00:01:00.000Z');
  });

  it('should update the document servedAt', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    const updatedDocument = result.documents.find(
      document => document.documentId === updatedDocketEntry.documentId,
    );
    expect(updatedDocument.servedAt).toEqual('2020-01-01T00:01:00.000Z');
  });

  it('should update the document hasOtherFilingParty and otherFilingParty values', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        hasOtherFilingParty: true,
        otherFilingParty: 'Brianna Noble',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    const updatedDocument = result.documents.find(
      document => document.documentId === updatedDocketEntry.documentId,
    );
    expect(updatedDocument.hasOtherFilingParty).toBe(true);
    expect(updatedDocument.otherFilingParty).toBe('Brianna Noble');
  });

  it('should update a non-required field to undefined if undefined value is passed in', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        freeText: undefined,
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );
    const updatedDocument = result.documents.find(
      document => document.documentId === updatedDocketEntry.documentId,
    );
    expect(updatedDocument.freeText).toBeUndefined();
  });

  it('should generate a new coversheet for the document if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should NOT generate a new coversheet for the document if the servedAt and filingDate fields are NOT changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        filingDate: '2019-01-01T00:01:00.000Z', // unchanged from current filingDate
        servedAt: '2019-01-01T00:01:00.000Z', // unchanged from current servedAt
      },
      docketRecordIndex: 0,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call the updateCase persistence method', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        ...docketRecord[0],
        ...documents[0],
        description: 'Updated Description',
      },
      docketRecordIndex: 0,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should not throw an error when a null certificate of service date is passed for a docket entry without an associated document', async () => {
    await expect(
      updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
        docketEntryMeta: {
          ...docketRecord[0],
          ...documents[0],
          action: 'asdf',
          certificateOfServiceDate: null,
          description: 'Request for Place of Trial at Houston, Texas',
          eventCode: 'RQT',
          filingDate: '2020-02-03T08:06:07.539Z',
        },
        docketRecordIndex: 2,
      }),
    ).resolves.not.toThrow();
  });
});
