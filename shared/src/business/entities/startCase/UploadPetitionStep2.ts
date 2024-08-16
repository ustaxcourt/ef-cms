import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  PETITION_TYPES,
} from '../EntityConstants';
import joi from 'joi';

export class UploadPetitionStep2 extends JoiValidationEntity {
  public petitionRedactionAcknowledgement?: boolean;
  public petitionFile?: File;
  public petitionFileSize?: number;
  public petitionType: (typeof PETITION_TYPES)[keyof typeof PETITION_TYPES];
  public petitionFacts?: string[];
  public petitionReasons?: string[];

  constructor(rawProps) {
    super('UploadPetitionStep2');
    this.petitionRedactionAcknowledgement =
      rawProps.petitionRedactionAcknowledgement;
    this.petitionFile = rawProps.petitionFile;
    this.petitionFileSize = rawProps.petitionFileSize;
    this.petitionType = rawProps.petitionType;
    this.petitionFacts = rawProps.petitionFacts;
    this.petitionReasons = rawProps.petitionReasons;
  }

  static PETITION_FACT_MAX_LENGTH = 9000;
  static PETITION_REASON_MAX_LENGTH = 9000;

  static VALIDATION_RULES = {
    petitionFacts: joi
      .when('petitionType', {
        is: PETITION_TYPES.autoGenerated,
        otherwise: joi.optional(),
        then: joi
          .array()
          .min(1)
          .items(
            JoiValidationConstants.STRING.max(this.PETITION_FACT_MAX_LENGTH),
          )
          .required(),
      })
      .messages({
        '*': 'Add at least one fact',
        'string.max': `Facts cannot exceed ${this.PETITION_FACT_MAX_LENGTH} characters`,
      }),
    petitionFile: joi.object().when('petitionType', {
      is: JoiValidationConstants.STRING.valid(PETITION_TYPES.userUploaded),
      otherwise: joi.optional(),
      then: joi
        .object()
        .required()
        .messages({ '*': 'Upload the Petition PDF' }),
    }),
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
    petitionReasons: joi
      .when('petitionType', {
        is: PETITION_TYPES.autoGenerated,
        otherwise: joi.optional(),
        then: joi
          .array()
          .min(1)
          .items(
            JoiValidationConstants.STRING.max(this.PETITION_REASON_MAX_LENGTH),
          )
          .required(),
      })
      .messages({
        '*': 'Add at least one reason',
        'string.max': `Reasons cannot exceed ${this.PETITION_REASON_MAX_LENGTH} characters`,
      }),
    petitionRedactionAcknowledgement: joi.boolean().when('petitionType', {
      is: PETITION_TYPES.userUploaded,
      otherwise: joi.optional(),
      then: joi.boolean().required().valid(true),
    }),
    petitionType: joi
      .string()
      .required()
      .valid(PETITION_TYPES.autoGenerated, PETITION_TYPES.userUploaded),
  };

  getValidationRules() {
    return UploadPetitionStep2.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep2 = ExcludeMethods<
  Omit<UploadPetitionStep2, 'entityName'>
>;
