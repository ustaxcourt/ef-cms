import { PDF } from '../documents/PDF';

const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { includes } = require('lodash');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { makeRequiredHelper } = require('./externalDocumentHelpers');

/**
 * Supporting Document Information Factory entity
 *
 * @param {object} documentMetadata the document metadata
 * @param {object} VALIDATION_ERROR_MESSAGES the error to message map constant
 * @constructor
 */
function SupportingDocumentInformationFactory(
  documentMetadata,
  VALIDATION_ERROR_MESSAGES,
) {
  /**
   * bare constructor for entity factory
   */
  function entityConstructor() {}

  entityConstructor.prototype.init = function init(rawProps) {
    this.attachments = rawProps.attachments || false;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.supportingDocument = rawProps.supportingDocument;
    this.supportingDocumentFreeText = rawProps.supportingDocumentFreeText;

    if (rawProps.supportingDocumentFile) {
      this.supportingDocumentFile = new PDF({
        file: rawProps.supportingDocumentFile,
        size: rawProps.supportingDocumentFileSize,
      });
    }
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    supportingDocument: JoiValidationConstants.STRING.required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
    supportingDocumentFile: joi.object(PDF.VALIDATION_RULES),
    supportingDocumentFreeText: JoiValidationConstants.STRING,
  };

  const makeRequired = itemName => {
    makeRequiredHelper({
      itemName,
      schema,
      schemaOptionalItems,
    });
  };

  if (documentMetadata.certificateOfService === true) {
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
    includes(
      supportingDocumentFreeTextCategories,
      documentMetadata.supportingDocument,
    )
  ) {
    makeRequired('supportingDocumentFreeText');
  }

  if (
    includes(
      supportingDocumentFileCategories,
      documentMetadata.supportingDocument,
    )
  ) {
    makeRequired('supportingDocumentFile');
  }

  joiValidationDecorator(entityConstructor, schema, VALIDATION_ERROR_MESSAGES);

  return new (validEntityDecorator(entityConstructor))(documentMetadata);
}

module.exports = { SupportingDocumentInformationFactory };
