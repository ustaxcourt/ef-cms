import {
  CASE_TYPES,
  FILING_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES,
  ROLES,
} from '../EntityConstants';
import { Case, getContactPrimary, getContactSecondary } from './Case';
import { ContactFactory } from '../contacts/ContactFactory';
import { Correspondence } from '../Correspondence';
import { DocketEntry } from '../DocketEntry';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { Statistic } from '../Statistic';
import joi from 'joi';

/**
 * Represents a Case with required documents that a Petitions Clerk is
 *  attempting to add to the system.
 *
 */
export class PaperPetition extends JoiValidationEntity {
  public applicationForWaiverOfFilingFeeFile: object;
  public applicationForWaiverOfFilingFeeFileSize: number;
  public caseCaption: string;
  public caseType: string;
  public filingType: string;
  public irsNoticeDate: string;
  public hasVerifiedIrsNotice: boolean;
  public mailingDate: string;
  public noticeOfAttachments: any;
  public orderDesignatingPlaceOfTrial: any;
  public orderForCds: any;
  public orderForAmendedPetition: any;
  public orderForAmendedPetitionAndFilingFee: any;
  public orderForFilingFee: any;
  public orderForRatification: any;
  public orderToShowCause: any;
  public corporateDisclosureFile: object;
  public corporateDisclosureFileSize: number;
  public partyType: string;
  public petitionFile: object;
  public petitionFileSize: number;
  public petitionPaymentDate: string;
  public requestForPlaceOfTrialFile: object;
  public requestForPlaceOfTrialFileSize: number;
  public petitionPaymentMethod: string;
  public petitionPaymentStatus: any;
  public petitionPaymentWaivedDate: any;
  public preferredTrialCity: any;
  public procedureType: string;
  public receivedAt: string;
  public stinFile: object;
  public stinFileSize: number;
  public useSameAsPrimary: boolean;
  public petitioners: any;
  public statistics: any;
  public archivedDocketEntries: any;
  public archivedCorrespondences: any;
  public docketEntries: DocketEntry[];

  constructor(rawProps, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }
    super('PaperPetition');

    this.caseCaption = rawProps.caseCaption;
    this.caseType = rawProps.caseType;
    this.filingType = rawProps.filingType;
    this.irsNoticeDate = rawProps.irsNoticeDate;
    this.hasVerifiedIrsNotice = rawProps.hasVerifiedIrsNotice || false;
    this.mailingDate = rawProps.mailingDate;
    this.noticeOfAttachments = rawProps.noticeOfAttachments;
    this.orderDesignatingPlaceOfTrial = rawProps.orderDesignatingPlaceOfTrial;
    // this is so the validation that is checking for existence of 3 different fields
    // will work correctly
    if (this.orderDesignatingPlaceOfTrial === false) {
      this.orderDesignatingPlaceOfTrial = undefined;
    }
    this.orderForCds = rawProps.orderForCds;
    this.orderForAmendedPetition = rawProps.orderForAmendedPetition;
    this.orderForAmendedPetitionAndFilingFee =
      rawProps.orderForAmendedPetitionAndFilingFee;
    this.orderForFilingFee = rawProps.orderForFilingFee;
    this.orderForRatification = rawProps.orderForRatification;
    this.orderToShowCause = rawProps.orderToShowCause;
    this.partyType = rawProps.partyType;
    this.petitionPaymentDate = rawProps.petitionPaymentDate;
    this.petitionPaymentMethod = rawProps.petitionPaymentMethod;
    this.petitionPaymentStatus = rawProps.petitionPaymentStatus;
    this.petitionPaymentWaivedDate = rawProps.petitionPaymentWaivedDate;
    this.preferredTrialCity = rawProps.preferredTrialCity;
    this.procedureType = rawProps.procedureType;
    this.receivedAt = rawProps.receivedAt;
    this.useSameAsPrimary = rawProps.useSameAsPrimary;
    this.petitioners = rawProps.petitioners || [];
    this.stinFile = rawProps.stinFile;
    this.stinFileSize = rawProps.stinFileSize;
    this.corporateDisclosureFile = rawProps.corporateDisclosureFile;
    this.corporateDisclosureFileSize = rawProps.corporateDisclosureFileSize;
    this.petitionFile = rawProps.petitionFile;
    this.petitionFileSize = rawProps.petitionFileSize;
    this.requestForPlaceOfTrialFile = rawProps.requestForPlaceOfTrialFile;
    this.requestForPlaceOfTrialFileSize =
      rawProps.requestForPlaceOfTrialFileSize;
    this.applicationForWaiverOfFilingFeeFile =
      rawProps.applicationForWaiverOfFilingFeeFile;
    this.applicationForWaiverOfFilingFeeFileSize =
      rawProps.applicationForWaiverOfFilingFeeFileSize;
    this.docketEntries = rawProps.docketEntries || [];

