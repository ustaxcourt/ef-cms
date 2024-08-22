import {
  FORMATS,
  createEndOfDayISO,
  createStartOfDayISO,
  formatNow,
} from '../utilities/DateHandler';
import { applicationContext } from '../test/createTestApplicationContext';
import { getReconciliationReportInteractor } from './getReconciliationReportInteractor';
import {
  mockDocketClerkUser,
  mockIrsSuperuser,
} from '@shared/test/mockAuthUsers';

describe('getReconciliationReportInteractor', () => {
  const mockCaseCaption = 'Kaitlin Chaney, Petitioner';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByDocketNumbers.mockReturnValue([
        {
          caseCaption: mockCaseCaption,
          docketNumber: '135-20',
          pk: 'case|135-20',
          sk: 'case|135-20',
        },
      ]);
  });

  it('should throw unauthorized error if user does not have permission', async () => {
    await expect(
      getReconciliationReportInteractor(
        applicationContext,
        {
          reconciliationDate: undefined,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if date is not formatted correctly', async () => {
    await expect(
      getReconciliationReportInteractor(
        applicationContext,
        {
          reconciliationDate: undefined,
        },
        mockIrsSuperuser,
      ),
    ).rejects.toThrow('Must be valid reconciliation date');
  });

  it('should throw an error if date is in the future', async () => {
    await expect(
      getReconciliationReportInteractor(
        applicationContext,
        {
          reconciliationDate: '9999-01-01',
        },
        mockIrsSuperuser,
      ),
    ).rejects.toThrow('not later than today');
  });

  it('should call the persistence method with current date if "today" is provided as a parameter', async () => {
    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue([]);

    await getReconciliationReportInteractor(
      applicationContext,
      {
        reconciliationDate: 'today',
      },
      mockIrsSuperuser,
    );

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
    const result = await getReconciliationReportInteractor(
      applicationContext,
      {
        reconciliationDate,
      },
      mockIrsSuperuser,
    );

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
    ] as any;

    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue(docketEntries);

    const reconciliationDate = '2021-01-01';
    const result = await getReconciliationReportInteractor(
      applicationContext,
      {
        reconciliationDate,
      },
      mockIrsSuperuser,
    );

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
    ).toHaveBeenCalledWith({
      applicationContext,
      reconciliationDateEnd: '2021-01-02T04:59:59.999Z',
      reconciliationDateStart: '2021-01-01T05:00:00.000Z',
    });
  });

  it('should call the getCasesByDocketNumbers method with a docket number extracted from pk if the record has no defined value for the docketNumber attribute', async () => {
    const docketEntries = [
      {
        docketEntryId: '3d27e02e-6954-4595-8b3f-0e91bbc1b51e',
        docketNumber: undefined,
        documentTitle: 'Petition',
        eventCode: 'P',
        filedBy: 'Petr. Kaitlin Chaney',
        filingDate: '2021-01-05T21:14:09.031Z',
        pk: 'case|135-20',
        servedAt: '2021-01-05T21:14:09.031Z',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue(docketEntries);

    const reconciliationDate = '2021-01-01';
    await getReconciliationReportInteractor(
      applicationContext,
      {
        reconciliationDate,
      },
      mockIrsSuperuser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesByDocketNumbers.mock
        .calls[0][0].docketNumbers,
    ).toEqual(['135-20']);
  });

  //Given date may contain ISO time component
  it('should accept ISO dates + start time', async () => {
    const startDate = '2020-01-01';
    const timeStart = '05:00';
    await expect(
      getReconciliationReportInteractor(
        applicationContext,
        {
          reconciliationDate: startDate,
          start: timeStart,
        },
        mockIrsSuperuser,
      ),
    ).resolves.not.toThrow();
  });

  //Caller may provide two date arguments
  it('should accept starting date and start+end times', async () => {
    const startDate = '2021-01-05';
    const timeStart = '05:00';
    const timeEnd = '09:00';
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
    ] as any;

    applicationContext
      .getPersistenceGateway()
      .getReconciliationReport.mockReturnValue(docketEntries);

    const result = await getReconciliationReportInteractor(
      applicationContext,
      {
        end: timeEnd,
        reconciliationDate: startDate,
        start: timeStart,
      },
      mockIrsSuperuser,
    );
    expect(result.reconciliationDate).toBe(startDate);
  });
});
