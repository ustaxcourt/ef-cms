import { RawPublicContact } from '@shared/business/entities/cases/PublicContact';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ConsolidatedCaseSummary } from './ConsolidatedCaseSummary';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import {
  CASE_CAPTION_RULE,
  CASE_DOCKET_NUMBER_RULE,
  CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE,
  CASE_IS_SEALED_RULE,
  CASE_LEAD_DOCKET_NUMBER_RULE,
} from '@shared/business/entities/EntityValidationConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export class PublicCaseResponse extends JoiValidationEntity {
  public canAllowDocumentService?: boolean;
  public canAllowPrintableDocketRecord?: boolean;
  public canDojPractitionersRepresentParty?: boolean;
  public caseCaption: string;
  public createdAt?: string;
  public leadDocketNumber?: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix: string;
  public hasIrsPractitioner: boolean;
  public docketEntries: RawDocketEntry[];
  public isPaper?: boolean;
  public partyType: string;
  public receivedAt: string;
  public isSealed: boolean;
  public petitioners?: RawPublicContact[];
  public irsPractitioners?: RawPublicContact[] | IrsPractitioner[];
  public privatePractitioners?: RawPublicContact[] | PrivatePractitioner[];
  public consolidatedCases?: ConsolidatedCaseSummary[];

  constructor(
    rawPublicCase: RawPublicCase,
    options?: { authorizedUser: UnknownAuthUser },
  ) {
    super('PublicCaseResponse');
    if (options) {
      rawPublicCase = new PublicCase(rawPublicCase, options).toRawObject();
    }

    this.canAllowDocumentService = rawPublicCase.canAllowDocumentService;
    this.canAllowPrintableDocketRecord =
      rawPublicCase.canAllowPrintableDocketRecord;
    this.canDojPractitionersRepresentParty =
      rawPublicCase.canDojPractitionersRepresentParty;
    this.caseCaption = rawPublicCase.caseCaption;
    this.createdAt = rawPublicCase.createdAt;
    this.leadDocketNumber = rawPublicCase.leadDocketNumber;
    this.docketNumber = rawPublicCase.docketNumber;
    this.docketNumberSuffix = rawPublicCase.docketNumberSuffix;
    this.docketNumberWithSuffix = rawPublicCase.docketNumberWithSuffix;
    this.hasIrsPractitioner = rawPublicCase.hasIrsPractitioner;
    this.docketEntries = rawPublicCase.docketEntries;
    this.isPaper = rawPublicCase.isPaper;
    this.partyType = rawPublicCase.partyType;
    this.receivedAt = rawPublicCase.receivedAt;
    this.isSealed = rawPublicCase.isSealed;
    this.petitioners = rawPublicCase.petitioners;
    this.irsPractitioners = rawPublicCase.irsPractitioners;
    this.privatePractitioners = rawPublicCase.privatePractitioners;
    this.consolidatedCases = rawPublicCase.consolidatedCases;
  }

  static VALIDATION_RULES = {
    canAllowDocumentService: joi.boolean().optional(),
    canAllowPrintableDocketRecord: joi.boolean().optional(),
    canDojPractitionersRepresentParty: joi.boolean().optional(),
    caseCaption: CASE_CAPTION_RULE,
    consolidatedCases: joi.array().optional(),
    createdAt: JoiValidationConstants.ISO_DATE.optional(),
    docketEntries: joi.array().required(),
    docketNumber: CASE_DOCKET_NUMBER_RULE,
    docketNumberSuffix: JoiValidationConstants.STRING.valid(
      ...Object.values(DOCKET_NUMBER_SUFFIXES),
    )
      .optional()
      .allow(null),
    docketNumberWithSuffix: CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE,
    hasIrsPractitioner: joi.boolean().required(),
    irsPractitioners: joi.array().optional(),
    isPaper: joi.boolean().optional(),
    isSealed: CASE_IS_SEALED_RULE,
    leadDocketNumber: CASE_LEAD_DOCKET_NUMBER_RULE,
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    ).optional(),
    petitioners: joi.array().optional(),
    privatePractitioners: joi.array().optional(),
    receivedAt: JoiValidationConstants.ISO_DATE.required(),
  };

  getValidationRules() {
    return PublicCaseResponse.VALIDATION_RULES;
  }
}
