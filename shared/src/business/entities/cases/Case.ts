/* eslint-disable max-lines */
import {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  CASE_CAPTION_POSTFIX,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
  CONTACT_TYPES,
  CaseStatus,
  CaseType,
  DOCKET_NUMBER_SUFFIXES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  MINUTE_ENTRIES_MAP,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONER_CONTACT_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  SYSTEM_ROLE,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '../EntityConstants';
import {
  CASE_CAPTION_RULE,
  CASE_DOCKET_NUMBER_RULE,
  CASE_IRS_PRACTITIONERS_RULE,
  CASE_IS_SEALED_RULE,
  CASE_LEAD_DOCKET_NUMBER_RULE,
  CASE_PETITIONERS_RULE,
  CASE_PRIVATE_PRACTITIONERS_RULE,
  CASE_SORTABLE_DOCKET_NUMBER_RULE,
  CASE_STATUS_RULE,
  DOCKET_ENTRY_VALIDATION_RULES,
} from '../EntityValidationConstants';
import {
  ConsolidatedCaseSummary,
  RawConsolidatedCaseSummary,
} from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { ContactFactory } from '../contacts/ContactFactory';
import { Correspondence } from '../Correspondence';
import { DocketEntry } from '../DocketEntry';
import {
  FORMATS,
  PATTERNS,
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
  dateStringsCompared,
  formatDateString,
  prepareDateFromString,
} from '../../utilities/DateHandler';
import { IrsPractitioner } from '../IrsPractitioner';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { Petitioner } from '../contacts/Petitioner';
import { PrivatePractitioner } from '../PrivatePractitioner';
import { Statistic } from '../Statistic';
import { TrialSession } from '../trialSessions/TrialSession';
import { UnprocessableEntityError } from '../../../../../web-api/src/errors/errors';
import { User } from '../User';
import { clone, compact, includes, isEmpty, startCase } from 'lodash';
import { compareStrings } from '../../utilities/sortFunctions';
import { getDocketNumberSuffix } from '../../utilities/getDocketNumberSuffix';
import { shouldGenerateDocketRecordIndex } from '../../utilities/shouldGenerateDocketRecordIndex';
import joi from 'joi';

export class Case extends JoiValidationEntity {
  public associatedJudge?: string;
  public associatedJudgeId?: string;
  public automaticBlocked?: boolean;
  public automaticBlockedDate?: string;
  public automaticBlockedReason?: string;
  public blocked?: boolean;
  public blockedDate?: string;
  public blockedReason?: string;
  public caseStatusHistory: CaseStatusChange[];
  public caseNote?: string;
  public damages?: number;
  public highPriority?: boolean;
  public highPriorityReason?: string;
  public judgeUserId?: string;
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
  public createdAt: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
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
  public procedureType: string;
  public receivedAt: string;
  public sealedDate?: string;
  public status: CaseStatus;
  public sortableDocketNumber: number;
  public trialDate?: string;
  public trialLocation?: string;
  public trialSessionId?: string;
  public trialTime?: string;
  public useSameAsPrimary?: string;
  public initialDocketNumberSuffix?: string;
  public noticeOfTrialDate?: string;
  public docketNumberWithSuffix?: string;
  public canAllowDocumentService?: boolean;
  public canAllowPrintableDocketRecord!: boolean;
  public archivedDocketEntries?: RawDocketEntry[];
  public docketEntries: any[];
  public isSealed?: boolean;
  public hearings: any[];
  public privatePractitioners?: any[];
  public initialCaption?: string;
  public irsPractitioners?: any[];
  public statistics?: any[];
  public correspondence?: any[];
  public archivedCorrespondences?: any[];
  public hasPendingItems?: boolean;
  public consolidatedCases: RawConsolidatedCaseSummary[] = [];

  constructor(
    rawCase: any,
    {
      applicationContext,
      filtered = false,
      isNewCase = false,
    }: {
      applicationContext: IApplicationContext;
      filtered?: boolean;
      isNewCase?: boolean;
    },
  ) {
    super('Case');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.petitioners = [];
    const currentUser = applicationContext.getCurrentUser();

    if (!filtered || User.isInternalUser(currentUser.role)) {
      this.assignFieldsForInternalUsers({
        applicationContext,
        rawCase,
      });
    }

    const params = { applicationContext, filtered, rawCase };

    // assignContacts needs to come first before assignDocketEntries
    this.assignConsolidatedCases({ rawCase });
    this.assignContacts(params);
    this.assignDocketEntries(params);
    this.assignHearings(params);
    this.assignPractitioners(params);
    this.assignFieldsForAllUsers(params);
    if (isNewCase) {
      const changedBy = rawCase.isPaper
        ? currentUser.name
        : startCase(currentUser.role);

      this.setCaseStatus({
        changedBy,
        updatedCaseStatus: rawCase.status || CASE_STATUS_TYPES.new,
      });
    }
  }

  /**
   * returns a sortable docket number in ${year}${index} format
   * @param {string} docketNumber the docket number to use
   * @returns {string|void} the sortable docket number
   */
  static getSortableDocketNumber(docketNumber?: string) {
    if (!docketNumber) {
      return;
    }

    // NOTE: 1574-65 is the oldest case in DAWSON, which was filed in 1965
    const oldestYear = 65;

    const [sequentialNumber, yearFiled] = docketNumber.split('-');
    const sequentialNumberPadded = sequentialNumber.padStart(6, '0');
    const yearFiledAdjusted =
      parseInt(yearFiled) >= oldestYear ? `19${yearFiled}` : `20${yearFiled}`;

    return parseInt(`${yearFiledAdjusted}${sequentialNumberPadded}`);
  }

  /**
   * sorts the given array of cases by docket number
   * @param {Array} cases the cases to check for lead case computation
   * @returns {Case} the lead Case entity
   */
  static sortByDocketNumber(cases) {
    return cases.sort((a, b) => {
      const aSplit = a.docketNumber.split('-');
      const bSplit = b.docketNumber.split('-');

      if (aSplit[1] !== bSplit[1]) {
        // compare years if they aren't the same;
        // compare as strings, because they *might* have suffix
        return aSplit[1].localeCompare(bSplit[1]);
      } else {
        // compare index if years are the same, compare as integers
        return +aSplit[0] - +bSplit[0];
      }
    });
  }

  /**
   * return the lead case for the given set of cases based on createdAt
   * (does NOT evaluate leadDocketNumber)
   * @param {Array} cases the cases to check for lead case computation
   * @returns {Case} the lead Case entity
   */
  static findLeadCaseForCases(cases) {
    const casesOrdered = Case.sortByDocketNumber([...cases]);
    return casesOrdered.shift();
  }

  /**
   * re-formats docket number with any leading zeroes and suffix removed
   * @param {string} docketNumber the docket number to re-format
   * @returns {string} the formatted docket Number
   */
  static formatDocketNumber(docketNumber) {
    const regex = /^0*(\d+-\d{2}).*/;
    return docketNumber.replace(regex, '$1');
  }

  /**
   * gets a document from docketEntries or correspondence arrays
   * @params {object} params the params object
   * @params {string} params.correspondenceId the id of the correspondence to retrieve
   * @returns {object} the retrieved correspondence
   */
  static getAttachmentDocumentById({
    caseDetail,
    documentId,
    useArchived = false,
  }) {
    let allCaseDocuments = [
      ...caseDetail.correspondence,
      ...caseDetail.docketEntries,
    ];
    if (useArchived) {
      allCaseDocuments = [
        ...allCaseDocuments,
        ...caseDetail.archivedDocketEntries,
        ...caseDetail.archivedCorrespondences,
      ];
    }
    return allCaseDocuments.find(
      d =>
        d &&
        (d.docketEntryId === documentId || d.correspondenceId === documentId),
    );
  }

  assignFieldsForInternalUsers({ applicationContext, rawCase }) {
    this.associatedJudge = rawCase.associatedJudge || CHIEF_JUDGE;
    this.associatedJudgeId = rawCase.associatedJudgeId;
    this.automaticBlocked = rawCase.automaticBlocked;
    this.automaticBlockedDate = rawCase.automaticBlockedDate;
    this.automaticBlockedReason = rawCase.automaticBlockedReason;
    this.blocked = rawCase.blocked;
    this.blockedDate = rawCase.blockedDate;
    this.blockedReason = rawCase.blockedReason;
    this.caseStatusHistory = rawCase.caseStatusHistory || [];
    this.caseNote = rawCase.caseNote;
    this.damages = rawCase.damages;
    this.highPriority = rawCase.highPriority;
    this.highPriorityReason = rawCase.highPriorityReason;
    this.judgeUserId = rawCase.judgeUserId;
    this.litigationCosts = rawCase.litigationCosts;
    this.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};
    this.noticeOfAttachments = rawCase.noticeOfAttachments || false;
    this.orderDesignatingPlaceOfTrial =
      rawCase.orderDesignatingPlaceOfTrial || false;
    this.orderForAmendedPetition = rawCase.orderForAmendedPetition || false;
    this.orderForAmendedPetitionAndFilingFee =
      rawCase.orderForAmendedPetitionAndFilingFee || false;
    this.orderForFilingFee = rawCase.orderForFilingFee || false;
    this.orderForCds = rawCase.orderForCds || false;
    this.orderForRatification = rawCase.orderForRatification || false;
    this.orderToShowCause = rawCase.orderToShowCause || false;

    this.assignArchivedDocketEntries({ applicationContext, rawCase });
    this.assignStatistics({ applicationContext, rawCase });
    this.assignCorrespondences({ rawCase });
  }

  static VALIDATION_RULES = {
    archivedCorrespondences: joi
      .array()
      .items(Correspondence.VALIDATION_RULES)
      .optional()
      .description('List of Correspondence Entities that were archived.'),
    archivedDocketEntries: joi
      .array()
      .items(DOCKET_ENTRY_VALIDATION_RULES)
      .optional()
      .description(
        'List of DocketEntry Entities that were archived instead of added to the docket record.',
      ),
    associatedJudge: JoiValidationConstants.STRING.max(50)
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('Judge assigned to this case. Defaults to Chief Judge.'),
    associatedJudgeId: joi
      .when('associatedJudge', {
        is: joi.valid(CHIEF_JUDGE),
        otherwise: JoiValidationConstants.UUID.required(),
        then: JoiValidationConstants.UUID.optional(),
      })
      .description('Judge ID assigned to this case.'),
    automaticBlocked: joi
      .boolean()
      .optional()
      .description(
        'Temporarily blocked from trial due to a pending item or due date.',
      ),
    automaticBlockedDate: JoiValidationConstants.ISO_DATE.when(
      'automaticBlocked',
      {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    automaticBlockedReason: JoiValidationConstants.STRING.valid(
      ...Object.values(AUTOMATIC_BLOCKED_REASONS),
    )
      .description('The reason the case was automatically blocked from trial.')
      .when('automaticBlocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    blocked: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] })
      .when('status', {
        is: CASE_STATUS_TYPES.calendared,
        otherwise: joi.optional(),
        then: joi.invalid(true),
      })
      .description('Temporarily blocked from trial.'),
    blockedDate: JoiValidationConstants.ISO_DATE.when('blocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).meta({ tags: ['Restricted'] }),
    blockedReason: JoiValidationConstants.STRING.max(250)
      .description(
        'Open text field for describing reason for blocking this case from trial.',
      )
      .when('blocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .meta({ tags: ['Restricted'] }),
    canAllowDocumentService: joi.boolean().optional(),
    canAllowPrintableDocketRecord: joi.boolean().optional(),
    caseCaption: CASE_CAPTION_RULE.messages({ '*': 'Enter a case caption' }),
    caseNote: JoiValidationConstants.STRING.max(9000)
      .optional()
      .meta({
        tags: ['Restricted'],
      })
      .messages({
        'string.max':
          'Limit is 9000 characters. Enter 9000 or fewer characters.',
      }),
    caseStatusHistory: joi
      .array()
      .required()
      .description('The history of status changes on the case'),
    caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES)
      .required()
      .messages({ '*': 'Select a case type' }),
    closedDate: JoiValidationConstants.ISO_DATE.when('status', {
      is: joi.exist().valid(...CLOSED_CASE_STATUSES),
      otherwise: joi.optional(),
      then: joi.required(),
    }),
    consolidatedCases: joi
      .array()
      .items(ConsolidatedCaseSummary.VALIDATION_RULES)
      .required()
      .description('List of consolidated cases for the case.'),
    correspondence: joi
      .array()
      .items(Correspondence.VALIDATION_RULES)
      .optional()
      .description('List of Correspondence documents for the case.'),
    createdAt: JoiValidationConstants.ISO_DATE.required().description(
      'When the paper or electronic case was added to the system. This value cannot be edited.',
    ),
    damages: joi
      .number()
      .optional()
      .allow(null)
      .description('Damages for the case.'),
    // docketEntries: 'At least one valid docket entry is required',
    docketEntries: joi
      .array()
      .items(DOCKET_ENTRY_VALIDATION_RULES)
      .required()
      .description('List of DocketEntry Entities for the case.'),
    docketNumber: CASE_DOCKET_NUMBER_RULE.messages({
      '*': 'Docket number is required',
    }),
    docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
      .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
      .optional(),
    docketNumberWithSuffix:
      JoiValidationConstants.STRING.optional().description(
        'Auto-generated from docket number and the suffix.',
      ),
    entityName: JoiValidationConstants.STRING.valid('Case').required(),
    filingType: JoiValidationConstants.STRING.valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    )
      .optional()
      .messages({ '*': 'Select on whose behalf you are filing' }),
    hasPendingItems: joi.boolean().optional(),
    hasVerifiedIrsNotice: joi
      .boolean()
      .optional()
      .allow(null)
      .description(
        'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
      )
      .messages({ '*': 'Indicate whether you received an IRS notice' }),
    highPriority: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] }),
    highPriorityReason: JoiValidationConstants.STRING.max(250)
      .when('highPriority', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .meta({ tags: ['Restricted'] }),
    initialCaption: JoiValidationConstants.CASE_CAPTION.allow(null)
      .optional()
      .description('Case caption before modification.'),
    initialDocketNumberSuffix: JoiValidationConstants.STRING.valid(
      ...Object.values(DOCKET_NUMBER_SUFFIXES),
      '_',
    )
      .allow(null)
      .optional()
      .description('Case docket number suffix before modification.'),
    irsNoticeDate: JoiValidationConstants.ISO_DATE.max('now')
      .optional()
      .allow(null)
      .description('Last date that the petitioner is allowed to file before.')
      .messages({
        '*': 'Please enter a valid IRS notice date',
        'date.max':
          'The IRS notice date cannot be in the future. Enter a valid date.',
      }),
    irsPractitioners: CASE_IRS_PRACTITIONERS_RULE,
    isPaper: joi.boolean().optional(),
    isSealed: CASE_IS_SEALED_RULE,
    judgeUserId: JoiValidationConstants.UUID.optional().description(
      'Unique ID for the associated judge.',
    ),
    leadDocketNumber: CASE_LEAD_DOCKET_NUMBER_RULE,
    litigationCosts: joi
      .number()
      .optional()
      .allow(null)
      .description('Litigation costs for the case.'),
    mailingDate: JoiValidationConstants.STRING.max(25)
      .when('isPaper', {
        is: true,
        otherwise: joi.allow(null).optional(),
        then: joi.required(),
      })
      .description('Date that petition was mailed to the court.')
      .messages({ '*': 'Enter a mailing date' }),
    noticeOfAttachments: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the notice of attachments.'),
    noticeOfTrialDate: JoiValidationConstants.ISO_DATE.optional().description(
      'Reminder for clerks to review the notice of trial date.',
    ),
    orderDesignatingPlaceOfTrial: joi
      .boolean()
      .optional()
      .description(
        'Reminder for clerks to review the Order Designating Place of Trial.',
      ),
    orderForAmendedPetition: joi
      .boolean()
      .optional()
      .description(
        'Reminder for clerks to review the order for amended Petition.',
      ),
    orderForAmendedPetitionAndFilingFee: joi
      .boolean()
      .optional()
      .description(
        'Reminder for clerks to review the order for amended Petition And filing fee.',
      ),
    orderForCds: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the order for CDS.'),
    orderForFilingFee: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the order for filing fee.'),
    orderForRatification: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the Order for Ratification.'),
    orderToShowCause: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the Order to Show Cause.'),
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    )
      .required()
      .description('Party type of the case petitioner.')
      .messages({ '*': 'Select a party type' }),
    petitionPaymentDate: JoiValidationConstants.ISO_DATE.when(
      'petitionPaymentStatus',
      {
        is: PAYMENT_STATUS.PAID,
        otherwise: joi.optional().allow(null),
        then: JoiValidationConstants.ISO_DATE.max('now').required(),
      },
    )
      .description('When the petitioner paid the case fee.')
      .messages({ '*': 'Enter a valid payment date' }),
    petitionPaymentMethod: JoiValidationConstants.STRING.max(50)
      .when('petitionPaymentStatus', {
        is: PAYMENT_STATUS.PAID,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .description('How the petitioner paid the case fee.')
      .messages({ '*': 'Enter payment method' }),
    petitionPaymentStatus: JoiValidationConstants.STRING.valid(
      ...Object.values(PAYMENT_STATUS),
    )
      .required()
      .description('Status of the case fee payment.')
      .messages({ '*': 'Enter payment status' }),
    petitionPaymentWaivedDate: JoiValidationConstants.ISO_DATE.when(
      'petitionPaymentStatus',
      {
        is: PAYMENT_STATUS.WAIVED,
        otherwise: joi.allow(null).optional(),
        then: JoiValidationConstants.ISO_DATE.max('now').required(),
      },
    )
      .description('When the case fee was waived.')
      .messages({ '*': 'Enter a valid date waived' }),
    petitioners: CASE_PETITIONERS_RULE.messages({
      ['array.unique']:
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    }),
    preferredTrialCity: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(
          ...TRIAL_CITY_STRINGS,
          ...LEGACY_TRIAL_CITY_STRINGS,
          null,
        ),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .optional()
      .description('Where the petitioner would prefer to hold the case trial.')
      .messages({ '*': 'Select a trial location' }),
    privatePractitioners: CASE_PRIVATE_PRACTITIONERS_RULE,
    procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
      .required()
      .description('Procedure type of the case.')
      .messages({ '*': 'Select a case procedure' }),
    qcCompleteForTrial: joi
      .object()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description(
        'QC Checklist object that must be completed before the case can go to trial.',
      ),
    receivedAt: JoiValidationConstants.ISO_DATE.required()
      .description(
        'When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited.',
      )
      .messages({
        '*': 'Enter a valid date received',
        'date.max':
          'Date received cannot be in the future. Enter a valid date.',
      }),
    sealedDate: JoiValidationConstants.ISO_DATE.optional()
      .allow(null)
      .description('When the case was sealed from the public.'),
    sortableDocketNumber: CASE_SORTABLE_DOCKET_NUMBER_RULE.messages({
      '*': 'Sortable docket number is required',
    }),
    statistics: joi
      .array()
      .items(Statistic.VALIDATION_RULES)
      .when('hasVerifiedIrsNotice', {
        is: true,
        otherwise: joi.optional(),
        then: joi.when('caseType', {
          is: CASE_TYPES_MAP.deficiency,
          otherwise: joi.optional(),
          then: joi.array().min(1).required(),
        }),
      })
      .description('List of Statistic Entities for the case.'),
    status: CASE_STATUS_RULE,
    trialDate: joi
      .alternatives()
      .conditional('trialSessionId', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.ISO_DATE.optional().allow(null),
        then: JoiValidationConstants.ISO_DATE.required(),
      })
      .description('When this case goes to trial.'),
    trialLocation: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
        JoiValidationConstants.STRING.valid('Standalone Remote'),
      )
      .optional()
      .description(
        'Where this case goes to trial. This may be different that the preferred trial location.',
      ),
    trialSessionId: joi
      .when('status', {
        is: CASE_STATUS_TYPES.calendared,
        otherwise: joi.when('trialDate', {
          is: joi.exist().not(null),
          otherwise: JoiValidationConstants.UUID.optional(),
          then: JoiValidationConstants.UUID.required(),
        }),
        then: JoiValidationConstants.UUID.required(),
      })
      .description(
        'The unique ID of the trial session associated with this case.',
      ),
    trialTime: JoiValidationConstants.STRING.pattern(PATTERNS['H:MM'])
      .optional()
      .description('Time of day when this case goes to trial.'),
    useSameAsPrimary: joi
      .boolean()
      .optional()
      .description(
        'Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process).',
      ),
  };

  getValidationRules() {
    return Case.VALIDATION_RULES;
  }

  assignFieldsForAllUsers({ rawCase }) {
    this.caseCaption = rawCase.caseCaption;
    this.caseType = rawCase.caseType;
    this.closedDate = rawCase.closedDate;
    this.createdAt = rawCase.createdAt || createISODateString();
    if (rawCase.docketNumber) {
      this.docketNumber = Case.formatDocketNumber(rawCase.docketNumber);
    }
    this.docketNumberSuffix = getDocketNumberSuffix(rawCase);
    this.filingType = rawCase.filingType;
    this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
    this.irsNoticeDate = rawCase.irsNoticeDate;
    this.isPaper = rawCase.isPaper;
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.mailingDate = rawCase.mailingDate;
    this.partyType = rawCase.partyType;
    this.petitionPaymentDate = rawCase.petitionPaymentDate;
    this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
    this.petitionPaymentStatus =
      rawCase.petitionPaymentStatus || PAYMENT_STATUS.UNPAID;
    this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;
    this.receivedAt = rawCase.receivedAt || createISODateString();
    this.sealedDate = rawCase.sealedDate;
    this.status = rawCase.status || CASE_STATUS_TYPES.new;
    this.sortableDocketNumber =
      rawCase.sortableDocketNumber ||
      Case.getSortableDocketNumber(rawCase.docketNumber);
    this.trialDate = rawCase.trialDate;
    this.trialLocation = rawCase.trialLocation;
    this.trialSessionId = rawCase.trialSessionId;
    this.trialTime = rawCase.trialTime;
    this.useSameAsPrimary = rawCase.useSameAsPrimary;

    this.initialDocketNumberSuffix =
      rawCase.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

    if (rawCase.caseCaption) {
      this.initialCaption = rawCase.initialCaption || this.caseCaption;
    }

    this.hasPendingItems = this.docketEntries.some(docketEntry =>
      DocketEntry.isPending(docketEntry),
    );

    this.noticeOfTrialDate = rawCase.noticeOfTrialDate;

    this.docketNumberWithSuffix =
      this.docketNumber + (this.docketNumberSuffix || '');

    this.canAllowDocumentService = rawCase.canAllowDocumentService;
    this.canAllowPrintableDocketRecord = rawCase.canAllowPrintableDocketRecord;
  }

  assignArchivedDocketEntries({ applicationContext, rawCase }) {
    if (Array.isArray(rawCase.archivedDocketEntries)) {
      this.archivedDocketEntries = rawCase.archivedDocketEntries.map(
        docketEntry =>
          new DocketEntry(docketEntry, {
            applicationContext,
            petitioners: this.petitioners,
          }),
      );
    } else {
      this.archivedDocketEntries = [];
    }
  }

  assignDocketEntries({ applicationContext, filtered, rawCase }) {
    if (Array.isArray(rawCase.docketEntries)) {
      this.docketEntries = rawCase.docketEntries
        .map(
          docketEntry =>
            new DocketEntry(docketEntry, {
              applicationContext,
              filtered,
              petitioners: this.petitioners,
            }),
        )
        .sort((a, b) => compareStrings(a.createdAt, b.createdAt));

      this.isSealed = isSealedCase(rawCase);

      if (
        filtered &&
        applicationContext.getCurrentUser().role !== ROLES.irsSuperuser &&
        (applicationContext.getCurrentUser().role !== ROLES.petitionsClerk ||
          this.getIrsSendDate())
      ) {
        this.docketEntries = this.docketEntries.filter(
          d => d.documentType !== INITIAL_DOCUMENT_TYPES.stin.documentType,
        );
      }
    } else {
      this.docketEntries = [];
    }
  }

  assignHearings({ applicationContext, rawCase }) {
    if (Array.isArray(rawCase.hearings)) {
      this.hearings = rawCase.hearings
        .map(hearing => new TrialSession(hearing, { applicationContext }))
        .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
    } else {
      this.hearings = [];
    }
  }

  hasPrivatePractitioners() {
    return this.privatePractitioners.length > 0;
  }

  assignContacts({ applicationContext, rawCase }) {
    if (!rawCase.status || rawCase.status === CASE_STATUS_TYPES.new) {
      const contacts = ContactFactory({
        applicationContext,
        contactInfo: {
          primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
          secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
        },
        partyType: rawCase.partyType,
      });

      this.petitioners.push(contacts.primary);
      if (contacts.secondary) {
        this.petitioners.push(contacts.secondary);
      }
    } else {
      if (Array.isArray(rawCase.petitioners)) {
        this.petitioners = rawCase.petitioners.map(
          petitioner => new Petitioner(petitioner, { applicationContext }),
        );

        setAdditionalNameOnPetitioners({ obj: this, rawCase });
      }
    }
  }

  assignPractitioners({ rawCase }) {
    if (Array.isArray(rawCase.privatePractitioners)) {
      this.privatePractitioners = rawCase.privatePractitioners.map(
        practitioner => new PrivatePractitioner(practitioner),
      );
    } else {
      this.privatePractitioners = [];
    }

    if (Array.isArray(rawCase.irsPractitioners)) {
      this.irsPractitioners = rawCase.irsPractitioners.map(
        practitioner => new IrsPractitioner(practitioner),
      );
    } else {
      this.irsPractitioners = [];
    }
  }

  assignStatistics({ applicationContext, rawCase }) {
    if (Array.isArray(rawCase.statistics)) {
      this.statistics = rawCase.statistics.map(
        statistic => new Statistic(statistic, { applicationContext }),
      );
    } else {
      this.statistics = [];
    }
  }

  private assignConsolidatedCases({ rawCase }): void {
    const consolidatedCases = rawCase.consolidatedCases || [];
    this.consolidatedCases = consolidatedCases.map(
      consolidatedCase => new ConsolidatedCaseSummary(consolidatedCase),
    );
  }

  assignCorrespondences({ rawCase }) {
    if (Array.isArray(rawCase.correspondence)) {
      this.correspondence = rawCase.correspondence
        .map(correspondence => new Correspondence(correspondence))
        .sort((a, b) => compareStrings(a.filingDate, b.filingDate));
    } else {
      this.correspondence = [];
    }

    if (Array.isArray(rawCase.archivedCorrespondences)) {
      this.archivedCorrespondences = rawCase.archivedCorrespondences.map(
        correspondence => new Correspondence(correspondence),
      );
    } else {
      this.archivedCorrespondences = [];
    }
  }

  static getCaseCaption(rawCase) {
    const primaryContact = clone(
      getContactPrimary(rawCase) || rawCase.contactPrimary,
    );
    const secondaryContact = clone(
      getContactSecondary(rawCase) || rawCase.contactSecondary,
    );

    // trim ALL white space from these non-validated strings
    if (primaryContact?.name) {
      primaryContact.name = primaryContact.name.trim();
    }
    if (primaryContact?.secondaryName) {
      primaryContact.secondaryName = primaryContact.secondaryName.trim();
    }
    if (primaryContact?.title) {
      primaryContact.title = primaryContact.title.trim();
    }
    if (secondaryContact?.name) {
      secondaryContact.name = secondaryContact.name.trim();
    }

    return generateCaptionFromContacts({
      partyType: rawCase.partyType,
      primaryContact,
      secondaryContact,
    });
  }

  toRawObject(processPendingItems = true) {
    const result = this.toRawObjectFromJoi();

    if (processPendingItems) {
      (result as any).hasPendingItems = this.doesHavePendingItems();
    }

    return result;
  }

  doesHavePendingItems() {
    return this.docketEntries.some(docketEntry =>
      DocketEntry.isPending(docketEntry),
    );
  }

  /**
   * get the case caption without the ", Petitioner/s/(s)" postfix
   * @param {string} caseCaption the original case caption
   * @returns {string} caseTitle the case caption with the postfix removed
   */
  static getCaseTitle(caseCaption): string {
    return caseCaption.replace(/\s*,\s*Petitioner(s|\(s\))?\s*$/, '').trim();
  }

  /**
   * attaches an IRS practitioner to the case
   * @param {string} practitioner the irsPractitioner to add to the case
   */
  attachIrsPractitioner(practitioner) {
    this.irsPractitioners.push(practitioner);
  }

  archiveDocketEntry(docketEntry: DocketEntry) {
    if (DocketEntry.isServed(docketEntry) || docketEntry.isOnDocketRecord) {
      throw new UnprocessableEntityError(
        'Cannot archive docket entry that has already been served.',
      );
    }
    docketEntry.archive();
    this.archivedDocketEntries.push(docketEntry);
    this.deleteDocketEntryById({
      docketEntryId: docketEntry.docketEntryId,
    });
  }

  /**
   * archives a correspondence document and adds it to the archivedCorrespondences array on the case
   * @param {string} correspondence the correspondence to archive
   */
  archiveCorrespondence(correspondenceEntity) {
    correspondenceEntity.archived = true;
    this.archivedCorrespondences.push(correspondenceEntity);
    this.deleteCorrespondenceById({
      correspondenceId: correspondenceEntity.correspondenceId,
    });
  }

  /**
   * updates an IRS practitioner on the case
   * @param {string} practitionerToUpdate the irsPractitioner user object with updated info
   * @returns {void} modifies the irsPractitioners array on the case
   */
  updateIrsPractitioner(practitionerToUpdate) {
    const foundPractitioner = this.irsPractitioners.find(
      practitioner => practitioner.userId === practitionerToUpdate.userId,
    );
    if (foundPractitioner)
      Object.assign(foundPractitioner, practitionerToUpdate);
  }

  /**
   * removes the given IRS practitioner from the case
   * @param {string} practitionerToRemove the irsPractitioner user object to remove from the case
   * @returns {Case} the modified case entity
   */
  removeIrsPractitioner(practitionerToRemove) {
    const index = this.irsPractitioners.findIndex(
      practitioner => practitioner.userId === practitionerToRemove.userId,
    );
    if (index > -1) this.irsPractitioners.splice(index, 1);
    return this;
  }

  /**
   * attaches a private practitioner to the case
   * @param {string} practitioner the privatePractitioner to add to the case
   */
  attachPrivatePractitioner(practitioner) {
    this.privatePractitioners.push(practitioner);
  }

  /**
   * updates a private practitioner on the case
   * @param {string} practitionerToUpdate the practitioner user object with updated info
   */
  updatePrivatePractitioner(practitionerToUpdate) {
    const foundPractitioner = this.privatePractitioners.find(
      practitioner => practitioner.userId === practitionerToUpdate.userId,
    );
    if (foundPractitioner)
      Object.assign(foundPractitioner, practitionerToUpdate);
  }

  /**
   * removes the given private practitioner from the case
   * @param {string} practitionerToRemove the practitioner user object to remove from the case
   */
  removePrivatePractitioner(practitionerToRemove) {
    const index = this.privatePractitioners.findIndex(
      practitioner => practitioner.userId === practitionerToRemove.userId,
    );
    if (index > -1) this.privatePractitioners.splice(index, 1);
  }

  /**
   *
   * @param {object} docketEntryEntity the docket entry to add to the case
   */
  addDocketEntry(docketEntryEntity) {
    docketEntryEntity.docketNumber = this.docketNumber;

    if (docketEntryEntity.isOnDocketRecord) {
      const updateIndex = shouldGenerateDocketRecordIndex({
        caseDetail: this,
        docketEntry: docketEntryEntity,
      });

      if (updateIndex) {
        docketEntryEntity.index = this.generateNextDocketRecordIndex();
      } else if (
        docketEntryEntity.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode
      ) {
        throw new Error('STIN documents should not be on the docket record.');
      }
    } else if (
      docketEntryEntity.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode
    ) {
      docketEntryEntity.index = 0;
    }

    this.docketEntries = [...this.docketEntries, docketEntryEntity];
  }

  /**
   * Determines if the case has been closed
   * @returns {Boolean} true if the case has been closed, false otherwise
   */
  isClosed() {
    return isClosed(this);
  }

  /**
   *
   * @returns {Case} the updated case entity
   */
  markAsSentToIRS() {
    this.setCaseStatus({
      changedBy: SYSTEM_ROLE,
      updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
    });

    this.petitioners.map(p => {
      if (PETITIONER_CONTACT_TYPES.includes(p.contactType)) {
        p.contactType = CONTACT_TYPES.petitioner;
      }
    });

    return this;
  }

  /**
   *
   * @returns {Case} the updated case entity
   */
  updateCaseCaptionDocketRecord({ applicationContext }) {
    const caseCaptionRegex =
      /^Caption of case is amended from '(.*)' to '(.*)'/;
    let lastCaption = this.initialCaption;

    this.docketEntries.forEach(docketEntry => {
      const result = caseCaptionRegex.exec(docketEntry.documentTitle);
      if (result) {
        const [, , changedCaption] = result;
        lastCaption = changedCaption.replace(` ${CASE_CAPTION_POSTFIX}`, '');
      }
    });

    const needsCaptionChangedRecord =
      this.initialCaption && lastCaption !== this.caseCaption && !this.isPaper;

    if (needsCaptionChangedRecord) {
      const user = applicationContext.getCurrentUser();

      const mincDocketEntry = new DocketEntry(
        {
          documentTitle: `Caption of case is amended from '${lastCaption} ${CASE_CAPTION_POSTFIX}' to '${this.caseCaption} ${CASE_CAPTION_POSTFIX}'`,
          documentType: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.documentType,
          eventCode: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.eventCode,
          filingDate: createISODateString(),
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
        },
        { applicationContext, petitioners: this.petitioners },
      );

      mincDocketEntry.setFiledBy(user);

      this.addDocketEntry(mincDocketEntry);
    }

    return this;
  }

  /**
   *
   * @returns {Case} the updated case entity
   */
  updateDocketNumberRecord({ applicationContext }) {
    const docketNumberRegex = /^Docket Number is amended from '(.*)' to '(.*)'/;

    let lastDocketNumber =
      this.docketNumber +
      (this.initialDocketNumberSuffix !== '_'
        ? this.initialDocketNumberSuffix
        : '');

    const newDocketNumber = this.docketNumber + (this.docketNumberSuffix || '');

    this.docketEntries.forEach(docketEntry => {
      const result = docketNumberRegex.exec(docketEntry.documentTitle);
      if (result) {
        const [, , changedDocketNumber] = result;
        lastDocketNumber = changedDocketNumber;
      }
    });

    const needsDocketNumberChangeRecord =
      lastDocketNumber !== newDocketNumber && !this.isPaper;

    if (needsDocketNumberChangeRecord) {
      const user = applicationContext.getCurrentUser();

      const mindDocketEntry = new DocketEntry(
        {
          documentTitle: `Docket Number is amended from '${lastDocketNumber}' to '${newDocketNumber}'`,
          documentType: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.documentType,
          eventCode: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.eventCode,
          filingDate: createISODateString(),
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
        },
        { applicationContext, petitioners: this.petitioners },
      );

      mindDocketEntry.setFiledBy(user);

      this.addDocketEntry(mindDocketEntry);
    }

    return this;
  }

  /**
   * gets the docketEntry with id docketEntryId from the docketEntries array
   * @params {object} params the params object
   * @params {string} params.docketEntryId the id of the docketEntry to retrieve
   * @returns {object} the retrieved docketEntry
   */
  getDocketEntryById({ docketEntryId }) {
    return this.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === docketEntryId,
    );
  }

  /**
   * gets the petitioner with id contactId from the petitioners array
   * @params {object} params the params object
   * @params {string} params.contactId the id of the petitioner to retrieve
   * @returns {object} the retrieved petitioner
   */
  getPetitionerById(contactId) {
    return getPetitionerById(this, contactId);
  }

  /**
   * checks if the case is eligible for service.
   * @returns {boolean} if the case is eligible or not
   */
  shouldGenerateNoticesForCase() {
    return shouldGenerateNoticesForCase(this);
  }

  /**
   * gets the petitioner with email userEmail from the petitioners array
   * @params {object} params the params object
   * @params {string} params.userEmail the email of the petitioner to retrieve
   * @returns {object} the retrieved petitioner
   */
  getPetitionerByEmail(userEmail) {
    return getPetitionerByEmail(this, userEmail);
  }
  /**
   * adds the petitioner to the petitioners array
   * @params {object} petitioner the petitioner to add to the case
   * @returns {Case} the updated case
   */
  addPetitioner(petitioner) {
    this.petitioners.push(petitioner);
    return this;
  }

  /**
   * removes the contact from the practitioner they are presenting
   * @params {string} petitionerContactId the id of the petitioner
   */
  removeRepresentingFromPractitioners(petitionerContactId) {
    this.privatePractitioners.forEach(practitioner => {
      const representingArrayIndex =
        practitioner.representing.indexOf(petitionerContactId);
      if (representingArrayIndex >= 0) {
        practitioner.representing.splice(representingArrayIndex, 1);
      }
    });
  }

  /**
   * returns the practitioner representing a petitioner
   * @params {string} petitionerContactId the id of the petitioner
   * @returns {Object} the practitioner
   */
  getPractitionersRepresenting(petitionerContactId: string) {
    return getPractitionersRepresenting(this, petitionerContactId);
  }

  /**
   * removes the petitioner from the petitioners array
   * @params {object} contactId the contactId of the petitioner to remove from the case
   */
  removePetitioner(contactId) {
    this.petitioners = this.petitioners.filter(
      petitioner => petitioner.contactId !== contactId,
    );
  }

  /**
   * gets the correspondence with id correspondenceId from the correspondence array
   * @params {object} params the params object
   * @params {string} params.correspondenceId the id of the correspondence to retrieve
   * @returns {object} the retrieved correspondence
   */
  getCorrespondenceById({ correspondenceId }) {
    return this.correspondence.find(
      correspondence => correspondence.correspondenceId === correspondenceId,
    );
  }

  /**
   * deletes the docket entry with id docketEntryId from the docketEntries array
   * @params {object} params the params object
   * @params {string} params.docketEntryId the id of the docket entry to remove from the docketEntries array
   * @returns {Case} the updated case entity
   */
  deleteDocketEntryById({ docketEntryId }) {
    this.docketEntries = this.docketEntries.filter(
      item => item.docketEntryId !== docketEntryId,
    );

    return this;
  }

  /**
   * deletes the correspondence with id correspondenceId from the correspondence array
   * @params {object} params the params object
   * @params {string} params.correspondenceId the id of the correspondence to remove from the correspondence array
   * @returns {Case} the updated case entity
   */
  deleteCorrespondenceById({ correspondenceId }) {
    this.correspondence = this.correspondence.filter(
      item => item.correspondenceId !== correspondenceId,
    );

    return this;
  }

  getPetitionDocketEntry() {
    return getPetitionDocketEntry(this);
  }

  getIrsSendDate() {
    const petitionDocketEntry = this.getPetitionDocketEntry();
    if (petitionDocketEntry) {
      return petitionDocketEntry.servedAt;
    }
  }

  /**
   * update as automaticBlocked with an automaticBlockedReason based on
   * provided case deadlines and pending items
   * @param {object} caseDeadlines - the case deadlines
   * @returns {Case} the updated case entity
   */
  updateAutomaticBlocked({ caseDeadlines }) {
    const hasPendingItems = this.doesHavePendingItems();
    let automaticBlockedReason;
    if (hasPendingItems && !isEmpty(caseDeadlines)) {
      automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
    } else if (hasPendingItems) {
      automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
    } else if (!isEmpty(caseDeadlines)) {
      automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.dueDate;
    }
    if (automaticBlockedReason) {
      this.automaticBlocked = true;
      this.automaticBlockedDate = createISODateString();
      this.automaticBlockedReason = automaticBlockedReason;
    } else {
      this.automaticBlocked = false;
      this.automaticBlockedDate = undefined;
      this.automaticBlockedReason = undefined;
    }
    return this;
  }

  /**
   * set as high priority with a highPriorityReason
   * @param {string} highPriorityReason - the reason the case was set to high priority
   * @returns {Case} the updated case entity
   */
  setAsHighPriority(highPriorityReason) {
    this.highPriority = true;
    this.highPriorityReason = highPriorityReason;
    return this;
  }

  /**
   * unset as high priority and remove the highPriorityReason
   * @returns {Case} the updated case entity
   */
  unsetAsHighPriority() {
    this.highPriority = false;
    this.highPriorityReason = undefined;
    return this;
  }

  removeFromTrial({
    associatedJudge = CHIEF_JUDGE,
    associatedJudgeId = undefined,
    changedBy,
    updatedCaseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial,
  }: {
    associatedJudge?: string;
    associatedJudgeId?: string;
    changedBy?: string;
    updatedCaseStatus?: CaseStatus;
  }): Case {
    this.setAssociatedJudge(associatedJudge);

    this.setAssociatedJudgeId(associatedJudgeId);
    this.setCaseStatus({
      changedBy,
      updatedCaseStatus,
    });
    this.trialDate = undefined;
    this.trialLocation = undefined;
    this.trialSessionId = undefined;
    this.trialTime = undefined;

    return this;
  }

  /**
   * check to see if trialSessionId is a hearing
   * @param {string} trialSessionId trial session id to check
   * @returns {boolean} whether or not the trial session id associated is a hearing or not
   */
  isHearing(trialSessionId) {
    return this.hearings.some(
      trialSession => trialSession.trialSessionId === trialSessionId,
    );
  }

  /**
   * removes a hearing from the case.hearings array
   * @param {string} trialSessionId trial session id associated with hearing to remove
   */
  removeFromHearing(trialSessionId) {
    const removeIndex = this.hearings
      .map(trialSession => trialSession.trialSessionId)
      .indexOf(trialSessionId);

    this.hearings.splice(removeIndex, 1);
  }

  removeFromTrialWithAssociatedJudge(judgeData?: {
    associatedJudge: string;
    associatedJudgeId: string;
  }): Case {
    if (judgeData && judgeData.associatedJudge) {
      this.associatedJudge = judgeData.associatedJudge;
      this.associatedJudgeId = judgeData.associatedJudgeId;
    }

    this.trialDate = undefined;
    this.trialLocation = undefined;
    this.trialSessionId = undefined;
    this.trialTime = undefined;
    return this;
  }

  /**
   * set associated judge
   * @param {string} associatedJudge the judge to associate with the case
   * @returns {Case} the updated case entity
   */
  setAssociatedJudge(associatedJudge) {
    this.associatedJudge = associatedJudge;
    return this;
  }

  setAssociatedJudgeId(associatedJudgeId) {
    this.associatedJudgeId = associatedJudgeId;
    return this;
  }

  /**
   * set case status
   * @param {string} updatedCaseStatus the case status to update
   * @returns {Case} the updated case entity
   */
  setCaseStatus({ changedBy = SYSTEM_ROLE, updatedCaseStatus }) {
    const previousCaseStatus = this.status;
    const date = createISODateString();

    this.status = updatedCaseStatus;
    this.caseStatusHistory.push({
      changedBy,
      date,
      updatedCaseStatus,
    });

    if (
      [
        CASE_STATUS_TYPES.generalDocket,
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
      ].includes(updatedCaseStatus)
    ) {
      this.associatedJudge = CHIEF_JUDGE;
      this.associatedJudgeId = undefined;
    }

    if (isClosedStatus(updatedCaseStatus)) {
      this.closedDate = date;
      this.unsetAsBlocked();
      this.unsetAsHighPriority();
    } else {
      if (isClosedStatus(previousCaseStatus)) {
        this.closedDate = undefined;
      }
    }

    return this;
  }

  /**
   * set case caption
   * @param {string} caseCaption the case caption to update
   * @returns {Case} the updated case entity
   */
  setCaseCaption(caseCaption) {
    this.caseCaption = caseCaption;
    return this;
  }

  /**
   * get consolidation status between current case entity and another case entity
   * @param {object} caseEntity the pending case entity to check
   * @returns {object} object with canConsolidate flag and reason string
   */
  getConsolidationStatus({ caseEntity }) {
    let canConsolidate = true;
    const reason = [] as string[];

    if (!this.canConsolidate(caseEntity)) {
      return {
        canConsolidate: false,
        reason: [
          `Case status is ${caseEntity.status} and cannot be consolidated`,
        ],
      };
    }

    if (this.docketNumber === caseEntity.docketNumber) {
      canConsolidate = false;
      reason.push('Cases are the same');
    }

    if (this.status !== caseEntity.status) {
      canConsolidate = false;
      reason.push('Case status is not the same');
    }

    if (this.procedureType !== caseEntity.procedureType) {
      canConsolidate = false;
      reason.push('Case procedure is not the same');
    }

    if (this.preferredTrialCity !== caseEntity.preferredTrialCity) {
      canConsolidate = false;
      reason.push('Place of trial is not the same');
    }

    if (this.associatedJudge !== caseEntity.associatedJudge) {
      canConsolidate = false;
      reason.push('Judge is not the same');
    }

    return { canConsolidate, reason };
  }

  /**
   * checks case eligibility for consolidation by the current case's status
   * @returns {boolean} true if eligible for consolidation, false otherwise
   * @param {object} caseToConsolidate (optional) case to check for consolidation eligibility
   */
  canConsolidate(caseToConsolidate) {
    const ineligibleStatusTypes = [
      CASE_STATUS_TYPES.new,
      CASE_STATUS_TYPES.generalDocket,
      CASE_STATUS_TYPES.onAppeal,
      ...CLOSED_CASE_STATUSES,
    ];

    const caseToCheck = caseToConsolidate || this;

    return !ineligibleStatusTypes.includes(caseToCheck.status);
  }

  /**
   * sets lead docket number on the current case
   * @param {string} leadDocketNumber the docketNumber of the lead case for consolidation
   * @returns {Case} the updated Case entity
   */
  setLeadCase(leadDocketNumber) {
    this.leadDocketNumber = leadDocketNumber;
    return this;
  }

  /**
   * removes the consolidation from the case by setting leadDocketNumber to undefined
   * @returns {Case} the updated Case entity
   */
  removeConsolidation() {
    this.leadDocketNumber = undefined;
    return this;
  }

  /**
   * Returns the primary contact on the case
   * @returns {Object} the primary contact object on the case
   */
  getContactPrimary() {
    return getContactPrimary(this);
  }

  /**
   * Checks if the provided userId is a private practitioner or irs practitioner on the case.
   * @param {string} userId the userId of the user to check
   * @returns  {boolean} if the userId is a private practitioner or irs practitioner on the case
   */
  isPractitioner(userId) {
    return (
      this.privatePractitioners.some(p => p.userId === userId) ||
      this.irsPractitioners.some(p => p.userId === userId)
    );
  }

  /**
   * Returns the secondary contact on the case
   * @returns {Object} the secondary contact object on the case
   */
  getContactSecondary() {
    return getContactSecondary(this);
  }

  /**
   * Returns the other filers on the case
   * @returns {Array} the other filers on the case
   */
  getOtherFilers() {
    return getOtherFilers(this);
  }

  /**
   * gets the next possible (unused) index for the docket record
   * @returns {number} the next docket record index
   */
  generateNextDocketRecordIndex() {
    const nextIndex =
      this.docketEntries
        .filter(d => d.isOnDocketRecord && d.index !== undefined)
        .sort((a, b) => a.index - b.index).length + 1;
    return nextIndex;
  }

  /**
   *
   * @param {DocketEntry} updatedDocketEntry the docket entry to update on the case
   * @returns {Case} the updated case entity
   */
  updateDocketEntry(updatedDocketEntry) {
    const foundDocketEntryIndex = this.docketEntries.findIndex(
      docketEntry =>
        docketEntry.docketEntryId === updatedDocketEntry.docketEntryId,
    );

    if (foundDocketEntryIndex !== -1) {
      this.docketEntries[foundDocketEntryIndex] = updatedDocketEntry;

      if (updatedDocketEntry.isOnDocketRecord) {
        const updateIndex = shouldGenerateDocketRecordIndex({
          caseDetail: this,
          docketEntry: updatedDocketEntry,
        });

        if (updateIndex) {
          updatedDocketEntry.index = this.generateNextDocketRecordIndex();
        }
      }
    }

    return this;
  }

  /**
   * check a case to see whether it should change to ready for trial and update the
   * status to General Docket - Ready for Trial if so
   * @returns {Case} the updated case entity
   */
  checkForReadyForTrial() {
    const currentDate = prepareDateFromString().toISO();

    const isCaseGeneralDocketNotAtIssue =
      this.status === CASE_STATUS_TYPES.generalDocket;

    if (isCaseGeneralDocketNotAtIssue) {
      this.docketEntries.forEach(docketEntry => {
        const isAnswerDocument = includes(
          ANSWER_DOCUMENT_CODES,
          docketEntry.eventCode,
        );

        const daysElapsedSinceDocumentWasFiled = calculateDifferenceInDays(
          currentDate!,
          docketEntry.createdAt,
        );

        const requiredTimeElapsedSinceFiling =
          daysElapsedSinceDocumentWasFiled > ANSWER_CUTOFF_AMOUNT_IN_DAYS;

        if (isAnswerDocument && requiredTimeElapsedSinceFiling) {
          this.setCaseStatus({
            updatedCaseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
          });
        }
      });
    }

    return this;
  }

  /**
   * generates sort tags used for sorting trials for calendaring
   * @returns {object} the sort tags
   */
  generateTrialSortTags() {
    const {
      caseType,
      docketNumber,
      highPriority,
      preferredTrialCity,
      procedureType,
      receivedAt,
    } = this;

    const caseProcedureSymbol =
      procedureType.toLowerCase() === 'regular' ? 'R' : 'S';

    let casePrioritySymbol = 'D';

    if (highPriority === true) {
      casePrioritySymbol = 'A';
    } else if (caseType.toLowerCase() === 'cdp (lien/levy)') {
      casePrioritySymbol = 'B';
    } else if (caseType.toLowerCase() === 'passport') {
      casePrioritySymbol = 'C';
    }

    const formattedFiledTime = formatDateString(
      receivedAt,
      FORMATS.TRIAL_SORT_TAG,
    );
    const formattedTrialCity = preferredTrialCity.replace(/[\s.,]/g, '');

    const nonHybridSortKey = [
      formattedTrialCity,
      caseProcedureSymbol,
      casePrioritySymbol,
      formattedFiledTime,
      docketNumber,
    ].join('-');

    const hybridSortKey = [
      formattedTrialCity,
      'H', // Hybrid Tag
      casePrioritySymbol,
      formattedFiledTime,
      docketNumber,
    ].join('-');

    return {
      hybrid: hybridSortKey,
      nonHybrid: nonHybridSortKey,
    };
  }

  /**
   * set as calendared
   * @param {object} trialSessionEntity - the trial session that is associated with the case
   * @returns {Case} the updated case entity
   */
  setAsCalendared(trialSessionEntity) {
    this.updateTrialSessionInformation(trialSessionEntity);
    if (trialSessionEntity.isCalendared === true) {
      this.setCaseStatus({
        changedBy: SYSTEM_ROLE,
        updatedCaseStatus: CASE_STATUS_TYPES.calendared,
      });
    }
    return this;
  }

  /**
   * update trial session information
   * @param {object} trialSessionEntity - the trial session that is associated with the case
   * @returns {Case} the updated case entity
   */
  updateTrialSessionInformation(trialSessionEntity) {
    if (
      trialSessionEntity.isCalendared &&
      trialSessionEntity.judge &&
      trialSessionEntity.judge.name
    ) {
      this.associatedJudge = trialSessionEntity.judge.name;
      this.associatedJudgeId = trialSessionEntity.judge.userId;
    }

    this.trialSessionId = trialSessionEntity.trialSessionId;
    this.trialDate = trialSessionEntity.startDate;
    this.trialTime = trialSessionEntity.startTime;
    this.trialLocation = trialSessionEntity.trialLocation;

    return this;
  }

  /**
   * Updates the specified contact object in the case petitioner's array
   * @param {object} arguments.updatedPetitioner the updated petitioner object
   */
  updatePetitioner(updatedPetitioner) {
    updatePetitioner(this, updatedPetitioner);
  }

  /**
   * Determines if provided user is associated with the case
   * @param {object} arguments.user the user account
   * @returns {boolean} true if the user provided is associated with the case, false otherwise
   */
  isAssociatedUser({ user }) {
    return isAssociatedUser({ caseRaw: this, user });
  }

  /**
   * returns true if the case status is already calendared
   * @returns {boolean} if the case is calendared
   */
  isCalendared() {
    return this.status === CASE_STATUS_TYPES.calendared;
  }

  /**
   * returns true if the case status is ready for trial
   * @returns {boolean} if the case is calendared
   */
  isReadyForTrial() {
    return (
      this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial &&
      this.preferredTrialCity &&
      !this.blocked &&
      !this.automaticBlocked
    );
  }

  /**
   * set as blocked with a blockedReason
   * @param {string} blockedReason - the reason the case was blocked
   * @returns {Case} the updated case entity
   */
  setAsBlocked(blockedReason) {
    this.blocked = true;
    this.blockedReason = blockedReason;
    this.blockedDate = createISODateString();
    return this;
  }

  /**
   * unblock the case and remove the blockedReason
   * @returns {Case} the updated case entity
   */
  unsetAsBlocked() {
    this.blocked = false;
    this.blockedReason = undefined;
    this.blockedDate = undefined;
    return this;
  }

  static isPetitionerRepresented(rawCase, userId: string): boolean {
    return !!rawCase.privatePractitioners?.find(practitioner =>
      practitioner.representing.find(id => id === userId),
    );
  }

  /**
   * sets the notice of trial date for a case
   * @returns {Case} this case entity
   */
  setNoticeOfTrialDate() {
    this.noticeOfTrialDate = createISODateString();
    return this;
  }

  /**
   * sets the qc complete for trial boolean for a case
   * @param {object} providers the providers object
   * @param {boolean} providers.qcCompleteForTrial the value to set for qcCompleteForTrial
   * @param {string} providers.trialSessionId the id of the trial session to set qcCompleteForTrial for
   * @returns {Case} this case entity
   */
  setQcCompleteForTrial({ qcCompleteForTrial, trialSessionId }) {
    this.qcCompleteForTrial[trialSessionId] = qcCompleteForTrial;
    return this;
  }

  /**
   * sets the sealedDate on a case to the current date and time
   * @returns {Case} this case entity
   */
  setAsSealed() {
    this.sealedDate = createISODateString();
    this.isSealed = true;
    return this;
  }

  /**
   * sets isSealed to false and sealedDate to undefined on a case
   * @returns {Case} this case entity
   */
  setAsUnsealed() {
    this.isSealed = false;
    this.sealedDate = undefined;
    return this;
  }

  /**
   * generates the case confirmation pdf file name
   * @returns {string} this case confirmation pdf file name
   */
  getCaseConfirmationGeneratedPdfFileName() {
    return `case-${this.docketNumber}-confirmation.pdf`;
  }

  /**
   * adds the correspondence document to the list of correspondences on the case
   * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
   * @returns {Case} this case entity
   */
  fileCorrespondence(correspondenceEntity) {
    this.correspondence = [...this.correspondence, correspondenceEntity];

    return this;
  }

  /**
   * updates the correspondence document on the case
   * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
   * @returns {Case} this case entity
   */
  updateCorrespondence(correspondenceEntity) {
    const foundCorrespondence = this.correspondence.find(
      correspondence =>
        correspondence.correspondenceId ===
        correspondenceEntity.correspondenceId,
    );

    if (foundCorrespondence)
      Object.assign(foundCorrespondence, correspondenceEntity);

    return this;
  }

  /**
   * adds the statistic to the list of statistics on the case
   * @param {Statistic} statisticEntity the statistic to add to the case
   * @returns {Case} this case entity
   */
  addStatistic(statisticEntity) {
    if (this.statistics.length === 12) {
      throw new Error('maximum number of statistics reached');
    }

    this.statistics = [...this.statistics, statisticEntity];

    return this;
  }

  /**
   * updates the statistic with the given index on the case
   * @param {Statistic} statisticEntity the statistic to update on the case
   * @param {string} statisticId the id of the statistic to update
   * @returns {Case} this case entity
   */
  updateStatistic(statisticEntity, statisticId) {
    const statisticToUpdate = this.statistics.find(
      statistic => statistic.statisticId === statisticId,
    );

    if (statisticToUpdate) Object.assign(statisticToUpdate, statisticEntity);

    return this;
  }

  /**
   * deletes the statistic with the given index from the case
   * @param {string} statisticId the id of the statistic to delete
   * @returns {Case} this case entity
   */
  deleteStatistic(statisticId) {
    const statisticIndexToDelete = this.statistics.findIndex(
      statistic => statistic.statisticId === statisticId,
    );

    if (statisticIndexToDelete !== -1) {
      this.statistics.splice(statisticIndexToDelete, 1);
    }

    return this;
  }

  /**
   * Returns true if at least one party on the case has the provided serviceIndicator type.
   * @param {string} serviceType the serviceIndicator type to check for
   * @returns {Boolean} true if at least one party on the case has the provided serviceIndicator type, false otherwise.
   */
  hasPartyWithServiceType(serviceType) {
    return hasPartyWithServiceType(this, serviceType);
  }

  /**
   * Returns true if the case should be displayed as eligible for trial sessions
   * @returns {Boolean} true if the case is eligible
   */
  getShouldHaveTrialSortMappingRecords() {
    return !!(
      (this.highPriority ||
        this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial) &&
      this.preferredTrialCity &&
      !this.blocked &&
      (!this.automaticBlocked || (this.automaticBlocked && this.highPriority))
    );
  }
}

