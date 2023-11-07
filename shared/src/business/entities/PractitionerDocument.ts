import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS,
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
} from './EntityConstants';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';

export class PractitionerDocument extends JoiValidationEntity {
  public categoryName: string;
  public categoryType: string;
  public description: string;
  public fileName: string;
  public location: string;
  public practitionerDocumentFileId: string;
  public uploadDate: string;

  constructor(rawDocument, { applicationContext }) {
    super('Document');

    this.categoryName = rawDocument.categoryName;
    this.categoryType = rawDocument.categoryType;
    this.description = rawDocument.description;
    this.fileName = rawDocument.fileName;
    this.location = rawDocument.location;
    this.practitionerDocumentFileId =
      rawDocument.practitionerDocumentFileId ??
      applicationContext.getUniqueId();
    this.uploadDate = rawDocument.uploadDate || createISODateString();
  }

  static VALIDATION_RULES = {
    categoryName: JoiValidationConstants.STRING.required().messages({
      '*': 'Enter a category name',
    }),
    categoryType: JoiValidationConstants.STRING.valid(
      ...Object.values(PRACTITIONER_DOCUMENT_TYPES),
    )
      .required()
      .messages({ '*': 'Enter a category type' }),
    description: JoiValidationConstants.STRING.max(
      MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS,
    )
      .optional()
      .allow(''),
    fileName: JoiValidationConstants.STRING.required(),
    location: JoiValidationConstants.STRING.when('categoryType', {
      is: PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).messages({ '*': 'Enter a location' }),
    practitionerDocumentFileId:
      JoiValidationConstants.UUID.required().description(
        'System-generated unique ID for the documents. If the document is associated with a document in S3, this is also the S3 document key.',
      ),
    uploadDate: JoiValidationConstants.ISO_DATE.required(),
  };

  getValidationRules() {
    return PractitionerDocument.VALIDATION_RULES;
  }
}

export type RawPractitionerDocument = ExcludeMethods<PractitionerDocument>;
