import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import {
  MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS,
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
} from './EntityConstants';
import { createISODateString } from '../utilities/DateHandler';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class PractitionerDocument extends JoiValidationEntity {
  public categoryType: string;
  public categoryName: string;
  public location: string;
  public practitionerDocumentFileId: string;
  public description: string;
  public fileName: string;
  public uploadDate: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawDocument, { applicationContext }) {
    super('Document');
    this.categoryType = rawDocument.categoryType;
    this.categoryName = rawDocument.categoryName;
    this.location = rawDocument.location;
    this.practitionerDocumentFileId =
      rawDocument.practitionerDocumentFileId ??
      applicationContext.getUniqueId();
    this.description = rawDocument.description;
    this.fileName = rawDocument.fileName;
    this.uploadDate = rawDocument.uploadDate || createISODateString();
  }

  getErrorToMessageMap() {
    return {
      categoryName: 'Enter a category name',
      categoryType: 'Enter a category type',
      location: 'Enter a location',
    };
  }

  getValidationRules() {
    return {
      categoryName: JoiValidationConstants.STRING.required(),
      categoryType: JoiValidationConstants.STRING.valid(
        ...Object.values(PRACTITIONER_DOCUMENT_TYPES),
      ).required(),
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
      }),
      practitionerDocumentFileId:
        JoiValidationConstants.UUID.required().description(
          'System-generated unique ID for the documents. If the document is associated with a document in S3, this is also the S3 document key.',
        ),
      uploadDate: JoiValidationConstants.ISO_DATE.required(),
    };
  }

  getValidationRules_NEW() {
    return {
      categoryName: JoiValidationConstants.STRING.required().messages(
        setDefaultErrorMessages('Enter a category name'),
      ),
      categoryType: JoiValidationConstants.STRING.valid(
        ...Object.values(PRACTITIONER_DOCUMENT_TYPES),
      )
        .required()
        .messages(setDefaultErrorMessages('Enter a category type')),
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
      }).messages(setDefaultErrorMessages('Enter a location')),
      practitionerDocumentFileId:
        JoiValidationConstants.UUID.required().description(
          'System-generated unique ID for the documents. If the document is associated with a document in S3, this is also the S3 document key.',
        ),
      uploadDate: JoiValidationConstants.ISO_DATE.required(),
    };
  }
}

declare global {
  type RawPractitionerDocument = ExcludeMethods<PractitionerDocument>;
}
