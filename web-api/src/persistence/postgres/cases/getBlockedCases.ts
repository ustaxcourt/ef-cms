import { convertDbRowToRawEligibleCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { search } from '../../elasticsearch/searchClient';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import mockBlockedCases from '@shared/test/tempBlockedCases.json';

export const getBlockedCases = async ({
  applicationContext,
  trialLocation,
}) => {
  // TODO: refactor to allow ability to only return specific case statuses

  // const { results } = await search({
  //   applicationContext,
  //   searchParameters: {
  //     body: {
  //       _source: [
  //         'automaticBlocked',
  //         'automaticBlockedDate',
  //         'automaticBlockedReason',
  //         'blocked',
  //         'blockedDate',
  //         'blockedReason',
  //         'caseCaption',
  //         'docketNumber',
  //         'docketNumberSuffix',
  //         'docketNumberWithSuffix',
  //         'leadDocketNumber',
  //         'status',
  //         'procedureType',
  //       ],
  //       query: {
  //         bool: {
  //           must: [
  //             { term: { 'preferredTrialCity.S': trialLocation } },
  //             {
  //               bool: {
  //                 should: [
  //                   { match: { 'automaticBlocked.BOOL': true } },
  //                   { match: { 'blocked.BOOL': true } },
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       size: 5000,
  //     },
  //     index: 'efcms-case',
  //   },
  // });

  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select([
        'automaticBlocked',
        'automaticBlockedDate',
        'automaticBlockedReason',
        'blocked',
        'blockedDate',
        'blockedReason',
        'caption',
        'docketNumber',
        'docketNumberSuffix',
        'docketNumberWithSuffix',
        'leadDocketNumber',
        'status',
        'procedureType',
      ])
      .where('preferredTrialCity', '=', trialLocation)
      // is this an exclusive or? it shouldn't be
      .where(eb => eb('blocked', '=', true).or('automaticBlocked', '=', true))
      .execute(),
  );

  const casesForReturn = dbCases.map(c => {
    return c
      ? transformNullToUndefined(convertDbRowToRawEligibleCase(c))
      : undefined;
  });

  // const casesForReturn = mockBlockedCases;

  return casesForReturn;
};
