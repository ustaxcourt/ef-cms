const {
  createEndOfDayISO,
  createStartOfDayISO,
  formatNow,
  FORMATS,
} = require('../../business/utilities/DateHandler');
const {
  getReconciliationReportInteractor,
} = require('./getReconciliationReportInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');

describe('getReconciliationReportInteractor', () => {
  const mockCaseCaption = 'Kaitlin Chaney, Petitioner';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByDocketNumbers.mockReturnValue([
        {
          caseCaption: mockCaseCaption,
          docketNumber: '135-20',
        },
      ]);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsSuperuser,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });
  });

  it('should throw unauthorized error if user does not have permission', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.docketClerk,
      userId: '33577e31-d6d5-4c4a-adc6-520075f3dde5',
    });
    await expect(
      getReconciliationReportInteractor(applicationContext, {
        reconciliationDate: undefined,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if date is not formatted correctly', async () => {
    await expect(
      getReconciliationReportInteractor(applicationContext, {
        reconciliationDate: undefined,
      }),
    ).rejects.toThrow('must be formatted');
  });
  it('should throw an error if date is in the future', async () => {
    await expect(
      getReconciliationReportInteractor(applicationContext, {
        reconciliationDate: '9999-01-01',
      }),
    ).rejects.toThrow('not later than today');
  });
  it('should call the persistence method with current date if "today" is provided as a parameter', async () => {
    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue([]);

    await getReconciliationReportInteractor(applicationContext, {
      reconciliationDate: 'today',
    });

    const reconciliationDateNow = formatNow(FORMATS.YYYYMMDD);
    const [year, month, day] = reconciliationDateNow.split('-');
    const reconciliationDateStart = createStartOfDayISO({ day, month, year });
    const reconciliationDateEnd = createEndOfDayISO({ day, month, year });

    expect(
      applicationContext.getPersistenceGateway().getReconciliationReport,
    ).toHaveBeenCalledWith({
      applicationContext,
      reconciliationDateEnd,
      reconciliationDateStart,
    });
  });

  it('should return a report with zero docket entries if none are found in persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue([]);

    const reconciliationDate = '2021-01-01';
    const result = await getReconciliationReportInteractor(applicationContext, {
      reconciliationDate,
    });

    expect(result).toMatchObject({
      docketEntries: expect.any(Array),
      reconciliationDate,
      reportTitle: 'Reconciliation Report',
      totalDocketEntries: 0,
    });
    expect(result.docketEntries.length).toBe(0);
  });

  it('should return a report with docket entries if some are found in persistence', async () => {
    const docketEntries = [
      {
        docketEntryId: '3d27e02e-6954-4595-8b3f-0e91bbc1b51e',
        docketNumber: '135-20',
        documentTitle: 'Petition',
        eventCode: 'P',
        filedBy: 'Petr. Kaitlin Chaney',
        filingDate: '2021-01-05T21:14:09.031Z',
        servedAt: '2021-01-05T21:14:09.031Z',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue(docketEntries);

    const reconciliationDate = '2021-01-01';
    const result = await getReconciliationReportInteractor(applicationContext, {
      reconciliationDate,
    });

    expect(result).toMatchObject({
      docketEntries,
      reconciliationDate,
      reportTitle: 'Reconciliation Report',
      totalDocketEntries: docketEntries.length,
    });
    expect(docketEntries[0].caseCaption).toBe(mockCaseCaption);
    expect(result.docketEntries.length).toBe(docketEntries.length);
    expect(
      applicationContext.getPersistenceGateway().getReconciliationReport,
    ).toBeCalledWith({
      applicationContext,
      reconciliationDateEnd: '2021-01-02T04:59:59.999Z',
      reconciliationDateStart: '2021-01-01T05:00:00.000Z',
    });
  });
});
