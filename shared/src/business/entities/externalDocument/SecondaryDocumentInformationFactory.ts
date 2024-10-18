import { EXTERNAL_OBJECTION_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { makeRequiredHelper } from './externalDocumentHelpers';
import joi from 'joi';

export class SecondaryDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public category: string;
  public certificateOfService?: boolean;
  public certificateOfServiceDate: string;
  public documentType: string;
  public objections: string;
  public secondaryDocumentFile?: object;

  constructor(rawProps) {
    super('SecondaryDocumentInformationFactory');
    this.attachments = rawProps.attachments || false;
    this.category = rawProps.category;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentType = rawProps.documentType;
    this.objections = rawProps.objections;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;
  }

  getValidationRules() {
    let schema = {};

    let schemaOptionalItems = {
      attachments: joi
        .boolean()
        .messages({ '*': 'Enter selection for Attachments.' }),
      certificateOfService: joi.boolean().messages({
        '*': 'Indicate whether you are including a Certificate of Service',
      }),
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
        'now',
      ).messages({
        '*': 'Enter date of service',
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
      objections: JoiValidationConstants.STRING.messages({
        '*': 'Enter selection for Objections.',
      }),
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    if (this.secondaryDocumentFile) {
      makeRequired('attachments');
      makeRequired('certificateOfService');

      if (this.certificateOfService === true) {
        makeRequired('certificateOfServiceDate');
      }

      if (EXTERNAL_OBJECTION_DOCUMENT_TYPES.has(this.documentType)) {
        makeRequired('objections');
      }
    }
    return schema;
  }
}