/**
 * Returns true if at least one party on the case has the provided serviceIndicator type.
 * @param {Object} rawCase the raw case object
 * @param {string} serviceType the serviceIndicator type to check for
 * @returns {Boolean} true if at least one party on the case has the provided serviceIndicator type, false otherwise.
 */
export const hasPartyWithServiceType = function (rawCase, serviceType) {
  return (
    rawCase.petitioners.some(p => p.serviceIndicator === serviceType) ||
    (rawCase.privatePractitioners &&
      rawCase.privatePractitioners.find(
        pp => pp.serviceIndicator === serviceType,
      )) ||
    (rawCase.irsPractitioners &&
      rawCase.irsPractitioners.find(ip => ip.serviceIndicator === serviceType))
  );
};

export const isSealedCase = rawCase => rawCase.isSealed || !!rawCase.sealedDate;

export const isLeadCase = (rawCase: {
  docketNumber: string;
  leadDocketNumber?: string;
}): boolean => rawCase.docketNumber === rawCase.leadDocketNumber;

export const caseHasServedDocketEntries = rawCase => {
  return rawCase.docketEntries.some(docketEntry =>
    DocketEntry.isServed(docketEntry),
  );
};

/**
 * determines if the case is in a state where documents can be served
 * @param {Object} rawCase The Case we are using to determine whether we can allow document service
 * @returns {Boolean} whether or not documents can be served on the case
 */
