import { mockEntireFile } from '@shared/test/mockFactory';
jest.mock('@shared/business/utilities/DateHandler', () =>
  mockEntireFile({
    keepImplementation: true,
    module: '@shared/business/utilities/DateHandler',
  }),
);
jest.mock('@web-api/business/useCaseHelper/saveFileAndGenerateUrl');
jest.mock(
  '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor',
);
import '@web-api/notifications/notificationClient/notificationGateway.mocks.jest';
import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { createCsvCustomCaseReportFileInteractor } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { formatNow as formatNowMock } from '@shared/business/utilities/DateHandler';
import { getCustomCaseReportInteractor as getCustomCaseReportInteractorMock } from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { getNotificationGateway as getNotificationGatewayMock } from '@web-api/notifications/notificationClient/getNotificationGateway';
import {
  mockDocketClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { saveFileAndGenerateUrl as saveFileAndGenerateUrlMock } from '@web-api/business/useCaseHelper/saveFileAndGenerateUrl';

describe('createCsvCustomCaseReportFileInteractor', () => {
  const formatNow = jest.mocked(formatNowMock);
  const getCustomCaseReportInteractor = jest.mocked(
    getCustomCaseReportInteractorMock,
  );
  const getNotificationGateway = getNotificationGatewayMock as jest.Mock;
  const saveFileAndGenerateUrl = jest.mocked(saveFileAndGenerateUrlMock);

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
    getNotificationGateway().sendNotificationToUser.mockReturnValue(null);

    getCustomCaseReportInteractor.mockResolvedValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          caseCaption: 'caseCaption',
          caseType: CASE_TYPES_MAP.cdp,
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          procedureType: '',
          receivedAt: 'receivedAt',
          status: CASE_STATUS_TYPES.assignedCase,
        },
      ],
      lastCaseId: { pk: '', receivedAt: 0 },
      totalCount: 20,
    });

    formatNow.mockReturnValue('TEST_DATE');

    saveFileAndGenerateUrl.mockResolvedValue({
      fileId: 'fileId',
      url: 'url',
    });
  });

  it('should send websocket message with filename and url', async () => {
    await createCsvCustomCaseReportFileInteractor(
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const sendNotificationCalls =
      getNotificationGateway().sendNotificationToUser.mock.calls;
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

    const saveFileAndGenerateUrlCalls = saveFileAndGenerateUrl.mock.calls;
    const csvStringBuffer = Buffer.from(
      `Docket No.,Date Created,Case Title,Case Status,Case Type,Judge,Requested Place of Trial,Calendaring High Priority\ndocketNumber,Invalid DateTime,caseCaption,${CASE_STATUS_TYPES.assignedCase},${CASE_TYPES_MAP.cdp},associatedJudge,preferredTrialCity,yes\n`,
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
        DEFAULT_PARAMS,
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should handle values with new lines', async () => {
    getCustomCaseReportInteractor.mockResolvedValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          caseCaption: 'caseCaption\nextra line',
          caseType: 'Deficiency',
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          procedureType: '',
          receivedAt: 'receivedAt',
          status: 'Assigned - Case',
        },
      ],
      lastCaseId: { pk: 'case|101-20', receivedAt: 1928743 },
      totalCount: 20,
    });

    await createCsvCustomCaseReportFileInteractor(
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const saveFileAndGenerateUrlCalls = saveFileAndGenerateUrl.mock.calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);

    const csvBuffer = saveFileAndGenerateUrlCalls[0][0].file;
    const records = csvBuffer
      .toString()
      .split('\n')
      .filter(x => !!x);

    expect(records.length).toEqual(2);
  });

  it('should get case title correctly', async () => {
    getCustomCaseReportInteractor.mockResolvedValue({
      foundCases: [
        {
          associatedJudge: 'associatedJudge',
          caseCaption: 'caseCaption, Petitioner',
          caseType: CASE_TYPES_MAP.cdp,
          docketNumber: 'docketNumber',
          highPriority: true,
          preferredTrialCity: 'preferredTrialCity',
          procedureType: '',
          receivedAt: 'receivedAt',
          status: CASE_STATUS_TYPES.calendared,
        },
      ],
      lastCaseId: { pk: 'case-101-23', receivedAt: 32849 },
      totalCount: 10,
    });

    await createCsvCustomCaseReportFileInteractor(
      DEFAULT_PARAMS,
      mockDocketClerkUser,
    );

    const saveFileAndGenerateUrlCalls = saveFileAndGenerateUrl.mock.calls;

    const csvBuffer = saveFileAndGenerateUrlCalls[0][0].file;
    const records = csvBuffer
      .toString()
      .split('\n')
      .filter(x => !!x);

    expect(records[1]).toEqual(
      `docketNumber,Invalid DateTime,caseCaption,${CASE_STATUS_TYPES.calendared},${CASE_TYPES_MAP.cdp},associatedJudge,preferredTrialCity,yes`,
    );
  });
});
