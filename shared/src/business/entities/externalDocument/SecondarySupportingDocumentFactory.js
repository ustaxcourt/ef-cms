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
function SecondarySupportingDocumentFactory() {}

/**
 *
 * @param documentMetadata
 */
SecondarySupportingDocumentFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      attachments: rawProps.attachments,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      documentType: rawProps.documentType,
      eventCode: rawProps.eventCode,
      exhibits: rawProps.exhibits,
      lodged: rawProps.lodged,
      secondarySupportingDocument: rawProps.secondarySupportingDocument,
      secondarySupportingDocumentFile: rawProps.secondarySupportingDocumentFile,
      secondarySupportingDocumentFileSize:
        rawProps.secondarySupportingDocumentFileSize,
      secondarySupportingDocumentFreeText:
        rawProps.secondarySupportingDocumentFreeText,
    });
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    exhibits: joi.boolean().required(),
    secondarySupportingDocument: joi.string().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    secondarySupportingDocumentFile: joi.object(),
    secondarySupportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    secondarySupportingDocumentFreeText: joi.string(),
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
      'Enter a Certificate of Service Date.',
    ],
    exhibits: 'Enter selection for Exhibits.',
    secondarySupportingDocument:
      'Enter selection for Secondary Supporting Document.',
    secondarySupportingDocumentFile: 'A file was not selected.',
    secondarySupportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Supporting Document file size is empty.',
    ],
    secondarySupportingDocumentFreeText: 'Please provide a value.',
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
      documentMetadata.secondarySupportingDocument,
    )
  ) {
    makeRequired('secondarySupportingDocumentFreeText');
  }

  if (
    includes(
      supportingDocumentFileCategories,
      documentMetadata.secondarySupportingDocument,
    )
  ) {
    makeRequired('secondarySupportingDocumentFile');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    undefined,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { SecondarySupportingDocumentFactory };
