import { Case } from '@shared/business/entities/cases/Case';
import {
  CaseInventory,
  CustomCaseReportFilters,
  CustomCaseReportSearchAfter,
  getCustomCaseReportInteractor,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import {
  FORMATS,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@web-api/applicationContext';
import { getNotificationGateway } from '@web-api/notifications/notificationClient/getNotificationGateway';
import { saveFileAndGenerateUrl } from '@web-api/business/useCaseHelper/saveFileAndGenerateUrl';
import { stringify } from 'csv-stringify/sync';

export type CustomCaseReportCsvRequest = CustomCaseReportFilters & {
  totalCount: number;
  clientConnectionId: string;
};

export const createCsvCustomCaseReportFileInteractor = async (
  {
    caseStatuses,
    caseTypes,
    clientConnectionId,
    endDate,
    filingMethod,
    highPriority,
    judges,
    preferredTrialCities,
    procedureType,
    startDate,
    totalCount,
  }: CustomCaseReportCsvRequest,
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let searchAfter: CustomCaseReportSearchAfter = {
    pk: null,
    receivedAt: null,
  };
  const pageSize = 9000;

  const loops = Math.floor(totalCount / pageSize) + 1;
  const WAIT_TIME = 1500;
  const cases: CaseInventory[] = [];

  await getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'batch_download_csv_data',
      filesCompleted: 0,
      totalFiles: totalCount,
    },
    userId: authorizedUser.userId,
  });

  for (let index = 0; index < loops; index++) {
    if (index && index % 10 === 0) {
      // Need to throttle every 10th call
      await new Promise(resolve => {
        setTimeout(() => resolve(null), WAIT_TIME);
      });
    }

    const iterationData = await getCustomCaseReportInteractor(
      {
        caseStatuses,
        caseTypes,
        endDate,
        filingMethod,
        highPriority,
        judges,
        pageSize,
        preferredTrialCities,
        procedureType,
        searchAfter,
        startDate,
      },
      authorizedUser,
    );

    cases.push(...iterationData.foundCases);
    searchAfter = iterationData.lastCaseId;

    await getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_csv_data',
        filesCompleted: cases.length,
        totalFiles: totalCount,
      },
      userId: authorizedUser.userId,
    });
  }

  const formattedCases = cases.map(aCase => ({
    ...aCase,
    calendaringHighPriority: aCase.highPriority ? 'yes' : '',
    caseCaption: Case.getCaseTitle(aCase.caseCaption),
    receivedAt: formatDateString(aCase.receivedAt, FORMATS.MMDDYY),
  }));

  const csvString = getCsvString(formattedCases);
  const csvBuffer = Buffer.from(csvString);

  const today = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = 'Custom Case Report - ' + today;

  const fileInfo = await saveFileAndGenerateUrl({
    applicationContext,
    contentType: 'text/csv',
    file: csvBuffer,
    useTempBucket: true,
  });

  await getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'download_csv_file',
      csvInfo: {
        fileName,
        url: fileInfo.url,
      },
    },
    userId: authorizedUser.userId,
  });
};

const getCsvString = (records: any[]) => {
  const CSV_DICTIONARY = [
    { header: 'Docket No.', key: 'docketNumber' },
    { header: 'Date Created', key: 'receivedAt' },
    { header: 'Case Title', key: 'caseCaption' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Type', key: 'caseType' },
    { header: 'Judge', key: 'associatedJudge' },
    { header: 'Requested Place of Trial', key: 'preferredTrialCity' },
    { header: 'Calendaring High Priority', key: 'calendaringHighPriority' },
  ];

  const updatedRecords = records.map(record => {
    CSV_DICTIONARY.forEach(({ key }) => {
      if (!record[key]) return;
      record[key] = record[key].split('\n').join(' ').split('  ').join(' ');
    });
    return record;
  });

  return stringify(updatedRecords, {
    bom: true,
    columns: CSV_DICTIONARY,
    header: true,
  });
};