export const canAllowDocumentServiceForCase = rawCase => {
  if (typeof rawCase.canAllowDocumentService !== 'undefined') {
    return rawCase.canAllowDocumentService;
  }
  return CASE_STATUS_TYPES.new !== rawCase.status;
};

/**
 * determines whether or not to file automatically generated notices for notice of change of address
 * @param {Object} rawCase the court case
 * @returns {Boolean} whether or not we should automatically generate notices for a change of address
 */
export const shouldGenerateNoticesForCase = rawCase => {
  if (typeof rawCase.shouldGenerateNotices !== 'undefined') {
    return rawCase.shouldGenerateNotices;
  }
  const isOpen = ![...CLOSED_CASE_STATUSES, CASE_STATUS_TYPES.new].includes(
    rawCase.status,
  );
  const MAX_CLOSED_DATE = calculateISODate({
    howMuch: -6,
    units: 'months',
  });
  const isRecent =
    rawCase.closedDate &&
    dateStringsCompared(rawCase.closedDate, MAX_CLOSED_DATE) >= 0;
  return Boolean(isOpen || isRecent);
};

/**
 *  determines whether or not we should show the printable docket record
 * @param {Object} rawCase  the case we are using to determine whether we should show the printable docket record
 * @returns {Boolean} whether or not we should show the printable docket record
 */