    this.statistics = Array.isArray(rawProps.statistics)
      ? rawProps.statistics.map(
          statistic => new Statistic(statistic, { applicationContext }),
        )
      : [];

    this.archivedDocketEntries = Array.isArray(rawProps.archivedDocketEntries)
      ? rawProps.archivedDocketEntries.map(
          doc => new DocketEntry(doc, { applicationContext }),
        )
      : [];

    this.archivedCorrespondences = Array.isArray(
      rawProps.archivedCorrespondences,
    )
      ? rawProps.archivedCorrespondences.map(
          correspondence => new Correspondence(correspondence),
        )
      : [];

    const contacts = ContactFactory({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawProps) || rawProps.contactPrimary,
        secondary: getContactSecondary(rawProps) || rawProps.contactSecondary,
      },
      partyType: rawProps.partyType,
    });
    this.petitioners = [contacts.primary];
    if (contacts.secondary) {
      this.petitioners.push(contacts.secondary);
    }
  }

  static VALIDATION_RULES = joi
    .object()
    .keys({
      applicationForWaiverOfFilingFeeFile: joi
        .alternatives()
        .conditional('petitionPaymentStatus', {
          is: PAYMENT_STATUS.WAIVED,
          otherwise: joi.optional().allow(null),
          then: createDocketEntriesValidation('APW'),
        }),
      applicationForWaiverOfFilingFeeFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'applicationForWaiverOfFilingFeeFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
      archivedCorrespondences: Case.VALIDATION_RULES.archivedCorrespondences,
      archivedDocketEntries: Case.VALIDATION_RULES.archivedDocketEntries,
      caseCaption: JoiValidationConstants.CASE_CAPTION.required(),
      caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
      corporateDisclosureFile: joi.alternatives().conditional('partyType', {
        is: joi
          .exist()
          .valid(
            PARTY_TYPES.corporation,
            PARTY_TYPES.partnershipAsTaxMattersPartner,
            PARTY_TYPES.partnershipBBA,
            PARTY_TYPES.partnershipOtherThanTaxMatters,
          ),
        otherwise: joi.optional().allow(null),
        then: joi.alternatives().conditional('orderForCds', {
          is: joi.not(true),
          otherwise: joi.optional().allow(null),
          then: createDocketEntriesValidation('DISC'),
        }),
      }),
      corporateDisclosureFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'corporateDisclosureFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
      docketEntries: joi.array().optional(),
      filingType: JoiValidationConstants.STRING.valid(
        ...FILING_TYPES[ROLES.petitioner],
        ...FILING_TYPES[ROLES.privatePractitioner],
      ).optional(),
      hasVerifiedIrsNotice: joi.boolean().required(),
      irsNoticeDate: Case.VALIDATION_RULES.irsNoticeDate,
      mailingDate: JoiValidationConstants.STRING.max(25).required(),
      noticeOfAttachments: Case.VALIDATION_RULES.noticeOfAttachments,
      orderDesignatingPlaceOfTrial:
        Case.VALIDATION_RULES.orderDesignatingPlaceOfTrial,
      orderForAmendedPetition: Case.VALIDATION_RULES.orderForAmendedPetition,
      orderForAmendedPetitionAndFilingFee:
        Case.VALIDATION_RULES.orderForAmendedPetitionAndFilingFee,
      orderForCds: Case.VALIDATION_RULES.orderForCds,
      orderForFilingFee: Case.VALIDATION_RULES.orderForFilingFee,
      orderForRatification: Case.VALIDATION_RULES.orderForRatification,
      orderToShowCause: Case.VALIDATION_RULES.orderToShowCause,
      partyType: JoiValidationConstants.STRING.valid(
        ...Object.values(PARTY_TYPES),
      ).required(),
      petitionFile: joi.alternatives().conditional('petitionFile', {
        is: joi.exist().not(null),
        otherwise: createDocketEntriesValidation('P'),
        then: joi.object().required(),
      }),
      petitionFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'petitionFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ),
      petitionPaymentDate: JoiValidationConstants.ISO_DATE.max('now').when(
        'petitionPaymentStatus',
        {
          is: PAYMENT_STATUS.PAID,
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ),
      petitionPaymentMethod: Case.VALIDATION_RULES.petitionPaymentMethod,
      petitionPaymentStatus: Case.VALIDATION_RULES.petitionPaymentStatus,
      petitionPaymentWaivedDate:
        Case.VALIDATION_RULES.petitionPaymentWaivedDate,
      petitioners: Case.VALIDATION_RULES.petitioners,
      preferredTrialCity: joi
        .alternatives()
        .conditional('requestForPlaceOfTrialFile', {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: JoiValidationConstants.STRING.required(),
        }),
      procedureType: JoiValidationConstants.STRING.valid(
        ...PROCEDURE_TYPES,
      ).required(),
      receivedAt: JoiValidationConstants.ISO_DATE.max('now').required(),
      requestForPlaceOfTrialFile: joi
        .alternatives()
        .conditional('preferredTrialCity', {
          is: joi.exist().not(null),
          otherwise: joi.object().optional(),
          then: createDocketEntriesValidation('RQT'),
        }),
      requestForPlaceOfTrialFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'requestForPlaceOfTrialFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
      statistics: Case.VALIDATION_RULES.statistics,
      stinFile: joi.object().optional(), // object of type File
      stinFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'stinFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ),
      useSameAsPrimary: Case.VALIDATION_RULES.useSameAsPrimary,
    })
    .or(
      'preferredTrialCity',
      'requestForPlaceOfTrialFile',
      'orderDesignatingPlaceOfTrial',
    );

  static VALIDATION_ERROR_MESSAGES = {
    ...Case.VALIDATION_ERROR_MESSAGES,
    applicationForWaiverOfFilingFeeFile:
      'Upload or scan an Application for Waiver of Filing Fee (APW)',
    chooseAtLeastOneValue:
      'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
    corporateDisclosureFile:
      'Upload or scan Corporate Disclosure Statement(CDS)',
    petitionFile: 'Upload or scan a Petition',
    petitionPaymentDate: [
      {
        contains: 'must be less than or equal to',
        message: 'Payment date cannot be in the future. Enter a valid date.',
      },
      'Enter a valid payment date',
    ],
    petitionPaymentStatus: 'Select a filing fee option',
    preferredTrialCity: 'Select a preferred trial location',
    requestForPlaceOfTrialFile:
      'Upload or scan a Request for Place of Trial (RQT)',
  };

  getValidationRules() {
    return PaperPetition.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PaperPetition.VALIDATION_ERROR_MESSAGES;
  }

  getValidationErrors(): {} | null {
    const validationErrors = super.getValidationErrors();

    if (validationErrors && validationErrors['object.missing']) {
      validationErrors['chooseAtLeastOneValue'] =
        validationErrors['object.missing'];
      delete validationErrors['object.missing'];
    }

    return validationErrors;
  }
}

function createDocketEntriesValidation(eventCode: string) {
  return joi.alternatives().conditional('docketEntries', {
    is: joi
      .array()
      .items(
        joi.object({
          eventCode: joi.string(),
        }),
      )
      .has(joi.object({ eventCode: joi.string().valid(eventCode) })),
    otherwise: joi.object().required(), // object of type File
    then: joi.object().optional(),
  });
}
