import {
  CASE_TYPES,
  FILING_TYPES,
  MAX_FILE_SIZE_MB,
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
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

/**
 * Represents a Case with required documents that a Petitions Clerk is
 *  attempting to add to the system.
 *
 */
export class CaseInternal extends JoiValidationEntity {
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

  constructor(rawProps, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }
    super('CaseInternal');

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
        .object()
        .when('petitionPaymentStatus', {
          is: PAYMENT_STATUS.WAIVED,
          otherwise: joi.optional().allow(null),
          then: joi.required(),
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
      corporateDisclosureFile: joi.object().when('partyType', {
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
      corporateDisclosureFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'corporateDisclosureFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
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
      petitionFile: joi.object().required(), // object of type File
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
          then: joi.object().required(), // object of type File
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
    return CaseInternal.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = joi
    .object()
    .keys({
      applicationForWaiverOfFilingFeeFile: joi
        .object()
        .when('petitionPaymentStatus', {
          is: PAYMENT_STATUS.WAIVED,
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        })
        .messages(
          setDefaultErrorMessage(
            'Upload or scan an Application for Waiver of Filing Fee (APW)',
          ),
        ),
      applicationForWaiverOfFilingFeeFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'applicationForWaiverOfFilingFeeFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ).messages({
          ...setDefaultErrorMessage(
            'Your Filing Fee Waiver file size is empty',
          ),
          'number.max': `Your Filing Fee Waiver file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        }),
      archivedCorrespondences:
        Case.VALIDATION_RULES_NEW.archivedCorrespondences,
      archivedDocketEntries: Case.VALIDATION_RULES_NEW.archivedDocketEntries,
      caseCaption: JoiValidationConstants.CASE_CAPTION.required().messages(
        setDefaultErrorMessage('Enter a case caption'),
      ),
      caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES)
        .required()
        .messages(setDefaultErrorMessage('Select a case type')),
      corporateDisclosureFile: joi
        .object()
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
        })
        .messages(
          setDefaultErrorMessage(
            'Upload or scan Corporate Disclosure Statement(CDS)',
          ),
        ),
      corporateDisclosureFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'corporateDisclosureFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ).messages({
          ...setDefaultErrorMessage(
            'Your Corporate Disclosure Statement file size is empty',
          ),
          'number.max': `Your Corporate Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        }),
      filingType: JoiValidationConstants.STRING.valid(
        ...FILING_TYPES[ROLES.petitioner],
        ...FILING_TYPES[ROLES.privatePractitioner],
      )
        .optional()
        .messages(
          setDefaultErrorMessage('Select on whose behalf you are filing'),
        ),
      hasVerifiedIrsNotice: joi
        .boolean()
        .required()
        .messages(
          setDefaultErrorMessage('Indicate whether you received an IRS notice'),
        ),
      irsNoticeDate: Case.VALIDATION_RULES_NEW.irsNoticeDate,
      mailingDate: JoiValidationConstants.STRING.max(25)
        .required()
        .messages(setDefaultErrorMessage('Enter a mailing date')),
      noticeOfAttachments: Case.VALIDATION_RULES_NEW.noticeOfAttachments,
      orderDesignatingPlaceOfTrial:
        Case.VALIDATION_RULES_NEW.orderDesignatingPlaceOfTrial,
      orderForAmendedPetition:
        Case.VALIDATION_RULES_NEW.orderForAmendedPetition,
      orderForAmendedPetitionAndFilingFee:
        Case.VALIDATION_RULES_NEW.orderForAmendedPetitionAndFilingFee,
      orderForCds: Case.VALIDATION_RULES_NEW.orderForCds,
      orderForFilingFee: Case.VALIDATION_RULES_NEW.orderForFilingFee,
      orderForRatification: Case.VALIDATION_RULES_NEW.orderForRatification,
      orderToShowCause: Case.VALIDATION_RULES_NEW.orderToShowCause,
      partyType: JoiValidationConstants.STRING.valid(
        ...Object.values(PARTY_TYPES),
      )
        .required()
        .messages(setDefaultErrorMessage('Select a party type')),
      petitionFile: joi
        .object()
        .required()
        .messages(setDefaultErrorMessage('Upload or scan a Petition')), // object of type File
      petitionFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'petitionFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ).messages({
        ...setDefaultErrorMessage('Your Petition file size is empty'),
        'number.max': `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
      petitionPaymentDate: JoiValidationConstants.ISO_DATE.max('now')
        .when('petitionPaymentStatus', {
          is: PAYMENT_STATUS.PAID,
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        })
        .messages({
          ...setDefaultErrorMessage('Enter a valid payment date'),
          'date.max':
            'Payment date cannot be in the future. Enter a valid date.',
        }),
      petitionPaymentMethod: Case.VALIDATION_RULES_NEW.petitionPaymentMethod,
      petitionPaymentStatus:
        Case.VALIDATION_RULES_NEW.petitionPaymentStatus.messages(
          setDefaultErrorMessage('Select a filing fee option'),
        ),
      petitionPaymentWaivedDate:
        Case.VALIDATION_RULES_NEW.petitionPaymentWaivedDate,
      petitioners: Case.VALIDATION_RULES_NEW.petitioners,
      preferredTrialCity: joi
        .alternatives()
        .conditional('requestForPlaceOfTrialFile', {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: JoiValidationConstants.STRING.required(),
        })
        .messages(setDefaultErrorMessage('Select a preferred trial location')),
      procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
        .required()
        .messages(setDefaultErrorMessage('Select a case procedure')),
      receivedAt: JoiValidationConstants.ISO_DATE.max('now')
        .required()
        .messages({
          ...setDefaultErrorMessage('Enter a valid date received'),
          'date.max':
            'Date received cannot be in the future. Enter a valid date.',
        }),
      requestForPlaceOfTrialFile: joi
        .alternatives()
        .conditional('preferredTrialCity', {
          is: joi.exist().not(null),
          otherwise: joi.object().optional(),
          then: joi.object().required(), // object of type File
        })
        .messages(
          setDefaultErrorMessage(
            'Upload or scan a Request for Place of Trial (RQT)',
          ),
        ),
      requestForPlaceOfTrialFileSize:
        JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
          'requestForPlaceOfTrialFile',
          {
            is: joi.exist().not(null),
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ).messages({
          ...setDefaultErrorMessage(
            'Your Request for Place of Trial file size is empty',
          ),
          'number.max': `Your Request for Place of Trial file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        }),
      statistics: Case.VALIDATION_RULES_NEW.statistics,
      stinFile: joi
        .object()
        .optional()
        .messages(
          setDefaultErrorMessage(
            'Upload a Statement of Taxpayer Identification Number (STIN)',
          ),
        ), // object of type File
      stinFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'stinFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ).messages({
        ...setDefaultErrorMessage('Your STIN file size is empty'),
        'number.max': `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
      useSameAsPrimary: Case.VALIDATION_RULES_NEW.useSameAsPrimary,
    })
    .or(
      'preferredTrialCity',
      'requestForPlaceOfTrialFile',
      'orderDesignatingPlaceOfTrial',
    );

  getValidationRules_NEW() {
    return CaseInternal.VALIDATION_RULES_NEW;
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

  getValidationErrors_NEW() {
    const validationErrors = super.getValidationErrors_NEW();
    if (!validationErrors) return validationErrors;

    validationErrors?.details.forEach(d => {
      if (d.type === 'object.missing') {
        d.type = 'chooseAtLeastOneValue';
        d.context.key = 'chooseAtLeastOneValue';
        d.context.label = 'chooseAtLeastOneValue';
        d.message =
          'Select trial location and upload/scan RQT or check Order Designating Place of Trial';
      }
    });

    return validationErrors;
  }
}
