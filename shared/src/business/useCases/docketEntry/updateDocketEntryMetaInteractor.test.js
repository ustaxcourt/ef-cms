import {
  shouldGenerateCoversheetForDocketEntry,
  updateDocketEntryMetaInteractor,
} from './updateDocketEntryMetaInteractor';
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { DocketEntry } = require('../../entities/DocketEntry');
const { MOCK_CASE } = require('../../../test/mockCase');
const { NotFoundError } = require('../../../errors/errors');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('updateDocketEntryMetaInteractor', () => {
  let docketEntries;

  const mockUserId = applicationContext.getUniqueId();

  beforeEach(() => {
    docketEntries = [
      {
        docketEntryId: '000ba5a9-b37b-479d-9201-067ec6e33000',
        documentTitle: 'Test Entry 0',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Test Petitioner',
        filingDate: '2019-01-01T05:00:00.000Z',
        freeText: 'some free text',
        index: 1,
        partyPrimary: true,
        pending: false,
        servedAt: '2019-01-01T05:00:00.000Z',
        servedParties: [{ name: 'Some Party' }],
        userId: mockUserId,
      },
      {
        docketEntryId: '111ba5a9-b37b-479d-9201-067ec6e33111',
        documentTitle: 'Test Entry 1',
        documentType: 'Order',
        eventCode: 'O',
        filingDate: '2019-01-01T05:00:00.000Z',
        index: 2,
        partyPrimary: true,
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: [{ name: 'Some Other Party' }],
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
        userId: mockUserId,
      },
      {
        docketEntryId: 'd5b97867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Test Entry 2',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        filingDate: '2019-01-01T05:00:00.000Z',
        index: 3,
        isMinuteEntry: true,
        partyPrimary: true,
        servedAt: '2019-01-02T00:01:00.000Z',
        servedParties: [{ name: 'Some Other Party' }],
        userId: mockUserId,
      },
      {
        docketEntryId: 'd1197867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Some Order',
        documentType: 'Order',
        eventCode: 'O',
        filingDate: '2011-01-11T00:01:00.000Z',
        index: 4,
        isMinuteEntry: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
        userId: mockUserId,
      },
      {
        docketEntryId: 'd2297867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Unservable Document with Filing Date',
        documentType: 'U.S.C.A',
        eventCode: 'USCA',
        filingDate: '2011-02-22T00:01:00.000Z',
        index: 5,
        isMinuteEntry: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
        userId: mockUserId,
      },
      {
        docketEntryId: 'd3397867-f25d-4e26-828c-f536419c96b7',
        documentTitle: 'Hearing before [Judge] at [Place]',
        documentType: 'Hearing before',
        eventCode: 'HEAR',
        filingDate: '2011-02-22T00:01:00.000Z',
        index: 6,
        isMinuteEntry: false,
        userId: mockUserId,
      },
      {
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        eventCode: 'SOP',
        filingDate: '2011-02-22T05:00:00.000Z',
        index: 7,
        isMinuteEntry: false,
        judge: 'Buch',
        userId: mockUserId,
      },
    ];

    const caseByDocketNumber = {
      '101-20': {
        ...MOCK_CASE,
        docketEntries,
        docketNumber: '101-20',
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'abcba5a9-b37b-479d-9201-067ec6e33abc',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return caseByDocketNumber[docketNumber];
      });

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return caseByDocketNumber[docketNumber];
      });

    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(() => ({
        createdAt: '2011-02-22T00:01:00.000Z',
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        entityName: 'DocketEntry',
        eventCode: 'SOP',
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

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketNumber: '101-20',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a Not Found error if the case does not exist', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketNumber: '999-99',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call the persistence method to load the case by its docket number', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should update the docket record action', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        action: 'Updated Action',
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.action).toEqual('Updated Action');
  });

  it('should update the docket record description', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        documentTitle: 'Updated Description',
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.documentTitle).toEqual('Updated Description');
  });

  it('should update the docket record and document filedBy', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        partyPrimary: true,
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    const updatedDocument = result.docketEntries.find(
      doc => doc.docketEntryId === updatedDocketEntry.docketEntryId,
    );
    expect(updatedDocketEntry.filedBy).toEqual('Petr. Test Petitioner');
    expect(updatedDocument.filedBy).toEqual('Petr. Test Petitioner');
  });

  it('should update the docket record filingDate', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.filingDate).toEqual('2020-01-01T00:01:00.000Z');
  });

  it('should update the document servedAt', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    const updatedDocument = result.docketEntries.find(
      doc => doc.docketEntryId === updatedDocketEntry.docketEntryId,
    );
    expect(updatedDocument.servedAt).toEqual('2020-01-01T00:01:00.000Z');
  });

  it('should update the document hasOtherFilingParty and otherFilingParty values', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        hasOtherFilingParty: true,
        otherFilingParty: 'Brianna Noble',
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    const updatedDocument = result.docketEntries.find(
      doc => doc.docketEntryId === updatedDocketEntry.docketEntryId,
    );
    expect(updatedDocument.hasOtherFilingParty).toBe(true);
    expect(updatedDocument.otherFilingParty).toBe('Brianna Noble');
  });

  it('should update a non-required field to undefined if undefined value is passed in', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        freeText: undefined,
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    const updatedDocument = result.docketEntries.find(
      doc => doc.docketEntryId === updatedDocketEntry.docketEntryId,
    );
    expect(updatedDocument.freeText).toBeUndefined();
  });

  it('should generate a new coversheet for the document if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        servedAt: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should NOT generate a new coversheet for the document if the servedAt field metadata formatted as YYYY-MM-DD is equivalent to the strict ISO formatted date on the entity', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      applicationContext,
      docketEntryMeta: {
        ...docketEntries[0],
        servedAt: '2019-01-01',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed on a document that requires a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[3], // originally an Order
        documentType: 'U.S.C.A',
        eventCode: 'USCA', // changing to USCA - which DOES require a coversheet
        filingDate: '2020-02-22T02:22:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a new coversheet for the document if the filingDate field is changed on a document that requires a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[4], // was already a USCA - which DOES require a coversheet
        filingDate: '2012-02-22T02:22:00.000Z',
      },
      docketNumber: '101-20',
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
        docketEntries,
        docketNumber: '101-20',
      });

    expect(docketEntries[4].eventCode).toBe('USCA'); // requires a cover sheet.

    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[4],
        eventCode: 'MISC', // does NOT require a cover sheet
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCaseHelpers().removeCoversheet,
    ).toHaveBeenCalled();
  });

  it('should not generate a coversheet for the document if the filingDate field is changed on a document that does NOT require a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[5], // HEAR - which does NOT require a coversheet
        filingDate: '2012-02-22T02:22:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should not generate a new coversheet for a court-issued docket entry if the servedAt field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[1],
        filingDate: '2019-01-02T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to update the docketEntryEntity before adding a coversheet when the filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        filingDate: '2020-08-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '101-20',
      document: { filingDate: '2020-08-01T00:01:00.000Z' },
    });
  });

  it('should add a new coversheet when filingDate field is changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketNumber: '101-20',
      filingDateUpdated: true,
    });
  });

  it('should NOT generate a new coversheet for the document if the servedAt and filingDate fields are NOT changed', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        filingDate: '2019-01-01T05:00:00.000Z', // unchanged from current filingDate
        servedAt: '2019-01-01T05:00:00.000Z', // unchanged from current servedAt
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should not call addCoversheetInteractor if filingDate field is changed and the docket entry is a minute entry', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[2], // minute entry
        filingDate: '2020-01-01T00:01:00.000Z',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call the updateCase persistence method', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        documentTitle: 'Updated Description',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should not throw an error when a null certificate of service date is passed for a docket entry without an associated document', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: {
          ...docketEntries[0],
          action: 'asdf',
          certificateOfServiceDate: null,
          documentTitle: 'Request for Place of Trial at Houston, Texas',
          eventCode: 'RQT',
          filingDate: '2020-02-03T08:06:07.539Z',
        },
        docketNumber: '101-20',
      }),
    ).resolves.not.toThrow();
  });

  it('should update the document pending status', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        pending: true,
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    const updatedDocument = result.docketEntries.find(
      doc => doc.docketEntryId === updatedDocketEntry.docketEntryId,
    );
    expect(updatedDocument.pending).toBeTruthy();
  });

  it('should update the automatic blocked status of the case', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        pending: true,
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
  });

  it('should update the previousDocument', async () => {
    const result = await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[0],
        previousDocument: {
          ...docketEntries[1],
        },
      },
      docketNumber: '101-20',
    });

    const updatedDocketEntry = result.docketEntries.find(
      record => record.index === 1,
    );
    expect(updatedDocketEntry.previousDocument).toBeDefined();
    expect(updatedDocketEntry.previousDocument.documentType).toEqual('Order');
  });

  it('should add a coversheet when the docket entry event code changes to one requiring a coversheet', async () => {
    await updateDocketEntryMetaInteractor(applicationContext, {
      docketEntryMeta: {
        ...docketEntries[6],
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        eventCode: 'HE',
      },
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    await expect(
      updateDocketEntryMetaInteractor(applicationContext, {
        docketEntryMeta: {
          ...docketEntries[6],
          docketEntryId: 'not-a-guid',
        },
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry with id not-a-guid not found.');
  });

  describe('shouldGenerateCoversheetForDocketEntry', () => {
    let mockDocketEntry = new DocketEntry(
      {
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        eventCode: 'SOP',
        filingDate: '2011-02-22T00:01:00.000Z',
        index: 7,
        isMinuteEntry: false,
        judge: 'Buch',
        userId: mockUserId,
      },
      { applicationContext },
    );

    let entryRequiresCoverSheet = false;
    let filingDateUpdated = false;
    let originalDocketEntry = mockDocketEntry;
    let servedAtUpdated = false;
    let shouldAddNewCoverSheet = false;

    it('should return true when shouldAddNewCoverSheet and entryRequiresCoverSheet are true for a non-minute entry', async () => {
      mockDocketEntry.isMinuteEntry = false;
      shouldAddNewCoverSheet = true;
      entryRequiresCoverSheet = true;

      const result = shouldGenerateCoversheetForDocketEntry({
        entryRequiresCoverSheet,
        filingDateUpdated,
        originalDocketEntry,
        servedAtUpdated,
        shouldAddNewCoverSheet,
      });

      expect(result).toBe(true);
    });

    it('should return true when servedAtUpdated and entryRequiresCoverSheet are true for a non-minute entry', async () => {
      mockDocketEntry.isMinuteEntry = false;
      shouldAddNewCoverSheet = true;
      entryRequiresCoverSheet = true;

      const result = shouldGenerateCoversheetForDocketEntry({
        entryRequiresCoverSheet,
        filingDateUpdated,
        originalDocketEntry,
        servedAtUpdated,
        shouldAddNewCoverSheet,
      });

      expect(result).toBe(true);
    });

    it('should return true when the certificateOfService changes', async () => {
      mockDocketEntry.isMinuteEntry = false;
      shouldAddNewCoverSheet = false;
      entryRequiresCoverSheet = true;

      const result = shouldGenerateCoversheetForDocketEntry({
        certificateOfServiceUpdated: true,
        entryRequiresCoverSheet,
        filingDateUpdated,
        originalDocketEntry,
        servedAtUpdated,
        shouldAddNewCoverSheet,
      });

      expect(result).toBe(true);
    });

    it('should return true when the documentTitle changes', async () => {
      mockDocketEntry.isMinuteEntry = false;
      shouldAddNewCoverSheet = false;
      entryRequiresCoverSheet = true;

      const result = shouldGenerateCoversheetForDocketEntry({
        certificateOfServiceUpdated: false,
        documentTitleUpdated: true,
        entryRequiresCoverSheet,
        filingDateUpdated,
        originalDocketEntry,
        servedAtUpdated,
        shouldAddNewCoverSheet,
      });

      expect(result).toBe(true);
    });

    it('should return false if nothing related to the coversheet has changed on the metadata', async () => {
      mockDocketEntry.isMinuteEntry = false;
      shouldAddNewCoverSheet = false;
      entryRequiresCoverSheet = true;
      servedAtUpdated = false;
      filingDateUpdated = false;
      servedAtUpdated = false;
      shouldAddNewCoverSheet = false;

      const result = shouldGenerateCoversheetForDocketEntry({
        certificateOfServiceUpdated: false,
        documentTitleUpdated: false,
        entryRequiresCoverSheet,
        filingDateUpdated,
        originalDocketEntry,
        servedAtUpdated,
        shouldAddNewCoverSheet,
      });

      expect(result).toBe(false);
    });
  });
});
