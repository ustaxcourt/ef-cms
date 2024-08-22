import {
  BUSINESS_TYPES,
  FILING_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  NOT_AVAILABLE_OPTION,
  PARTY_TYPES,
  PETITION_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '../EntityConstants';
import { ContactFactory } from '../contacts/ContactFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { getContactPrimary, getContactSecondary } from './Case';
import joi from 'joi';

/**
 * Represents a Case with required documents that a Petitioner is attempting to
 * add to the system.
 */
export class ElectronicPetition extends JoiValidationEntity {
  public attachmentToPetitionFile?: File;
  public attachmentToPetitionFileSize?: number;
  public businessType: string;
  public caseType: string;
  public corporateDisclosureFile?: object;
  public corporateDisclosureFileSize?: number;
  public countryType: string;
  public filingType: string;
  public hasIrsNotice: boolean;
  public irsNoticesRedactionAcknowledgement: string;
  public partyType: string;
  public petitioners: any;
  public petitionFile?: object;
  public petitionFileId?: string;
  public petitionFileSize?: number;
  public petitionRedactionAcknowledgement?: boolean;
  public petitionType: string;
  public preferredTrialCity: string;
  public procedureType: string;
  public stinFile?: object;
  public stinFileSize?: number;

  constructor(rawCase) {
    super('ElectronicPetition');

    this.attachmentToPetitionFile = rawCase.attachmentToPetitionFile;
    this.attachmentToPetitionFileSize = rawCase.attachmentToPetitionFileSize;
    this.businessType = rawCase.businessType;
    this.caseType = rawCase.caseType;
    this.countryType = rawCase.countryType;
    this.filingType = rawCase.filingType;
    this.hasIrsNotice = rawCase.hasIrsNotice;
    this.irsNoticesRedactionAcknowledgement =
      rawCase.irsNoticesRedactionAcknowledgement;
    this.partyType = rawCase.partyType;
    this.preferredTrialCity = rawCase.preferredTrialCity;
    this.procedureType = rawCase.procedureType;

    this.stinFile = rawCase.stinFile;
    this.stinFileSize = rawCase.stinFileSize;

    this.petitionFile = rawCase.petitionFile;
    this.petitionFileSize = rawCase.petitionFileSize;
    this.petitionFileId = rawCase.petitionFileId;
    this.petitionType = rawCase.petitionType || PETITION_TYPES.userUploaded;
    this.petitionRedactionAcknowledgement =
      rawCase.petitionRedactionAcknowledgement;

    this.corporateDisclosureFile = rawCase.corporateDisclosureFile;
    this.corporateDisclosureFileSize = rawCase.corporateDisclosureFileSize;

    const contacts = ContactFactory({
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });

    this.petitioners = [contacts.primary];
    if (contacts.secondary) {
      contacts.secondary.phone =
        contacts.secondary.phone || NOT_AVAILABLE_OPTION;
      this.petitioners.push(contacts.secondary);
    }
  }

  static VALIDATION_RULES = {
    attachmentToPetitionFile: joi.object().optional(),
    attachmentToPetitionFileSize:
      JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
        'attachmentToPetitionFile',
        {
          is: joi.exist().not(null),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        },
      ).messages({
        '*': 'Your ATP file size is empty',
        'number.max': `Your ATP file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    businessType: JoiValidationConstants.STRING.valid(
      ...Object.values(BUSINESS_TYPES),
    )
      .optional()
      .allow(null),
    caseType: JoiValidationConstants.STRING.when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).messages({ '*': 'Select a case type' }),
    corporateDisclosureFile: joi
      .object()
      .when('filingType', {
        is: 'A business',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Upload a Corporate Disclosure Statement' }),
    corporateDisclosureFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('corporateDisclosureFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Your Corporate Disclosure Statement file size is empty',
        'number.max': `Your Corporate Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    countryType: JoiValidationConstants.STRING.optional(),
    filingType: JoiValidationConstants.STRING.valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    )
      .required()
      .messages({ '*': 'Select on whose behalf you are filing' }),
    hasIrsNotice: joi
      .boolean()
      .required()
      .messages({ '*': 'Indicate whether you received an IRS notice' }),
    irsNoticesRedactionAcknowledgement: joi.boolean().when('hasIrsNotice', {
      is: true,
      otherwise: joi.optional(),
      then: joi.boolean().optional().invalid(false),
    }),
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    )
      .required()
      .messages({ '*': 'Select a party type' }),
    petitionFile: joi
      .object()
      .when('petitionType', {
        is: PETITION_TYPES.userUploaded,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Upload a Petition' }),
    petitionFileId: JoiValidationConstants.STRING.when('petitionType', {
      is: PETITION_TYPES.autoGenerated,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).messages({ '*': 'Generate a Petition' }),
    petitionFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('petitionFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Your Petition file size is empty',
        'number.max': `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    petitionRedactionAcknowledgement: joi.boolean().when('petitionType', {
      is: JoiValidationConstants.STRING.valid(PETITION_TYPES.userUploaded),
      otherwise: joi.optional(),
      then: joi.boolean().optional().invalid(false),
    }),
    petitionType: JoiValidationConstants.STRING.required().valid(
      ...Object.values(PETITION_TYPES),
    ),
    petitioners: joi
      .array()
      .description('List of Contact Entities for the case.')
      .optional(),
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
      .required()
      .messages({ '*': 'Select a trial location' }),
    procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
      .required()
      .messages({ '*': 'Select a case procedure' }),
    stinFile: joi.object().required().messages({
      '*': 'Upload a Statement of Taxpayer Identification Number (STIN)',
    }), // object of type File
    stinFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('stinFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Your STIN file size is empty',
        'number.max': `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
  };

  getValidationRules() {
    return ElectronicPetition.VALIDATION_RULES;
  }

  getContactPrimary() {
    return getContactPrimary(this);
  }

  getContactSecondary() {
    return getContactSecondary(this);
  }
}
