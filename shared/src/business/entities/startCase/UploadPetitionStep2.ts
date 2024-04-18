import {
  BUSINESS_TYPES,
  FILING_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  OTHER_TYPES,
  // PARTY_TYPES,
  ROLES,
} from '../EntityConstants';
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
      ...Object.values(OTHER_TYPES),
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
    // partyType: JoiValidationConstants.STRING.valid(
    //   ...Object.values(PARTY_TYPES),
    // )
    //   .required()
    //   .messages({ '*': 'Select a party type' }),
  };

  getValidationRules() {
    return UploadPetitionStep2.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep2 = ExcludeMethods<
  Omit<UploadPetitionStep2, 'entityName'>
>;
