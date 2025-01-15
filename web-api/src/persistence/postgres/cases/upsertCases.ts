import { convertRawCaseToDbRow } from '@web-api/persistence/postgres/cases/mapper';
import { getDbWriter } from '@web-api/database';

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

  const casesToUpsert = rawCases.map(rawCase => convertRawCaseToDbRow(rawCase));

  await getDbWriter(writer =>
    writer
      .insertInto('dwCase')
      .values(casesToUpsert)
      .onConflict(oc =>
        oc.column('docketNumber').doUpdateSet(c => {
          return {
            associatedJudge: c.ref('excluded.associatedJudge'),
            associatedJudgeId: c.ref('excluded.associatedJudgeId'),
            automaticBlocked: c.ref('excluded.automaticBlocked'),
            automaticBlockedDate: c.ref('excluded.automaticBlockedDate'),
            automaticBlockedReason: c.ref('excluded.automaticBlockedReason'),
            blocked: c.ref('excluded.blocked'),
            blockedDate: c.ref('excluded.blockedDate'),
            blockedReason: c.ref('excluded.blockedReason'),
            canAllowDocumentService: c.ref('excluded.canAllowDocumentService'),
            canAllowPrintableDocketRecord: c.ref(
              'excluded.canAllowPrintableDocketRecord',
            ),
            canDojPractitionersRepresentParty: c.ref(
              'excluded.canDojPractitionersRepresentParty',
            ),
            caption: c.ref('excluded.caption'),
            caseNote: c.ref('excluded.caseNote'),
            caseType: c.ref('excluded.caseType'),
            closedDate: c.ref('excluded.closedDate'),
            createdAt: c.ref('excluded.createdAt'),
            damages: c.ref('excluded.damages'),
            docketNumber: c.ref('excluded.docketNumber'),
            docketNumberSuffix: c.ref('excluded.docketNumberSuffix'),
            filingType: c.ref('excluded.filingType'),
            hasPendingItems: c.ref('excluded.hasPendingItems'),
            hasVerifiedIrsNotice: c.ref('excluded.hasVerifiedIrsNotice'),
            hearings: c.ref('excluded.hearings'),
            highPriority: c.ref('excluded.highPriority'),
            highPriorityReason: c.ref('excluded.highPriorityReason'),
            initialCaption: c.ref('excluded.initialCaption'),
            initialDocketNumberSuffix: c.ref(
              'excluded.initialDocketNumberSuffix',
            ),
            irsNoticeDate: c.ref('excluded.irsNoticeDate'),
            isPaper: c.ref('excluded.isPaper'),
            isSealed: c.ref('excluded.isSealed'),
            judgeUserId: c.ref('excluded.judgeUserId'),
            leadDocketNumber: c.ref('excluded.leadDocketNumber'),
            litigationCosts: c.ref('excluded.litigationCosts'),
            mailingDate: c.ref('excluded.mailingDate'),
            noticeOfAttachments: c.ref('excluded.noticeOfAttachments'),
            noticeOfTrialDate: c.ref('excluded.noticeOfTrialDate'),
            orderDesignatingPlaceOfTrial: c.ref(
              'excluded.orderDesignatingPlaceOfTrial',
            ),
            orderForAmendedPetition: c.ref('excluded.orderForAmendedPetition'),
            orderForAmendedPetitionAndFilingFee: c.ref(
              'excluded.orderForAmendedPetitionAndFilingFee',
            ),
            orderForCds: c.ref('excluded.orderForCds'),
            orderForFilingFee: c.ref('excluded.orderForFilingFee'),
            orderForRatification: c.ref('excluded.orderForRatification'),
            orderToShowCause: c.ref('excluded.orderToShowCause'),
            partyType: c.ref('excluded.partyType'),
            petitionPaymentDate: c.ref('excluded.petitionPaymentDate'),
            petitionPaymentMethod: c.ref('excluded.petitionPaymentMethod'),
            petitionPaymentStatus: c.ref('excluded.petitionPaymentStatus'),
            petitionPaymentWaivedDate: c.ref(
              'excluded.petitionPaymentWaivedDate',
            ),
            preferredTrialCity: c.ref('excluded.preferredTrialCity'),
            procedureType: c.ref('excluded.procedureType'),
            qcCompleteForTrial: c.ref('excluded.qcCompleteForTrial'),
            receivedAt: c.ref('excluded.receivedAt'),
            sealedDate: c.ref('excluded.sealedDate'),
            sortableDocketNumber: c.ref('excluded.sortableDocketNumber'),
            status: c.ref('excluded.status'),
            trialDate: c.ref('excluded.trialDate'),
            trialLocation: c.ref('excluded.trialLocation'),
            trialSessionId: c.ref('excluded.trialSessionId'),
            trialTime: c.ref('excluded.trialTime'),
            useSameAsPrimary: c.ref('excluded.useSameAsPrimary'),
          };
        }),
      )
      .execute(),
  );
};
