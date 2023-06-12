import {
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_SUFFIXES,
  ORDER_TYPES,
  PARTY_TYPES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
} from '../EntityConstants';
import { IrsPractitioner } from '../IrsPractitioner';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { PrivatePractitioner } from '../PrivatePractitioner';
const { PublicContact } = require('./PublicContact');
const { PublicDocketEntry } = require('./PublicDocketEntry');
import { Case, isSealedCase } from './Case';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { compareStrings } from '../../utilities/sortFunctions';
import { map } from 'lodash';
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
  public docketEntriesEFiledByPractitioner: string[];
  public isPaper?: boolean;
  public partyType: string;
  public receivedAt: string;
  public isSealed: boolean;
  public petitioners: any[] | undefined;
  public irsPractitioners?: any[];
  public privatePractitioners: any;
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
    this.docketEntriesEFiledByPractitioner =
      PublicCase.getDocketEntriesEFiledByPractitioner(rawCase);

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
      .map(
        docketEntry =>
          new PublicDocketEntry(docketEntry, { applicationContext }),
      )
      .sort((a, b) => compareStrings(a.receivedAt, b.receivedAt));
  }

  getErrorToMessageMap() {
    return Case.VALIDATION_ERROR_MESSAGES;
  }

  static isPrivateDocument(documentEntity) {
    const orderDocumentTypes = map(ORDER_TYPES, 'documentType');

    const isTranscript = documentEntity.eventCode === TRANSCRIPT_EVENT_CODE;
    const hasPolicyDateImpactedEventCode =
      POLICY_DATE_IMPACTED_EVENTCODES.includes(documentEntity.eventCode);
    const isOrder = orderDocumentTypes.includes(documentEntity.documentType);
    const isDocumentOnDocketRecord = documentEntity.isOnDocketRecord;
    const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
      ({ eventCode }) => eventCode,
    ).includes(documentEntity.eventCode);
    const documentIsStricken = !!documentEntity.isStricken;

    const isPublicDocumentType =
      (isOrder || isCourtIssuedDocument || hasPolicyDateImpactedEventCode) &&
      !isTranscript &&
      !documentIsStricken;

    return (
      (isPublicDocumentType && !isDocumentOnDocketRecord) ||
      !isPublicDocumentType
    );
  }

  static getDocketEntriesEFiledByPractitioner(rawCase) {
    let casePractitioners: any[];
    let docketEntriesEFiledByPractitioner: string[] = [];

    if (rawCase.irsPractitioners && rawCase.privatePractitioners) {
      casePractitioners = [
        ...rawCase.irsPractitioners,
        ...rawCase.privatePractitioners,
      ];

      for (let i = 0; i < rawCase.docketEntries?.length; i++) {
        const currentDocketEntry = rawCase.docketEntries[i];
        let docketEntryFiledByPractitioner = casePractitioners.some(
          p => p.userId === currentDocketEntry.userId,
        );

        if (docketEntryFiledByPractitioner) {
          docketEntriesEFiledByPractitioner.push(
            currentDocketEntry.docketEntryId,
          );
        }
      }
    }

    return docketEntriesEFiledByPractitioner;
  }

  static VALIDATION_RULES = {
    canAllowDocumentService: joi.boolean().optional(),
    canAllowPrintableDocketRecord: joi.boolean().optional(),
    caseCaption: joi.when('isSealed', {
      is: true,
      otherwise: JoiValidationConstants.CASE_CAPTION.optional(),
      then: joi.any().forbidden(),
    }),
    createdAt: joi.when('isSealed', {
      is: true,
      otherwise: JoiValidationConstants.ISO_DATE.optional(),
      then: joi.any().forbidden(),
    }),
    docketEntries: joi.when('isSealed', {
      is: true,
      otherwise: joi
        .array()
        .items(PublicDocketEntry.VALIDATION_RULES)
        .required()
        .description('List of DocketEntry Entities for the case.'),
      then: joi.array().max(0),
    }),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
      'Unique case identifier in XXXXX-YY format.',
    ),
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
    partyType: joi.when('isSealed', {
      is: true,
      otherwise: JoiValidationConstants.STRING.valid(
        ...Object.values(PARTY_TYPES),
      )
        .required()
        .description('Party type of the case petitioner.'),
      then: joi.any().forbidden(),
    }),
    petitioners: joi.when('isSealed', {
      is: true,
      otherwise: joi.array().items(PublicContact.VALIDATION_RULES).required(),
      then: joi.any().forbidden(),
    }),
    receivedAt: joi.when('isSealed', {
      is: true,
      otherwise: JoiValidationConstants.ISO_DATE.optional(),
      then: joi.any().forbidden(),
    }),
  };

  getValidationRules() {
    return PublicCase.VALIDATION_RULES;
  }
}

declare global {
  type RawPublicCase = ExcludeMethods<PublicCase>;
}
