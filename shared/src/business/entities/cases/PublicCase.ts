import {
  BRIEF_EVENTCODES,
  DOCKET_NUMBER_SUFFIXES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  PARTY_TYPES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
  isDocumentBriefType,
} from '../EntityConstants';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { IrsPractitioner } from '../IrsPractitioner';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { PrivatePractitioner } from '../PrivatePractitioner';
import { PublicContact } from './PublicContact';
import { PublicDocketEntry } from './PublicDocketEntry';
import { compareStrings } from '../../utilities/sortFunctions';
import { isSealedCase } from './Case';
import joi from 'joi';

export class PublicCase extends JoiValidationEntity {
  public entityName: string;
  public canAllowDocumentService?: string;
  public canAllowPrintableDocketRecord?: string;
  public caseCaption: string;
  public createdAt?: string;
  public leadDocketNumber?: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix: string;
  public hasIrsPractitioner: boolean;
  public docketEntries: any[];
  public isPaper?: boolean;
  public partyType: string;
  public receivedAt: string;
  public isSealed: boolean;
  public petitioners: any[] | undefined;
  public irsPractitioners?: any[];
  public privatePractitioners?: any[];
  public consolidatedCases?: ConsolidatedCaseSummary[];

  private _score?: string;

  constructor(
    rawCase: any,
    {
      applicationContext,
    }: {
      applicationContext: IApplicationContext;
    },
  ) {
    super('PublicCase');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.entityName = 'PublicCase';
    this.canAllowDocumentService = rawCase.canAllowDocumentService;
    this.canAllowPrintableDocketRecord = rawCase.canAllowPrintableDocketRecord;
    this.caseCaption = rawCase.caseCaption;
    this.createdAt = rawCase.createdAt;
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberSuffix = rawCase.docketNumberSuffix;
    this.docketNumberWithSuffix =
      rawCase.docketNumberWithSuffix ||
      `${this.docketNumber}${this.docketNumberSuffix || ''}`;
    this.hasIrsPractitioner =
      !!rawCase.irsPractitioners && rawCase.irsPractitioners.length > 0;

    this.isPaper = rawCase.isPaper;
    this.partyType = rawCase.partyType;
    this.receivedAt = rawCase.receivedAt;
    this._score = rawCase['_score'];

    this.isSealed = isSealedCase(rawCase);

    const currentUser = applicationContext.getCurrentUser();

    if (currentUser.role === ROLES.irsPractitioner && !this.isSealed) {
      this.petitioners = rawCase.petitioners;

      this.irsPractitioners = (rawCase.irsPractitioners || []).map(
        irsPractitioner => new IrsPractitioner(irsPractitioner),
      );
      this.privatePractitioners = (rawCase.privatePractitioners || []).map(
        practitioner => new PrivatePractitioner(practitioner),
      );

      this.leadDocketNumber = rawCase.leadDocketNumber;
      this.consolidatedCases = (rawCase.consolidatedCases || []).map(
        consolidatedCase => new ConsolidatedCaseSummary(consolidatedCase),
      );
    } else if (!this.isSealed) {
      this.petitioners = [];
      rawCase.petitioners.map(petitioner => {
        const publicPetitionerContact = new PublicContact(petitioner);
        this.petitioners?.push(publicPetitionerContact);
      });
    }

    // rawCase.docketEntries is not returned in elasticsearch queries due to _source definition
    this.docketEntries = (rawCase.docketEntries || [])
      .filter(
        docketEntry => !docketEntry.isDraft && docketEntry.isOnDocketRecord,
      )
      .map(docketEntry => new PublicDocketEntry(docketEntry))
      .sort((a, b) => compareStrings(a.receivedAt, b.receivedAt));
  }

  static isPrivateDocument(
    docketEntry: RawDocketEntry,
    visibilityChangeDate: string,
  ): boolean {
    if (
      docketEntry.isStricken ||
      docketEntry.eventCode === TRANSCRIPT_EVENT_CODE ||
      !docketEntry.isOnDocketRecord
    )
      return true;

    const isOrder = ORDER_EVENT_CODES.includes(docketEntry.eventCode);
    const isOpinion = OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(
      docketEntry.eventCode,
    );
    const isDecision = docketEntry.eventCode === 'DEC';

    if (isOrder || isOpinion || isDecision) {
      return false;
    }

    if (
      !POLICY_DATE_IMPACTED_EVENTCODES.includes(docketEntry.eventCode) ||
      docketEntry.filingDate < visibilityChangeDate
    ) {
      return true;
    }

    const isFiledByPractitioner = [
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
    ].includes(docketEntry.filedByRole);

    if (['AMBR', 'SDEC'].includes(docketEntry.eventCode)) {
      return false;
    }

    if (BRIEF_EVENTCODES.includes(docketEntry.eventCode)) {
      return !(!docketEntry.isPaper && isFiledByPractitioner);
    }

    // TODO: need to determine if the previousDocument.filedByRole is also a practitioner
    const isAmendmentToABrief =
      docketEntry.previousDocument &&
      isDocumentBriefType(docketEntry.previousDocument.documentType);

    return !(
      !docketEntry.isPaper &&
      isAmendmentToABrief &&
      isFiledByPractitioner
    );
  }

  static VALIDATION_RULES = {
    canAllowDocumentService: joi.boolean().optional(),
    canAllowPrintableDocketRecord: joi.boolean().optional(),
    caseCaption: joi
      .when('isSealed', {
        is: true,
        otherwise: JoiValidationConstants.CASE_CAPTION.optional(),
        then: joi.any().forbidden(),
      })
      .messages({ '*': 'Enter a case caption' }),
    createdAt: joi.when('isSealed', {
      is: true,
      otherwise: JoiValidationConstants.ISO_DATE.optional(),
      then: joi.any().forbidden(),
    }),
    docketEntries: joi
      .when('isSealed', {
        is: true,
        otherwise: joi
          .array()
          .items(PublicDocketEntry.VALIDATION_RULES) // needs new
          .required()
          .description('List of DocketEntry Entities for the case.'),
        then: joi.array().max(0),
      })
      .messages({ '*': 'At least one valid docket entry is required' }),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required()
      .description('Unique case identifier in XXXXX-YY format.')
      .messages({ '*': 'Docket number is required' }),
    docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
      .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
      .optional(),
    docketNumberWithSuffix:
      JoiValidationConstants.STRING.optional().description(
        'Auto-generated from docket number and the suffix.',
      ),
    hasIrsPractitioner: joi.boolean().required(),
    isPaper: joi.boolean().optional(),
    isSealed: joi.boolean(),
    partyType: joi
      .when('isSealed', {
        is: true,
        otherwise: JoiValidationConstants.STRING.valid(
          ...Object.values(PARTY_TYPES),
        )
          .required()
          .description('Party type of the case petitioner.'),
        then: joi.any().forbidden(),
      })
      .messages({ '*': 'Select a party type' }),
    petitioners: joi.when('isSealed', {
      is: true,
      otherwise: joi.array().items(PublicContact.VALIDATION_RULES).required(), // needs new
      then: joi.any().forbidden(),
    }),
    receivedAt: joi
      .when('isSealed', {
        is: true,
        otherwise: JoiValidationConstants.ISO_DATE.optional(),
        then: joi.any().forbidden(),
      })
      .messages({
        '*': 'Enter a valid date received',
        'date.max':
          'Date received cannot be in the future. Enter a valid date.',
      }),
  };

  getValidationRules() {
    return PublicCase.VALIDATION_RULES;
  }
}

declare global {
  type RawPublicCase = ExcludeMethods<PublicCase>;
}
