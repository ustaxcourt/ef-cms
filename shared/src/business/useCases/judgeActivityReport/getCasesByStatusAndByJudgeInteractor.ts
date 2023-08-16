import { Converter } from 'aws-sdk/clients/dynamodb';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { getClient } from '../../../../../web-api/elasticsearch/client';
const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
  pageNumber?: number;
  pageSize?: number;
};

export type CavAndSubmittedCaseResponseType = {
  foundCases: { docketNumber: string }[];
};

export type ConsolidatedCasesGroupCountMapResponseType = {
  [leadDocketNumber: string]: number;
};

export type CavAndSubmittedFilteredCasesType = {
  caseStatusHistory: {
    date: string;
    changedBy: string;
    updatedCaseStatus: string;
  }[];
  leadDocketNumber: string;
  docketNumber: string;
  caseCaption: string;
  status: string;
  petitioners: TPetitioner[];
};

export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
  consolidatedCasesCounts: ConsolidatedCasesGroupCountMapResponseType;
  totalCount: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();
  const esClient = await getClient({ environmentName, version }); // TODO: this will go away

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);
  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  // 1. Get all of the cases that are Submitted and CAV status
  const results = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        // no judge
        statuses: searchEntity.statuses,
      },
    });

  // 2. Filter out any where leadDocketNumber exists and it doesn't equal the docket number
  const cavAndSubmittedCases = results.body.hits.hits
    .map(hit => Converter.unmarshall(hit['_source'])) // make them easier to work with
    .filter(
      hit =>
        !hit['leadDocketNumber'] ||
        hit['leadDocketNumber'] !== hit['docketNumber'],
    );

  // 3. Search for any case that has a docketNumber we've already identified as a CAV or Submitted
  //    ... and has a document with 'eventCode.S': ['ODD', 'DEC', 'OAD', 'SDEC'],
  // TODO: extract this into a new function
  const results2 = await esClient.search({
    body: {
      _source: ['docketNumber'], // we only care about the docket number
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': cavAndSubmittedCases.map(
                  caseInfo => caseInfo.docketNumber,
                ),
              },
            },
            {
              has_child: {
                query: {
                  terms: {
                    'eventCode.S': ['ODD', 'DEC', 'OAD', 'SDEC'],
                  },
                },
                type: 'document',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  });

  // 4. Calculate the docket numbers to filter out from the search results
  const casesToFilterOut = results2.body.hits.hits.map(
    hit => hit['_source']['docketNumber'].S,
  );

  // 5. Calculate the final list of CAV and Submitted cases to return
  const finalListOfCases = cavAndSubmittedCases.filter(
    caseInfo => !casesToFilterOut.includes(caseInfo.docketNumber),
  );

  const itemOffset =
    (searchEntity.pageNumber * searchEntity.pageSize) % finalListOfCases.length;

  const endOffset = itemOffset + searchEntity.pageSize;

  const formattedCaseRecordsForDisplay = finalListOfCases.slice(
    itemOffset,
    endOffset,
  );

  return {
    cases: formattedCaseRecordsForDisplay,
    consolidatedCasesCounts: Object.fromEntries(consolidatedCasesCounts),
    totalCount: finalListOfCases.length,
  };
};