export const canAllowPrintableDocketRecord = rawCase => {
  if (typeof rawCase.canAllowPrintableDocketRecord !== 'undefined') {
    return rawCase.canAllowPrintableDocketRecord;
  }
  return rawCase.status !== CASE_STATUS_TYPES.new;
};

/**
 * Determines if the case has been closed
 * @param {object} rawCase the case
 * @returns {Boolean} true if the case has been closed, false otherwise
 */
export const isClosed = function (rawCase) {
  return isClosedStatus(rawCase.status);
};

/**
 * Determines if the case has a closed status
 * @param {string} caseStatus the status of the case
 * @returns {Boolean} true if the case has been closed, false otherwise
 */
export const isClosedStatus = function (caseStatus) {
  return CLOSED_CASE_STATUSES.includes(caseStatus);
};

/**
 * Retrieves the petitioner with id contactId on the case
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the contact object
 */
export const getPetitionerById = function (rawCase, contactId) {
  return rawCase.petitioners?.find(
    petitioner => petitioner.contactId === contactId,
  );
};

/**
 * Retrieves the petitioner with email userEmail on the case
 * @param {object} arguments.rawCase the raw case
 * @params {string} params.userEmail the email of the petitioner to retrieve
 * @returns {Object} the contact object
 */
export const getPetitionerByEmail = function (rawCase, userEmail) {
  return rawCase.petitioners?.find(
    petitioner => petitioner.email === userEmail,
  );
};

