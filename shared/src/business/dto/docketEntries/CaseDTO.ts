import { Case, CaseStatusChange } from '@shared/business/entities/cases/Case';
import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import {
  CaseType,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { RawConsolidatedCaseSummary } from '../cases/ConsolidatedCaseSummary';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export class CaseDTO {
  public entityName = 'CaseDTO';
  public associatedJudge?: string;
  public associatedJudgeId?: string;
  public automaticBlocked?: boolean;
  public automaticBlockedDate?: string;
  public automaticBlockedReason?: string;
  public blocked?: boolean;
  public blockedDate?: string;
  public blockedReason?: string;
  public caseStatusHistory?: CaseStatusChange[];
  public caseNote?: string;
  public damages?: number;
  public litigationCosts?: number;
  public qcCompleteForTrial?: Record<string, any>;
  public noticeOfAttachments?: boolean;
  public orderDesignatingPlaceOfTrial?: boolean;
  public orderForAmendedPetition?: boolean;
  public orderForAmendedPetitionAndFilingFee?: boolean;
  public orderForFilingFee?: boolean;
  public orderForCds?: boolean;
  public orderForRatification?: boolean;
  public orderToShowCause?: boolean;
  public petitioners: TPetitioner[];
  public caseCaption: string;
  public caseType: CaseType;
  public closedDate?: string;
  public createdAt?: string;
  public docketNumber: string;
  public docketNumberSuffix?: string | null;
  public filingType?: string;
  public hasVerifiedIrsNotice?: boolean;
  public irsNoticeDate?: string;
  public isPaper?: boolean;
  public leadDocketNumber?: string;
  public mailingDate?: string;
  public partyType: string;
  public petitionPaymentDate?: string;
  public petitionPaymentMethod?: string;
  public petitionPaymentStatus: string;
  public petitionPaymentWaivedDate?: string;
  public preferredTrialCity?: string;
  public remoteTrialGranted?: boolean;
  public remoteTrialGrantedDate?: string | null;
  public procedureType: string;
  public receivedAt?: string;
  public sealedDate?: string;
  public status: CaseStatus;
  public sortableDocketNumber: number;
  public trialDate?: string;
  public trialLocation?: string;
  public trialSessionId?: string;
  public trialTime?: string;
  public useSameAsPrimary?: boolean;
  public initialDocketNumberSuffix?: string;
  public noticeOfTrialDate?: string;
  public docketNumberWithSuffix!: string;
  public canAllowDocumentService?: boolean;
  public canAllowPrintableDocketRecord?: boolean;
  public canDojPractitionersRepresentParty?: boolean;
  public archivedDocketEntries?: RawDocketEntry[];
  public docketEntries: RawDocketEntry[];
  public isSealed?: boolean;
  public hearings: any[];
  public privatePractitioners?: any[];
  public initialCaption?: string;
  public irsPractitioners?: any[];
  public statistics?: RawStatistic[];
  public correspondence: RawCorrespondence[];
  public archivedCorrespondences?: RawCorrespondence[];
  public hasPendingItems?: boolean;
  public consolidatedCases: RawConsolidatedCaseSummary[];

  constructor(
    rawCase: RawCase,
    rebuildCaseOptions?: {
      authorizedUser: UnknownAuthUser;
      filtered?: boolean;
      isNewCase?: boolean;
    },
  ) {
    if (rebuildCaseOptions) {
      rawCase = new Case(rawCase, rebuildCaseOptions).toRawObject();
    }

    this.associatedJudge = rawCase.associatedJudge;
    this.associatedJudgeId = rawCase.associatedJudgeId;
    this.automaticBlocked = rawCase.automaticBlocked;
    this.automaticBlockedDate = rawCase.automaticBlockedDate;
    this.automaticBlockedReason = rawCase.automaticBlockedReason;
    this.blocked = rawCase.blocked;
    this.blockedDate = rawCase.blockedDate;
    this.blockedReason = rawCase.blockedReason;
    this.caseStatusHistory = rawCase.caseStatusHistory;
    this.caseNote = rawCase.caseNote;
    this.damages = rawCase.damages;
    this.litigationCosts = rawCase.litigationCosts;
    this.qcCompleteForTrial = rawCase.qcCompleteForTrial;
    this.noticeOfAttachments = rawCase.noticeOfAttachments;
    this.orderDesignatingPlaceOfTrial = rawCase.orderDesignatingPlaceOfTrial;
    this.orderForAmendedPetition = rawCase.orderForAmendedPetition;
    this.orderForAmendedPetitionAndFilingFee =
      rawCase.orderForAmendedPetitionAndFilingFee;
    this.orderForFilingFee = rawCase.orderForFilingFee;
    this.orderForCds = rawCase.orderForCds;
    this.orderForRatification = rawCase.orderForRatification;
    this.orderToShowCause = rawCase.orderToShowCause;
    this.petitioners = rawCase.petitioners;
    this.caseCaption = rawCase.caseCaption;
    this.caseType = rawCase.caseType;
    this.closedDate = rawCase.closedDate;
    this.createdAt = rawCase.createdAt;
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberSuffix = rawCase.docketNumberSuffix;
    this.filingType = rawCase.filingType;
    this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
    this.irsNoticeDate = rawCase.irsNoticeDate;
    this.isPaper = rawCase.isPaper;
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.mailingDate = rawCase.mailingDate;
    this.partyType = rawCase.partyType;
    this.petitionPaymentDate = rawCase.petitionPaymentDate;
    this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
    this.petitionPaymentStatus = rawCase.petitionPaymentStatus;
    this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.remoteTrialGranted = rawCase.remoteTrialGranted;
    this.remoteTrialGrantedDate = rawCase.remoteTrialGrantedDate;
    this.procedureType = rawCase.procedureType;
    this.receivedAt = rawCase.receivedAt;
    this.sealedDate = rawCase.sealedDate;
    this.status = rawCase.status;
    this.sortableDocketNumber = rawCase.sortableDocketNumber;
    this.trialDate = rawCase.trialDate;
    this.trialLocation = rawCase.trialLocation;
    this.trialSessionId = rawCase.trialSessionId;
    this.trialTime = rawCase.trialTime;
    this.useSameAsPrimary = rawCase.useSameAsPrimary;
    this.initialDocketNumberSuffix = rawCase.initialDocketNumberSuffix;
    this.noticeOfTrialDate = rawCase.noticeOfTrialDate;
    this.docketNumberWithSuffix = rawCase.docketNumberWithSuffix;
    this.canAllowDocumentService = rawCase.canAllowDocumentService;
    this.canAllowPrintableDocketRecord = rawCase.canAllowPrintableDocketRecord;
    this.canDojPractitionersRepresentParty =
      rawCase.canDojPractitionersRepresentParty;
    this.archivedDocketEntries = removeServedParties(
      rawCase.archivedDocketEntries ?? [],
    );
    this.docketEntries = removeServedParties(rawCase.docketEntries ?? []);
    this.isSealed = rawCase.isSealed;
    this.hearings = rawCase.hearings;
    this.privatePractitioners = rawCase.privatePractitioners;
    this.initialCaption = rawCase.initialCaption;
    this.irsPractitioners = rawCase.irsPractitioners;
    this.statistics = rawCase.statistics;
    this.correspondence = rawCase.correspondence;
    this.archivedCorrespondences = rawCase.archivedCorrespondences;
    this.hasPendingItems = rawCase.hasPendingItems;
    this.consolidatedCases = rawCase.consolidatedCases;
  }
}

export const removeServedParties = (
  docketEntries: RawDocketEntry[],
): RawDocketEntry[] => {
  return docketEntries.map(de => {
    const result: RawDocketEntry = {
      ...de,
      servedParties: undefined,
    };
    if (de.secondaryDocument?.previousDocument?.servedParties) {
      result.secondaryDocument = {
        ...de.secondaryDocument,
        previousDocument: {
          ...de.secondaryDocument.previousDocument,
          servedParties: undefined,
        },
      };
    }
    return result;
  });
};
