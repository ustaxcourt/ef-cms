const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes, get } = require('lodash');

/**
 *
 * @constructor
 */
function ExternalDocumentInformationFactory() {}

/**
 *
 * @param documentMetadata
 */
ExternalDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, rawProps);
  };
  let schema = {};
  let errorToMessageMap = {};
  let customValidate;

  const addProperty = (itemName, itemSchema, itemErrorMessage) => {
    schema[itemName] = itemSchema;
    if (itemErrorMessage) {
      errorToMessageMap[itemName] = itemErrorMessage;
    }
  };

  const supportingDocumentFreeTextCategories = ['Memorandum', 'Brief'];
  const supportingDocumentFileCategories = [
    'Memorandum',
    'Brief',
    'Affidavit',
    'Declaration',
    'Unsworn Declaration under Penalty of Perjury',
  ];

  addProperty('primaryDocument', joi.object().required(), [
    'A file was not selected.',
  ]);

  addProperty('certificateOfService', joi.boolean().required(), [
    'Certificate Of Service is required.',
  ]);

  if (documentMetadata.certificateOfService === true) {
    addProperty(
      'certificateOfServiceDate',
      joi
        .date()
        .iso()
        .max('now')
        .required(),
      [
        {
          contains: 'must be less than or equal to',
          message: 'Service date is in the future. Please enter a valid date.',
        },
        'You must provide a service date.',
      ],
    );
  }

  addProperty('exhibits', joi.boolean().required(), ['Exhibits is required.']);

  addProperty('attachments', joi.boolean().required(), [
    'Attachments is required.',
  ]);

  if (
    documentMetadata.category === 'Motion' ||
    includes(
      [
        'Motion to Withdraw Counsel',
        'Motion to Withdraw As Counsel',
        'Application to Take Deposition',
      ],
      documentMetadata.documentType,
    )
  ) {
    // NOTE: objections isn't a boolean
    addProperty('objections', joi.string().required(), [
      'Objections is required.',
    ]);
  }

  addProperty('hasSupportingDocuments', joi.boolean().required(), [
    'Has Supporting Documents is required.',
  ]);

  if (documentMetadata.hasSupportingDocuments === true) {
    addProperty('supportingDocument', joi.string().required(), [
      'You must select a supporting document type.',
    ]);

    if (
      includes(
        supportingDocumentFreeTextCategories,
        documentMetadata.supportingDocument,
      )
    ) {
      addProperty('supportingDocumentFreeText', joi.string().required(), [
        'Please provide a value.',
      ]);
    }

    if (
      includes(
        supportingDocumentFileCategories,
        documentMetadata.supportingDocument,
      )
    ) {
      addProperty('supportingDocumentFile', joi.object().required(), [
        'A file was not selected.',
      ]);
    }
  }

  if (
    get(documentMetadata, 'secondaryDocument.scenario', '')
      .toLowerCase()
      .trim() === 'nonstandard h'
  ) {
    if (
      includes(
        documentMetadata.secondaryDocument.documentType,
        'Motion for Leave to File Out of Time',
      )
    ) {
      addProperty('secondaryDocumentFile', joi.object().required(), [
        'A file was not selected.',
      ]);
    } else {
      addProperty('secondaryDocumentFile', joi.object().optional(), [
        'A file was not selected.',
      ]);
    }

    addProperty('hasSecondarySupportingDocuments', joi.boolean().required(), [
      'Has Secondary Supporting Documents is required.',
    ]);

    if (documentMetadata.hasSecondarySupportingDocuments === true) {
      addProperty('secondarySupportingDocument', joi.string().required(), [
        'Has Secondary Supporting Documents is required.',
      ]);

      if (
        includes(
          supportingDocumentFreeTextCategories,
          documentMetadata.supportingDocument,
        )
      ) {
        addProperty(
          'secondarySupportingDocumentFreeText',
          joi.string().required(),
          ['Please provide a value.'],
        );
      }

      if (
        includes(
          supportingDocumentFileCategories,
          documentMetadata.supportingDocument,
        )
      ) {
        addProperty(
          'secondarySupportingDocumentFile',
          joi.object().required(),
          ['A file was not selected.'],
        );
      }
    }
  }

  addProperty('partyPrimary', joi.boolean().optional());
  addProperty('partySecondary', joi.boolean().optional());
  addProperty('partyRespondent', joi.boolean().optional());

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { ExternalDocumentInformationFactory };
