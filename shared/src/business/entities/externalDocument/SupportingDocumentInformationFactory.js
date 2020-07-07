const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');
const { makeRequiredHelper } = require('./externalDocumentHelpers');
const { MAX_FILE_SIZE_BYTES } = require('../EntityConstants');

/**
 *
 * @constructor
 */
function SupportingDocumentInformationFactory() {}

/**
 *
 * @param {object} documentMetadata the document metadata
 * @param {object} VALIDATION_ERROR_MESSAGES the error to message map constant
 * @returns {object} the created document
 */
SupportingDocumentInformationFactory.get = (
  documentMetadata,
  VALIDATION_ERROR_MESSAGES,
) => {
  let entityConstructor = function (rawProps) {
    this.attachments = rawProps.attachments;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.supportingDocument = rawProps.supportingDocument;
    this.supportingDocumentFile = rawProps.supportingDocumentFile;
    this.supportingDocumentFileSize = rawProps.supportingDocumentFileSize;
    this.supportingDocumentFreeText = rawProps.supportingDocumentFreeText;
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    supportingDocument: joi.string().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
    supportingDocumentFile: joi.object(),
    supportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    supportingDocumentFreeText: joi.string(),
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

  return new entityConstructor(documentMetadata);
};

module.exports = { SupportingDocumentInformationFactory };
