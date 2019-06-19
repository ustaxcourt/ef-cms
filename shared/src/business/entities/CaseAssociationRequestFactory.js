const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
} = require('../../persistence/s3/getUploadPolicy');
const { replaceBracketed } = require('../utilities/replaceBracketed');

/**
 * @param rawProps
 * @constructor
 */
function CaseAssociationRequestFactory(rawProps) {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      attachments: rawProps.attachments,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      documentTitle: rawProps.documentTitle,
      documentTitleTemplate: rawProps.documentTitleTemplate,
      documentType: rawProps.documentType,
      eventCode: rawProps.eventCode,
      exhibits: rawProps.exhibits,
      hasSupportingDocuments: rawProps.hasSupportingDocuments,
      objections: rawProps.objections,
      partyPractitioner: rawProps.partyPractitioner,
      partyRespondent: rawProps.partyRespondent,
      primaryDocumentFile: rawProps.primaryDocumentFile,
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
      scenario: rawProps.scenario,
      supportingDocument: rawProps.supportingDocument,
      supportingDocumentFile: rawProps.supportingDocumentFile,
      supportingDocumentFreeText: rawProps.supportingDocumentFreeText,
    });
  };

  const documentWithExhibits = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(rawProps.documentType);

  const documentWithAttachments = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(rawProps.documentType);

  const documentWithObjections = [
    'Substitution of Counsel',
    'Motion to Substitute Parties and Change Caption',
  ].includes(rawProps.documentType);

  const documentWithSupportingDocuments = [
    'Motion to Substitute Parties and Change Caption',
  ].includes(rawProps.documentType);

  const documentWithConcatentatedPetitionerNames = [
    'Entry of Appearance',
    'Substitution of Counsel',
  ].includes(rawProps.documentType);

  const supportingDocumentWithFreeText = [
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ].includes(rawProps.supportingDocument);

  const supportingDocumentWithFile = [
    'Memorandum in Support',
    'Brief in Support',
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ].includes(rawProps.supportingDocument);

  entityConstructor.prototype.getDocumentTitle = function(
    contactPrimaryName,
    contactSecondaryName,
  ) {
    let petitionerNames;
    if (rawProps.partyRespondent) {
      petitionerNames = 'Respondent';
    } else {
      const petitionerNamesArray = [];
      if (rawProps.representingPrimary) {
        petitionerNamesArray.push(contactPrimaryName);
      }
      if (rawProps.representingSecondary) {
        petitionerNamesArray.push(contactSecondaryName);
      }
      if (petitionerNamesArray.length > 1) {
        petitionerNames = 'Petrs. ';
      } else {
        petitionerNames = 'Petr. ';
      }
      petitionerNames += petitionerNamesArray.join(' & ');
    }

    if (documentWithConcatentatedPetitionerNames) {
      return replaceBracketed(rawProps.documentTitleTemplate, petitionerNames);
    } else {
      return rawProps.documentTitleTemplate;
    }
  };

  let schema = {
    certificateOfService: joi.boolean().required(),
    documentTitle: joi.string().optional(),
    documentTitleTemplate: joi.string().required(),
    documentType: joi.string().required(),
    eventCode: joi.string().required(),
    primaryDocumentFile: joi.object().required(),
    scenario: joi.string().required(),
  };

  let schemaOptionalItems = {
    attachments: joi.boolean().required(),
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    exhibits: joi.boolean().required(),
    hasSupportingDocuments: joi.boolean().required(),
    objections: joi.string().required(),
    representingPrimary: joi
      .boolean()
      .invalid(false)
      .required(),
    representingSecondary: joi
      .boolean()
      .invalid(false)
      .required(),
    supportingDocument: joi.string().required(),
    supportingDocumentFile: joi.object().required(),
    supportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer()
      .required(),
    supportingDocumentFreeText: joi.string().required(),
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
    documentTitleTemplate: 'Select a document.',
    documentType: 'Select a document.',
    eventCode: 'Select a document.',
    exhibits: 'Enter selection for Exhibits.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    objections: 'Enter selection for Objections.',
    primaryDocumentFile: 'A file was not selected.',
    representingPrimary: 'Select a party.',
    representingSecondary: 'Select a party.',
    scenario: 'Select a document.',
    supportingDocument: 'Enter selection for Supporting Document.',
    supportingDocumentFile: 'A file was not selected.',
    supportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty.',
    ],
    supportingDocumentFreeText: 'Please provide a value.',
  };

  let customValidate;

  const makeRequired = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  if (rawProps.certificateOfService === true) {
    makeRequired('certificateOfServiceDate');
  }

  if (documentWithExhibits) {
    makeRequired('exhibits');
  }

  if (documentWithAttachments) {
    makeRequired('attachments');
  }

  if (documentWithObjections) {
    makeRequired('objections');
  }

  if (documentWithSupportingDocuments) {
    makeRequired('hasSupportingDocuments');

    if (rawProps.hasSupportingDocuments === true) {
      makeRequired('supportingDocument');

      if (supportingDocumentWithFreeText) {
        makeRequired('supportingDocumentFreeText');
      }

      if (supportingDocumentWithFile) {
        makeRequired('supportingDocumentFile');
      }
    }
  }

  if (
    rawProps.representingPrimary !== true &&
    rawProps.representingSecondary !== true &&
    rawProps.partyRespondent !== true
  ) {
    makeRequired('representingPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(rawProps);
}

module.exports = { CaseAssociationRequestFactory };
