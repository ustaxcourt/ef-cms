const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const { includes } = require('lodash');

/**
 *
 * @constructor
 */
function SupportingDocumentInformationFactory() {}

/**
 *
 * @param documentMetadata
 */
SupportingDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      attachments: rawProps.attachments,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      supportingDocument: rawProps.supportingDocument,
      supportingDocumentFile: rawProps.supportingDocumentFile,
      supportingDocumentFileSize: rawProps.supportingDocumentFileSize,
      supportingDocumentFreeText: rawProps.supportingDocumentFreeText,
    });
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    supportingDocument: joi.string().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    supportingDocumentFile: joi.object(),
    supportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    supportingDocumentFreeText: joi.string(),
  };

  let errorToMessageMap = {
    attachments: 'Enter selection for Attachments.',
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date is in the future. Please enter a valid date.',
      },
      'Enter date for Certificate of Service.',
    ],
    supportingDocument: 'Select a Document Type.',
    supportingDocumentFile: 'Upload a document.',
    supportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Supporting Document file size is empty.',
    ],
    supportingDocumentFreeText: 'Enter name.',
  };

  const makeRequired = itemName => {
    if (schemaOptionalItems[itemName]) {
      schema[itemName] = schemaOptionalItems[itemName].required();
    }
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

  joiValidationDecorator(
    entityConstructor,
    schema,
    undefined,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { SupportingDocumentInformationFactory };
