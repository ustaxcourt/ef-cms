const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  SupportingDocumentInformationFactory,
} = require('./externalDocument/SupportingDocumentInformationFactory');
const { replaceBracketed } = require('../utilities/replaceBracketed');

const {
  VALIDATION_ERROR_MESSAGES,
} = require('./externalDocument/ExternalDocumentInformationFactory');

CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  documentTitleTemplate: 'Select a document',
  eventCode: 'Select a document',
  exhibits: 'Enter selection for Exhibits.',
  representingPrimary: 'Select a party',
  representingSecondary: 'Select a party',
  scenario: 'Select a document',
};

/**
 * Case Association Request Factory entity
 *
 * @param {object} rawProps the raw case association request data
 * @constructor
 */
function CaseAssociationRequestFactory(rawProps) {
  let entityConstructor = function (rawPropsParam) {
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.documentTitle = rawPropsParam.documentTitle;
    this.documentTitleTemplate = rawPropsParam.documentTitleTemplate;
    this.documentType = rawPropsParam.documentType;
    this.eventCode = rawPropsParam.eventCode;
    this.exhibits = rawPropsParam.exhibits;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.objections = rawPropsParam.objections;
    this.partyPrivatePractitioner = rawPropsParam.partyPrivatePractitioner;
    this.partyIrsPractitioner = rawPropsParam.partyIrsPractitioner;
    this.primaryDocumentFile = rawPropsParam.primaryDocumentFile;
    this.representingPrimary = rawPropsParam.representingPrimary;
    this.representingSecondary = rawPropsParam.representingSecondary;
    this.scenario = rawPropsParam.scenario;
    this.supportingDocuments = rawPropsParam.supportingDocuments;

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return SupportingDocumentInformationFactory.get(
          item,
          CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
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

  entityConstructor.prototype.getDocumentTitle = function (
    contactPrimaryName,
    contactSecondaryName,
  ) {
    let petitionerNames;
    if (rawProps.partyIrsPractitioner) {
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
    documentTitle: joi.string().max(500).optional(),
    documentTitleTemplate: joi.string().max(500).required(),
    documentType: joi
      .string()
      .valid(...ALL_DOCUMENT_TYPES)
      .required(),
    eventCode: joi
      .string()
      .valid(...ALL_EVENT_CODES)
      .required(),
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrivatePractitioner: joi.boolean().optional(),
    primaryDocumentFile: joi.object().required(), // object of type File
    scenario: joi
      .string()
      .valid(...SCENARIOS)
      .required(),
  };

  let schemaOptionalItems = {
    attachments: joi.boolean().required(),
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
      'now',
    ).required(),
    exhibits: joi.boolean().required(),
    hasSupportingDocuments: joi.boolean().required(),
    objections: joi
      .string()
      .valid(...OBJECTIONS_OPTIONS)
      .required(),
    representingPrimary: joi.boolean().invalid(false).required(),
    representingSecondary: joi.boolean().invalid(false).required(),
    supportingDocuments: joi.array().optional(), // validated with SupportingDocumentInformationFactory
  };

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
  }

  if (
    rawProps.representingPrimary !== true &&
    rawProps.representingSecondary !== true &&
    rawProps.partyIrsPractitioner !== true
  ) {
    makeRequired('representingPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(rawProps);
}

module.exports = { CaseAssociationRequestFactory };
