import { updateDocketEntryMetaInteractor } from './updateDocketEntryMetaInteractor';
const { MOCK_CASE } = require('../../../test/mockCase');
const { NotFoundError } = require('../../../errors/errors');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

let applicationContext;
let addCoversheetInteractorMock;
let getCaseCaseIdNumberMock;
let updateCaseMock;
let docketRecord;
let documents;

describe('updateDocketEntryMetaInteractor', () => {
  beforeEach(() => {
    documents = [
      {
        documentId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        documentType: 'Order',
        filingDate: '2019-01-01T00:01:00.000Z',
        servedAt: '2019-01-01T00:01:00.000Z',
        servedParties: ['Some Party'],
        userId: 'abcba5a9-b37b-479d-9201-067ec6e33abc',
      },
      {
        documentId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        documentType: 'Order',
        filingDate: '2019-01-01T00:01:00.000Z',
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: ['Some Other Party'],
        userId: 'abcba5a9-b37b-479d-9201-067ec6e33abc',
      },
    ];

    docketRecord = [
      {
        description: 'Test Entry 0',
        documentId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        eventCode: 'P',
        filedBy: 'Test User',
        filingDate: '2019-01-01T00:01:00.000Z',
        index: 0,
      },
      {
        description: 'Test Entry 1',
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

    addCoversheetInteractorMock = jest.fn();

    getCaseCaseIdNumberMock = jest.fn(({ caseId }) => {
      return caseByCaseId[caseId];
    });

    updateCaseMock = jest.fn(({ caseToUpdate }) => {
      caseByCaseId[caseToUpdate.caseId] = caseToUpdate;
    });

    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.docketClerk,
        userId: 'abcba5a9-b37b-479d-9201-067ec6e33abc',
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseCaseIdNumberMock,
        updateCase: updateCaseMock,
      }),
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorMock,
      }),
    };
  });

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner, // only User.ROLES.docketClerk has the correct permission
    });

    let error;
    try {
      await updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('should throw a Not Found error if the case does not exist', async () => {
    let error;
    try {
      await updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'xxxba5a9-b37b-479d-9201-067ec6e33xxx',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain(
      'Case xxxba5a9-b37b-479d-9201-067ec6e33xxx was not found.',
    );
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should call the persistence method to load the case by its docket number', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {},
      docketRecordIndex: 0,
    });

    expect(getCaseCaseIdNumberMock).toHaveBeenCalled();
  });

  it('should update the docket record action', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
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
        filedBy: 'New Filer',
      },
      docketRecordIndex: 0,
    });

    const updatedDocketEntry = result.docketRecord.find(
      record => record.index === 0,
    );

    const updatedDocument = result.documents.find(
      document => document.documentId === updatedDocketEntry.documentId,
    );

    expect(updatedDocketEntry.filedBy).toEqual('New Filer');
    expect(updatedDocument.filedBy).toEqual('New Filer');
  });

  it('should update the docket record filingDate', async () => {
    const result = await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
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

  it('should generate a new coversheet for the document if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    expect(addCoversheetInteractorMock).toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketRecordIndex: 0,
    });

    expect(addCoversheetInteractorMock).toHaveBeenCalled();
  });

  it('should NOT generate a new coversheet for the document if the servedAt and filingDate fields are NOT changed', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        filingDate: '2019-01-01T00:01:00.000Z', // unchanged from current filingDate
        servedAt: '2019-01-01T00:01:00.000Z', // unchanged from current servedAt
      },
      docketRecordIndex: 0,
    });

    expect(addCoversheetInteractorMock).not.toHaveBeenCalled();
  });

  it('should call the updateCase persistence method', async () => {
    await updateDocketEntryMetaInteractor({
      applicationContext,
      caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
      docketEntryMeta: {
        description: 'Updated Description',
      },
      docketRecordIndex: 0,
    });

    expect(updateCaseMock).toHaveBeenCalled();
  });

  it('should not throw an error when a null certificate of service date is passed for a docket entry without an associated document', async () => {
    let error;

    try {
      await updateDocketEntryMetaInteractor({
        applicationContext,
        caseId: 'cccba5a9-b37b-479d-9201-067ec6e33ccc',
        docketEntryMeta: {
          action: 'asdf',
          certificateOfServiceDate: null,
          description: 'Request for Place of Trial at Houston, Texas',
          eventCode: 'RQT',
          filingDate: '2020-02-03',
        },
        docketRecordIndex: 2,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
