import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCsvCustomCaseReportFileInteractor } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import {
  docketClerkUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

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
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);

    applicationContext.getNotificationGateway().sendNotificationToUser = jest
      .fn()
      .mockReturnValue(null);

    applicationContext.getUseCases().getCustomCaseReportInteractor = jest
      .fn()
      .mockReturnValue({
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
    );

    const sendNotificationCalls =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls;
    expect(sendNotificationCalls.length).toEqual(3);

    expect(sendNotificationCalls[0][0].message).toEqual({
      action: 'batch_download_csv_data',
      numberOfRecordsDownloaded: 0,
      totalFiles: 1,
    });

    expect(sendNotificationCalls[1][0].message).toEqual({
      action: 'batch_download_csv_data',
      numberOfRecordsDownloaded: 1,
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
      'Docket No.,Date Filed,Case Title,Case Status,Case Type,Judge,Requested Place of Trial,Calendaring High Priority\ndocketNumber,Invalid DateTime,caseCaption,status,caseType,associatedJudge,preferredTrialCity,yes\n',
    );
    const bomBuffer = Buffer.from([239, 187, 191]);

    const csvBuffer = Buffer.concat([bomBuffer, csvStringBuffer]);
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0].contentType).toEqual('text/csv');
    expect(saveFileAndGenerateUrlCalls[0][0].useTempBucket).toEqual(true);
    expect(saveFileAndGenerateUrlCalls[0][0].file).toEqual(csvBuffer);
  });

  it('should throw an error if a user is not authorized', async () => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(privatePractitionerUser);

    await expect(
      createCsvCustomCaseReportFileInteractor(
        applicationContext,
        DEFAULT_PARAMS,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throttle fetching data every 10th call', async () => {
    applicationContext.setTimeout = jest
      .fn()
      .mockImplementation(callback => callback());

    await createCsvCustomCaseReportFileInteractor(applicationContext, {
      ...DEFAULT_PARAMS,
      totalCount: 100000,
    });
    expect(applicationContext.setTimeout).toHaveBeenCalledTimes(1);
  });
});
