jest.mock(
  '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor',
);
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCsvCustomCaseReportFileInteractor } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { getCustomCaseReportInteractor as getCustomCaseReportInteractorMock } from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import {
  mockDocketClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

const getCustomCaseReportInteractor =
  getCustomCaseReportInteractorMock as jest.Mock;

describe('createCsvCustomCaseReportFileInteractor', () => {
  const DEFAULT_PARAMS = {
    caseStatuses: 'caseStatuses',
    caseTypes: 'caseTypes',
    clientConnectionId: 'clientConnectionId',
    endDate: 'endDate',
    filingMethod: 'filingMethod',
    highPriority: 'highPriority',
    judges: 'judges',
    preferredTrialCities: 'preferredTrialCities',
    procedureType: 'procedureType',
    startDate: 'startDate',
    totalCount: 1,
  } as any;

  beforeEach(() => {
    applicationContext.getNotificationGateway().sendNotificationToUser = jest
      .fn()
      .mockReturnValue(null);

    getCustomCaseReportInteractor.mockReturnValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          calendaringHighPriority: 'calendaringHighPriority',
          caseCaption: 'caseCaption',
          caseType: 'caseType',
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          receivedAt: 'receivedAt',
          status: 'status',
        },
      ],
    });

    applicationContext.getUtilities().formatNow = jest
      .fn()
      .mockReturnValue('TEST_DATE');

    applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl = jest
      .fn()
      .mockReturnValue({
        fileId: 'fileId',
        url: 'url',
      });
  });

  it('should send websocket message with filename and url', async () => {
    await createCsvCustomCaseReportFileInteractor(
      applicationContext,
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const sendNotificationCalls =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls;
    expect(sendNotificationCalls.length).toEqual(3);

    expect(sendNotificationCalls[0][0].message).toEqual({
      action: 'batch_download_csv_data',
      filesCompleted: 0,
      totalFiles: 1,
    });

    expect(sendNotificationCalls[1][0].message).toEqual({
      action: 'batch_download_csv_data',
      filesCompleted: 1,
      totalFiles: 1,
    });

    expect(sendNotificationCalls[2][0].message).toEqual({
      action: 'download_csv_file',
      csvInfo: {
        fileName: 'Custom Case Report - TEST_DATE',
        url: 'url',
      },
    });

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;
    const csvStringBuffer = Buffer.from(
      'Docket No.,Date Created,Case Title,Case Status,Case Type,Judge,Requested Place of Trial,Calendaring High Priority\ndocketNumber,Invalid DateTime,caseCaption,status,caseType,associatedJudge,preferredTrialCity,yes\n',
    );
    const bomBuffer = Buffer.from([239, 187, 191]);

    const csvBuffer = Buffer.concat([bomBuffer, csvStringBuffer]);
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0].contentType).toEqual('text/csv');
    expect(saveFileAndGenerateUrlCalls[0][0].useTempBucket).toEqual(true);
    expect(saveFileAndGenerateUrlCalls[0][0].file).toEqual(csvBuffer);
  });

  it('should throw an error if a user is not authorized', async () => {
    await expect(
      createCsvCustomCaseReportFileInteractor(
        applicationContext,
        DEFAULT_PARAMS,
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throttle fetching data every 10th call', async () => {
    applicationContext.setTimeout = jest
      .fn()
      .mockImplementation(callback => callback());

    await createCsvCustomCaseReportFileInteractor(
      applicationContext,
      {
        ...DEFAULT_PARAMS,
        totalCount: 100000,
      },
      mockDocketClerkUser,
    );
    expect(applicationContext.setTimeout).toHaveBeenCalledTimes(1);
  });

  it('should handle values with new lines', async () => {
    getCustomCaseReportInteractor.mockReturnValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          calendaringHighPriority: 'calendaringHighPriority',
          caseCaption: 'caseCaption\nextra line',
          caseType: 'caseType',
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          receivedAt: 'receivedAt',
          status: 'status',
        },
      ],
    });

    await createCsvCustomCaseReportFileInteractor(
      applicationContext,
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);

    const csvBuffer = saveFileAndGenerateUrlCalls[0][0].file;
    const records = csvBuffer
      .toString()
      .split('\n')
      .filter(x => !!x);

    expect(records.length).toEqual(2);
  });

  it('should get case title correctly', async () => {
    getCustomCaseReportInteractor.mockReturnValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          calendaringHighPriority: 'calendaringHighPriority',
          caseCaption: 'caseCaption, Petitioner',
          caseType: 'caseType',
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          receivedAt: 'receivedAt',
          status: 'status',
        },
      ],
    });

    await createCsvCustomCaseReportFileInteractor(
      applicationContext,
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;

    const csvBuffer = saveFileAndGenerateUrlCalls[0][0].file;
    const records = csvBuffer
      .toString()
      .split('\n')
      .filter(x => !!x);

    expect(records[1]).toEqual(
      'docketNumber,Invalid DateTime,caseCaption,status,caseType,associatedJudge,preferredTrialCity,yes',
    );
  });
});
