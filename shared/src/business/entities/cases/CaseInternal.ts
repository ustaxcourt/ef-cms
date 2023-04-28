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
import { PDF } from '../documents/PDF';
import { Statistic } from '../Statistic';
import joi from 'joi';

/**
 * Represents a Case with required documents that a Petitions Clerk is
 *  attempting to add to the system.
 *
 */
export class CaseInternal extends JoiValidationEntity {
  public applicationForWaiverOfFilingFeeFile: any;
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
  public corporateDisclosureFile: any;
  public partyType: string;
  public petitionFile: any;
  public petitionPaymentDate: string;
  public requestForPlaceOfTrialFile: any;
  public petitionPaymentMethod: string;
  public petitionPaymentStatus: any;
  public petitionPaymentWaivedDate: any;
  public preferredTrialCity: any;
  public procedureType: string;
  public receivedAt: string;
  public stinFile: any;
  public useSameAsPrimary: boolean;
  public petitioners: any;
  public statistics: any;
  public archivedDocketEntries: any;
  public archivedCorrespondences: any;

  constructor(rawCase, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    super('CaseInternal');

    if (rawCase.applicationForWaiverOfFilingFeeFile) {
      this.applicationForWaiverOfFilingFeeFile = new PDF({
        file: rawCase.applicationForWaiverOfFilingFeeFile,
        size: rawCase.applicationForWaiverOfFilingFeeFileSize,
      });
    }

    if (rawCase.corporateDisclosureFile) {
      this.corporateDisclosureFile = new PDF({
        file: rawCase.corporateDisclosureFile,
        size: rawCase.corporateDisclosureFileSize,
      });
    }

    if (rawCase.petitionFile) {
      this.petitionFile = new PDF({
        file: rawCase.petitionFile,
        size: rawCase.petitionFileSize,
      });
    }

    if (rawCase.requestForPlaceOfTrialFile) {
      this.requestForPlaceOfTrialFile = new PDF({
        file: rawCase.requestForPlaceOfTrialFile,
        size: rawCase.requestForPlaceOfTrialFileSize,
      });
    }

    if (rawCase.stinFile) {
      this.stinFile = new PDF({
        file: rawCase.stinFile,
        size: rawCase.stinFileSize,
      });
    }

    this.caseCaption = rawCase.caseCaption;
    this.caseType = rawCase.caseType;
    this.filingType = rawCase.filingType;
    this.irsNoticeDate = rawCase.irsNoticeDate;
    this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice || false;
    this.mailingDate = rawCase.mailingDate;
    this.noticeOfAttachments = rawCase.noticeOfAttachments;
    this.orderDesignatingPlaceOfTrial = rawCase.orderDesignatingPlaceOfTrial;
    // this is so the validation that is checking for existence of 3 different fields
    // will work correctly
    if (this.orderDesignatingPlaceOfTrial === false) {
      this.orderDesignatingPlaceOfTrial = undefined;
    }
    this.orderForCds = rawCase.orderForCds;
    this.orderForAmendedPetition = rawCase.orderForAmendedPetition;
    this.orderForAmendedPetitionAndFilingFee =
      rawCase.orderForAmendedPetitionAndFilingFee;
    this.orderForFilingFee = rawCase.orderForFilingFee;
    this.orderForRatification = rawCase.orderForRatification;
    this.orderToShowCause = rawCase.orderToShowCause;
    this.partyType = rawCase.partyType;
    this.petitionPaymentDate = rawCase.petitionPaymentDate;
    this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
    this.petitionPaymentStatus = rawCase.petitionPaymentStatus;
    this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;
    this.receivedAt = rawCase.receivedAt;
    this.useSameAsPrimary = rawCase.useSameAsPrimary;
    this.petitioners = rawCase.petitioners || [];

    this.statistics = Array.isArray(rawCase.statistics)
      ? rawCase.statistics.map(
          statistic => new Statistic(statistic, { applicationContext }),
        )
      : [];

    this.archivedDocketEntries = Array.isArray(rawCase.archivedDocketEntries)
      ? rawCase.archivedDocketEntries.map(
          doc => new DocketEntry(doc, { applicationContext }),
        )
      : [];

    this.archivedCorrespondences = Array.isArray(
      rawCase.archivedCorrespondences,
    )
      ? rawCase.archivedCorrespondences.map(
          correspondence =>
            new Correspondence(correspondence, { applicationContext }),
        )
      : [];

    const contacts = ContactFactory.createContacts({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
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
        .object(PDF.VALIDATION_RULES)
        .when('petitionPaymentStatus', {
          is: PAYMENT_STATUS.WAIVED,
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        }),
      archivedCorrespondences: Case.VALIDATION_RULES.archivedCorrespondences,
      archivedDocketEntries: Case.VALIDATION_RULES.archivedDocketEntries,
      caseCaption: JoiValidationConstants.CASE_CAPTION.required(),
      caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
      corporateDisclosureFile: joi
        .object(PDF.VALIDATION_RULES)
        .when('partyType', {
          is: joi
            .exist()
            .valid(
              PARTY_TYPES.corporation,
              PARTY_TYPES.partnershipAsTaxMattersPartner,
              PARTY_TYPES.partnershipBBA,
              PARTY_TYPES.partnershipOtherThanTaxMatters,
            ),
          otherwise: joi.optional().allow(null),
          then: joi.when('orderForCds', {
            is: joi.not(true),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          }),
        }),
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
      petitionFile: joi.object(PDF.VALIDATION_RULES).required(),
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
          then: joi.object(PDF.VALIDATION_RULES).required(),
        }),
      statistics: Case.VALIDATION_RULES.statistics,
      stinFile: joi.object(PDF.VALIDATION_RULES).optional(),
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
    return CaseInternal.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseInternal.VALIDATION_ERROR_MESSAGES;
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