/**
 * returns the practitioner representing a petitioner
 * @params {string} petitionerContactId the id of the petitioner
 * @returns {Object} the practitioner
 */
export const getPractitionersRepresenting = function (
  rawCase: RawCase,
  petitionerContactId: string,
) {
  return rawCase.privatePractitioners.filter(practitioner =>
    practitioner.representing.includes(petitionerContactId),
  );
};

export const getPetitionDocketEntry = function (rawCase) {
  return rawCase.docketEntries?.find(
    docketEntry =>
      docketEntry.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
};

export const caseHasServedPetition = rawCase => {
  const petitionDocketEntry = getPetitionDocketEntry(rawCase);
  return petitionDocketEntry && DocketEntry.isServed(petitionDocketEntry);
};

/**
 * returns true if the case is associated with the userId
 * @param {object} arguments arguments
 * @param {object} arguments.caseRaw raw case details
 * @param {string} arguments.user the user account
 * @returns {boolean} if the case is associated
 */
export const isAssociatedUser = function ({ caseRaw, user }) {
  const isIrsPractitioner =
    caseRaw.irsPractitioners &&
    caseRaw.irsPractitioners.find(r => r.userId === user.userId);

  const isPrivatePractitioner =
    caseRaw.privatePractitioners &&
    caseRaw.privatePractitioners.find(p => p.userId === user.userId);

  const isPartyOnCase = !!getPetitionerById(caseRaw, user.userId);

  const isIrsSuperuser = user.role === ROLES.irsSuperuser;

  const petitionDocketEntry = (caseRaw.docketEntries || []).find(
    doc => doc.documentType === 'Petition',
  );

  const isPetitionServed =
    petitionDocketEntry && DocketEntry.isServed(petitionDocketEntry);

  return (
    isIrsPractitioner ||
    isPrivatePractitioner ||
    isPartyOnCase ||
    (isIrsSuperuser && isPetitionServed)
  );
};

/**
 * @param {Object} options the options argument
 * @param {Array} options.consolidatedCases an array of consolidated cases
 * @param {String} userId the user's id
 * @returns {boolean} true if the user is a party of the case
 */
export const isUserPartOfGroup = function ({ consolidatedCases, userId }) {
  return consolidatedCases.some(aCase =>
    userIsDirectlyAssociated({ aCase, userId }),
  );
};

/**
 * @param {Object} options the options argument
 * @param {Object} options.aCase A Case
 * @param {String} options.userId the user's id
 * @returns {boolean} true if the user is a party of the case
 */
export const userIsDirectlyAssociated = function ({ aCase, userId }) {
  const userIsPartyToCase = [
    ...(aCase.petitioners || []),
    ...(aCase.privatePractitioners || []),
    ...(aCase.irsPractitioners || []),
  ].some(user => user?.userId === userId || user?.contactId === userId);
  return userIsPartyToCase;
};

/**
 * Computes and sets additionalName for contactPrimary depending on partyType
 */
export const setAdditionalNameOnPetitioners = function ({ obj, rawCase }) {
  const contactPrimary = getContactPrimary(rawCase);

  if (contactPrimary && !contactPrimary.additionalName) {
    const contactPrimaryRef = obj.petitioners.find(
      p => p.contactId === contactPrimary.contactId,
    );

    switch (rawCase.partyType) {
      case PARTY_TYPES.conservator:
      case PARTY_TYPES.custodian:
      case PARTY_TYPES.guardian:
      case PARTY_TYPES.nextFriendForIncompetentPerson:
      case PARTY_TYPES.nextFriendForMinor:
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
      case PARTY_TYPES.partnershipBBA:
      case PARTY_TYPES.survivingSpouse:
      case PARTY_TYPES.trust:
        contactPrimaryRef.additionalName = contactPrimaryRef.secondaryName;
        delete contactPrimaryRef.secondaryName;
        break;
      case PARTY_TYPES.estate: {
        const additionalNameFields = compact([
          contactPrimaryRef.secondaryName,
          contactPrimaryRef.title,
        ]);
        contactPrimaryRef.additionalName = additionalNameFields.join(', ');
        delete contactPrimaryRef.secondaryName;
        delete contactPrimaryRef.title;
        break;
      }
      case PARTY_TYPES.estateWithoutExecutor:
      case PARTY_TYPES.corporation:
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimaryRef.additionalName = `c/o ${contactPrimaryRef.inCareOf}`;
        delete contactPrimaryRef.inCareOf;
        break;
      default:
        break;
    }
  }
};

/**
 * Retrieves the contact from the case based on whatever contactType is specified
 * @param {Object} providers the providers object
 * @param {String} providers.contactType the type of contact we are looking for (primary or secondary)
 * @param {Object} providers.rawCase the raw case
 * @returns {Object|void} the contact object on the case
 */
export const getContactPrimaryOrSecondary = function ({
  contactType,
  rawCase,
}) {
  if (!rawCase.petitioners) {
    return;
  } else if (!rawCase.status || rawCase.status === CASE_STATUS_TYPES.new) {
    return rawCase.petitioners.find(p => p.contactType === contactType);
  }

  const petitioners = rawCase.petitioners.filter(
    p => p.contactType === CONTACT_TYPES.petitioner,
  );

  if (contactType === CONTACT_TYPES.primary) {
    return petitioners[0];
  } else if (contactType === CONTACT_TYPES.secondary) {
    return petitioners[1];
  }
};

/**
 * Retrieves the primary contact on the case
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the primary contact object on the case
 */
export const getContactPrimary = function (rawCase) {
  return getContactPrimaryOrSecondary({
    contactType: CONTACT_TYPES.primary,
    rawCase,
  });
};

/**
 * Retrieves the secondary contact on the case
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the secondary contact object on the case
 */
export const getContactSecondary = function (rawCase) {
  return getContactPrimaryOrSecondary({
    contactType: CONTACT_TYPES.secondary,
    rawCase,
  });
};

/**
 * Retrieves the other filers on the case
 * @param {object} arguments.rawCase the raw case
 * @returns {Array} the other filers on the case
 */
export const getOtherFilers = function (rawCase) {
  return rawCase.petitioners?.filter(
    p =>
      p.contactType === CONTACT_TYPES.participant ||
      p.contactType === CONTACT_TYPES.intervenor,
  );
};

/**
 * Updates the specified contact object in the case petitioner's array
 * @param {object} arguments.rawCase the raw case object
 * @param {object} arguments.updatedPetitioner the updated petitioner object
 */
export const updatePetitioner = function (rawCase, updatedPetitioner) {
  const petitionerIndex = rawCase.petitioners.findIndex(
    p => p.contactId === updatedPetitioner.contactId,
  );

  if (petitionerIndex !== -1) {
    rawCase.petitioners[petitionerIndex] = updatedPetitioner;
  } else {
    throw new Error(
      `Petitioner was not found on case ${rawCase.docketNumber}.`,
    );
  }
};

declare global {
  type RawCase = ExcludeMethods<Case>;
}

const generateCaptionFromContacts = ({
  partyType,
  primaryContact,
  secondaryContact,
}) => {
  let caseCaption;
  switch (partyType) {
    case PARTY_TYPES.corporation:
    case PARTY_TYPES.petitioner:
      caseCaption = `${primaryContact.name}, Petitioner`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Petitioners`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Deceased, Petitioners`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, ${primaryContact.title}, Petitioner(s)`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, Petitioner`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Trustee, Petitioner(s)`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Partnership Representative, Petitioner(s)`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Conservator, Petitioner`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Guardian, Petitioner`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Custodian, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${primaryContact.name}, Minor, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${primaryContact.name}, Incompetent, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${primaryContact.name}, Donor, Petitioner`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${primaryContact.name}, Transferee, Petitioner`;
      break;
    case PARTY_TYPES.survivingSpouse:
      caseCaption = `${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, Surviving Spouse, Petitioner`;
      break;
  }
  return caseCaption;
};

export type CaseStatusChange = {
  changedBy: string;
  date: string;
  updatedCaseStatus: string;
};
