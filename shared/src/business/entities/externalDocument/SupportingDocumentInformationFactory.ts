import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../EntityConstants';
import { includes } from 'lodash';
import { makeRequiredHelper } from './externalDocumentHelpers';
import joi from 'joi';

export class SupportingDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public certificateOfService: boolean;
  public certificateOfServiceDate?: string;
  public supportingDocument: any;
  public supportingDocumentFile?: object;
  public supportingDocumentFileSize?: number;
  public supportingDocumentFreeText?: string;

  constructor(rawProps) {
    super('SupportingDocumentInformationFactory');

    this.attachments = rawProps.attachments || false;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.supportingDocument = rawProps.supportingDocument;
    this.supportingDocumentFile = rawProps.supportingDocumentFile;
    this.supportingDocumentFileSize = rawProps.supportingDocumentFileSize;
    this.supportingDocumentFreeText = rawProps.supportingDocumentFreeText;
  }

  static VALIDATION_RULES = {
    attachments: joi
      .boolean()
      .required()
      .messages({ '*': 'Enter selection for Attachments.' }),
    certificateOfService: joi.boolean().required().messages({
      '*': 'Indicate whether you are including a Certificate of Service',
    }),
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now')
      .when('certificateOfService', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Enter date of service',
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
    supportingDocument: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a document type',
    }),
  };

  getValidationRules() {
    let schema = { ...SupportingDocumentInformationFactory.VALIDATION_RULES };

    let schemaOptionalItems = {
      supportingDocumentFile: joi
        .object()
        .messages({ '*': 'Upload a document' }),
      supportingDocumentFileSize: joi
        .number()
        .optional()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer()
        .messages({
          '*': 'Your Supporting Document file size is empty.',
          'number.max': `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        }),
      supportingDocumentFreeText: JoiValidationConstants.STRING.messages({
        '*': 'Enter name',
      }),
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    const supportingDocumentFreeTextCategories = [
      'Affidavit in Support',
      'Declaration in Support',
      'Unsworn Declaration under Penalty of Perjury in Support',
    ];

    const supportingDocumentFileCategories = [
      'Memorandum in Support',
      'Brief in Support',
      'Affidavit in Support',
      'Declaration in Support',
      'Unsworn Declaration under Penalty of Perjury in Support',
    ];

    if (
      includes(supportingDocumentFreeTextCategories, this.supportingDocument)
    ) {
      makeRequired('supportingDocumentFreeText');
    }

    if (includes(supportingDocumentFileCategories, this.supportingDocument)) {
      makeRequired('supportingDocumentFile');
    }

    return schema;
  }
}
