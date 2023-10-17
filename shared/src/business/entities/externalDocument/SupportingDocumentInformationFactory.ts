import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

import { JoiValidationConstants } from '../JoiValidationConstants';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../EntityConstants';
import { includes } from 'lodash';
import { makeRequiredHelper } from './externalDocumentHelpers';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class SupportingDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public certificateOfService: boolean;
  public certificateOfServiceDate: string;
  public supportingDocument: any;
  public supportingDocumentFile: object;
  public supportingDocumentFileSize?: number;
  public supportingDocumentFreeText: string;

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

  getValidationRules() {
    let schema = {
      attachments: joi
        .boolean()
        .required()
        .messages(setDefaultErrorMessage('Enter selection for Attachments.')),
      certificateOfService: joi
        .boolean()
        .required()
        .messages(
          setDefaultErrorMessage(
            'Indicate whether you are including a Certificate of Service',
          ),
        ),
      supportingDocument: JoiValidationConstants.STRING.required().messages(
        setDefaultErrorMessage('Select a document type'),
      ),
    };

    let schemaOptionalItems = {
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
        'now',
      ).messages({
        ...setDefaultErrorMessage('Enter date of service'),
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
      supportingDocumentFile: joi
        .object()
        .messages(setDefaultErrorMessage('Upload a document')),
      supportingDocumentFileSize: joi
        .number()
        .optional()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer()
        .messages({
          ...setDefaultErrorMessage(
            'Your Supporting Document file size is empty.',
          ),
          'number.max': `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        }),
      supportingDocumentFreeText: JoiValidationConstants.STRING.messages(
        setDefaultErrorMessage('Enter name'),
      ),
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    if (this.certificateOfService === true) {
      makeRequired('certificateOfServiceDate');
    }

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
