import {
  BUSINESS_TYPES,
  ESTATE_TYPES,
  FILING_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  OTHER_TYPES,
  ROLES,
} from '../EntityConstants';
import { ContactFactoryUpdated } from '../contacts/ContactFactoryUpdated';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class UploadPetitionStep2 extends JoiValidationEntity {
  public businessType: string;
  public corporateDisclosureFile: File;
  public corporateDisclosureFileSize: string;
  public countryType: string;
  public filingType: string;
  public partyType: string;
  public isSpouseDeceased: string;
  public otherType: string;
  public hasSpouseConsent: boolean;
  public estateType: string;
  public minorIncompetentType: string;
  public contactPrimary?: {};
  public contactSecondary?: {};

  constructor(rawProps) {
    super('UploadPetitionStep2');

    this.businessType = rawProps.businessType;
    this.corporateDisclosureFile = rawProps.corporateDisclosureFile;
    this.corporateDisclosureFileSize = rawProps.corporateDisclosureFileSize;
    this.countryType = rawProps.countryType;
    this.filingType = rawProps.filingType;
    this.partyType = rawProps.partyType;
    this.isSpouseDeceased = rawProps.isSpouseDeceased;
    this.otherType = rawProps.otherType;
    this.hasSpouseConsent = rawProps.hasSpouseConsent;
    this.estateType = rawProps.estateType;
    this.minorIncompetentType = rawProps.minorIncompetentType;

    const contactInfo = ContactFactoryUpdated({
      contactInfoPrimary: rawProps.contactPrimary,
      contactInfoSecondary: rawProps.contactSecondary,
      hasSpouseConsent: rawProps.hasSpouseConsent,
      partyType: rawProps.partyType,
      petitionType: rawProps.petitionType,
    });

    if (contactInfo.primary) {
      this.contactPrimary = contactInfo.primary;
    }

    if (contactInfo.secondary) {
      this.contactSecondary = contactInfo.secondary;
    }
  }

  static VALIDATION_RULES = {
    businessType: JoiValidationConstants.STRING.valid(
      ...Object.values(BUSINESS_TYPES),
    )
      .when('filingType', {
        is: 'A business',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Select a business type' }),
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
    estateType: JoiValidationConstants.STRING.valid(
      ...Object.values(ESTATE_TYPES),
    )
      .when('otherType', {
        is: 'An estate or trust',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Select a type of estate or trust' }),
    filingType: JoiValidationConstants.STRING.valid(
      ...FILING_TYPES[ROLES.petitioner],
    )
      .required()
      .messages({ '*': 'Select on whose behalf you are filing' }),
    hasSpouseConsent: joi
      .boolean()
      .when('isSpouseDeceased', {
        is: 'No',
        otherwise: joi.optional().allow(null),
        then: joi.boolean().valid(true).required(),
      })
      .messages({
        '*': "Check the box to confirm that you have your spouse's consent",
      }),
    isSpouseDeceased: joi
      .string()
      .valid('Yes', 'No')
      .when('filingType', {
        is: 'Myself and my spouse',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Select an answer to "Is your spouse deceased?"' }),
    minorIncompetentType: JoiValidationConstants.STRING.valid(
      ...Object.values(OTHER_TYPES),
    )
      .when('otherType', {
        is: 'A minor or legally incompetent person',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Select a role' }),
    otherType: JoiValidationConstants.STRING.valid(
      ...[
        'An estate or trust',
        'A minor or legally incompetent person',
        'Donor',
        'Transferee',
        'Deceased Spouse',
      ],
    )
      .when('filingType', {
        is: 'Other',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({ '*': 'Select an other type of taxpayer' }),
    partyType: joi.required(), // This will be undefined when any sub radios are not selected
  };

  getValidationRules() {
    return UploadPetitionStep2.VALIDATION_RULES;
  }

  getFormattedValidationErrors(): Record<string, any> | null {
    const errors = super.getFormattedValidationErrors();
    // // If partyType is failing and user selects "Myself and my spouse" as the filing type
    // // don't show party type error since we show the isSpousedDeceased error
    if (errors?.partyType && this.filingType === 'Myself and my spouse') {
      return {
        ...errors,
        partyType: undefined,
      };
    }
    // If partyType is failing that means user has not selected all the radio buttons
    // meaning if that is the case we should not be displaying errors for the contact
    if (errors?.partyType)
      return {
        ...errors,
        contactPrimary: undefined,
        partyType: undefined,
      };
    return errors;
  }
}

export type RawUploadPetitionStep2 = ExcludeMethods<
  Omit<UploadPetitionStep2, 'entityName'>
>;
