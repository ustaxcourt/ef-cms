import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import {
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';
import { getContactPrimary } from '../../entities/cases/Case';
import { updateDocketEntryMetaInteractor } from './updateDocketEntryMetaInteractor';

describe('updateDocketEntryMetaInteractor', () => {
  let mockDocketEntries;

  const mockUserId = 'c99dfb85-867d-436b-8b12-1fcb547d490a';

  const baseDocketEntry = {
    docketNumber: MOCK_CASE.docketNumber,
    filedBy: 'Test Petitioner',
    filedByRole: ROLES.petitioner,
    filers: [getContactPrimary(MOCK_CASE).contactId],
    filingDate: '2011-02-22T00:01:00.000Z',
    userId: mockUserId,
  };
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;

    mockDocketEntries = [
      {
        ...baseDocketEntry,
        docketEntryId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        documentTitle: 'Test Entry 0',
        documentType: 'Petition',
        eventCode: 'P',
        freeText: 'some free text',
        index: 1,
        pending: false,
        servedAt: '2019-01-01T05:00:00.000Z',
        servedParties: [{ name: 'Some Party' }],
      },
      {
        ...baseDocketEntry,
        docketEntryId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        documentTitle: 'Test Entry 1',
        documentType: 'Order',
        eventCode: 'O',
        index: 2,
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: [{ name: 'Some Other Party' }],
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'd5b97867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Test Entry 2',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        index: 3,
        isMinuteEntry: true,
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: [{ name: 'Some Other Party' }],
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'd1197867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Some Order',
        documentType: 'Order',
        eventCode: 'O',
        index: 4,
        isMinuteEntry: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'd2297867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Unservable Document with Filing Date',
        documentType: 'U.S.C.A',
        eventCode: 'USCA',
        index: 5,
        isMinuteEntry: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'd3397867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Hearing before [Judge] at [Place]',
        documentType: 'Hearing before',
        eventCode: 'HEAR',
        index: 6,
        isMinuteEntry: false,
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        eventCode: 'SOP',
        index: 7,
        isMinuteEntry: false,
        judge: 'Buch',
      },
      {
        ...baseDocketEntry,
        docketEntryId: 'a110995d-b825-4f7e-899e-1773aa8e7017',
        documentTitle: 'Request for Place of Trial at Flavortown, AR',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        index: 8,
        isMinuteEntry: true,
        judge: 'Buch',
      },
    ];

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: mockDocketEntries,
      });

    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(() => ({
        createdAt: '2011-02-22T00:01:00.000Z',
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        docketNumber: '101-20',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        entityName: 'DocketEntry',
        eventCode: 'SOP',
        filedByRole: ROLES.judge,
        filingDate: '2011-02-22T00:01:00.000Z',
        index: 7,
        isDraft: false,
        isMinuteEntry: false,
        isOnDocketRecord: false,
        judge: 'Buch',
        processingStatus: 'complete',
        userId: mockUserId,
      }));
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: mockDocketEntries[0],
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: mockDocketEntries[0],
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: undefined,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a Not Found error if the case does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(undefined);
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: undefined,
        docketNumber: '999-99',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when the docket entry has not been served', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: {
          docketEntryId: mockDocketEntries[3].docketEntryId, // Order that has not been served
        },
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unable to update unserved docket entry.');
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: {
          ...mockDocketEntries[6],
          docketEntryId: 'not-a-guid',
        },
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Docket entry with id not-a-guid not found.');
  });

  it("should not throw an error when the docket entry has not been served and it's unservable", async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: mockDocketEntries[4], // Unservable document
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).resolves.not.toThrow();
  });

  it("should not throw an error when the docket entry has not been served and it's a minute entry", async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: mockDocketEntries[7], // Minute entry
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).resolves.not.toThrow();
  });

  it('should call the persistence method to load the case by its docket number', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: mockDocketEntries[0],
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should update editable fields including action, documentTitle, filedBy, filingDate, servedAt, hasOtherFilingParty, and otherFilingParty', async () => {
    const editedFields = {
      action: 'Updated Action',
      documentTitle: 'Updated Description',
      filedBy: 'Petr. Test Petitioner',
      filingDate: '2020-01-01T00:01:00.000Z',
      hasOtherFilingParty: true,
      otherFilingParty: 'Brianna Noble',
      servedAt: '2020-01-01T00:01:00.000Z',
    };

    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        ...editedFields,
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry).toMatchObject(editedFields);
  });

  it('should update a non-required field to undefined if undefined value is passed in', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        freeText: undefined,
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.freeText).toBeUndefined();
  });

  it('should generate a new coversheet for the document if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should NOT generate a new coversheet for the document if the servedAt field metadata formatted as YYYY-MM-DD is equivalent to the strict ISO formatted date on the entity', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        servedAt: '2019-01-01',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed on a document that requires a coversheet', async () => {
    mockDocketEntries[3].servedAt = '2012-02-22T02:22:00.000Z';
    mockDocketEntries[3].servedParties = [{ name: 'bob evans' }];
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[3], // originally an Order
        documentType: 'U.S.C.A',
        eventCode: 'USCA', // changing to USCA - which DOES require a coversheet
        filingDate: '2020-02-22T02:22:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed on a document that requires a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[4], // was already a USCA - which DOES require a coversheet
        filingDate: '2012-02-22T02:22:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should remove a coversheet for the document if the previous document version requires a coversheet but the new document type does not', async () => {
    applicationContext
      .getUseCaseHelpers()
      .removeCoversheet.mockReturnValueOnce({
        ...MOCK_CASE,
        docketEntries: mockDocketEntries,
        docketNumber: MOCK_CASE.docketNumber,
      });

    mockDocketEntries[4].servedAt = '2012-02-22T02:22:00.000Z';
    mockDocketEntries[4].servedParties = [{ name: 'bob evans' }];
    expect(mockDocketEntries[4].eventCode).toBe('USCA'); // requires a cover sheet.

    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[4],
        eventCode: 'MISC', // does NOT require a cover sheet
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().removeCoversheet,
    ).toHaveBeenCalled();
  });

  it('should not generate a coversheet for the document if the filingDate field is changed on a document that does NOT require a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[5], // HEAR - which does NOT require a coversheet
        filingDate: '2012-02-22T02:22:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should not generate a new coversheet for a court-issued docket entry if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[1],
        servedAt: '2019-01-02T00:01:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to update the docketEntryEntity before adding a coversheet when the filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        filingDate: '2020-08-01T00:01:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      document: { filingDate: '2020-08-01T00:01:00.000Z' },
    });
  });

  it('should add a new coversheet when filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      filingDateUpdated: true,
    });
  });

  it('should NOT generate a new coversheet for the document if the servedAt and filingDate fields are NOT changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        filingDate: mockDocketEntries[0].filingDate,
        servedAt: mockDocketEntries[0].servedAt,
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should not call addCoversheetInteractor if filingDate field is changed and the docket entry is a minute entry', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[2], // minute entry
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call the updateCase persistence method', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        documentTitle: 'Updated Description',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should not throw an error when a null certificate of service date is passed for a docket entry without an associated document', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: {
          ...mockDocketEntries[0],
          action: 'asdf',
          certificateOfServiceDate: null,
          documentTitle: 'Request for Place of Trial at Houston, Texas',
          eventCode: 'RQT',
          filingDate: '2020-02-03T08:06:07.539Z',
        },
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).resolves.not.toThrow();
  });

  it('should update the document pending status and the automatic blocked status of the case when setting pending to true', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        pending: true,
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.pending).toBeTruthy();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
  });

  it('should update the previousDocument', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...mockDocketEntries[0],
        previousDocument: {
          ...mockDocketEntries[1],
        },
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.previousDocument).toBeDefined();
    expect(updatedDocketEntry.previousDocument.documentType).toEqual('Order');
  });
});
