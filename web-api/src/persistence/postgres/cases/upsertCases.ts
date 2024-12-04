import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';

const allColumns = [
  'associatedJudge',
  'associatedJudgeId',
  'automaticBlocked',
  'automaticBlockedDate',
  'automaticBlockedReason',
  'blocked',
  'blockedDate',
  'blockedReason',
  'canAllowDocumentService',
  'canAllowPrintableDocketRecord',
  'canDojPractitionersRepresentParty',
  'caption',
  'caseNote',
  'caseType',
  'closedDate',
  'createdAt',
  'damages',
  'docketNumber',
  'docketNumberSuffix',
  'filingType',
  'hasPendingItems',
  'hasVerifiedIrsNotice',
  'hearings',
  'highPriority',
  'highPriorityReason',
  'initialCaption',
  'initialDocketNumberSuffix',
  'irsNoticeDate',
  'isPaper',
  'isSealed',
  'judgeUserId',
  'leadDocketNumber',
  'litigationCosts',
  'mailingDate',
  'noticeOfAttachments',
  'noticeOfTrialDate',
  'orderDesignatingPlaceOfTrial',
  'orderForAmendedPetition',
  'orderForAmendedPetitionAndFilingFee',
  'orderForCds',
  'orderForFilingFee',
  'orderForRatification',
  'orderToShowCause',
  'partyType',
  'petitionPaymentDate',
  'petitionPaymentMethod',
  'petitionPaymentStatus',
  'petitionPaymentWaivedDate',
  'preferredTrialCity',
  'procedureType',
  'qcCompleteForTrial',
  'receivedAt',
  'sealedDate',
  'sortableDocketNumber',
  'statistics',
  'status',
  'trialDate',
  'trialLocation',
  'trialSessionId',
  'trialTime',
  'useSameAsPrimary',
];

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

  const casesToUpsert = rawCases.map(rawCase => convertRawCaseToDbRow(rawCase));

  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values(casesToUpsert)
      .onConflict(oc =>
        oc.column('docketNumber').doUpdateSet(c => {
          const updates = Object.fromEntries(
            // @ts-ignore -- 10502 TODO
            allColumns.map(column => [column, c.ref(`excluded.${column}`)]),
          );
          return updates;
        }),
      )
      .execute(),
  );
};
