const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
} = require('../../../persistence/s3/getUploadPolicy');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { getTimestampSchema } = require('../../../utilities/dateSchema');
const { Statistic } = require('../Statistic');

const joiStrictTimestamp = getTimestampSchema();
CaseInternal.DEFAULT_PROCEDURE_TYPE = Case.PROCEDURE_TYPES[0];

/**
 * CaseInternal Entity
 * Represents a Case with required documents that a Petitions Clerk is attempting to add to the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseInternal(rawCase) {
  this.applicationForWaiverOfFilingFeeFile =
    rawCase.applicationForWaiverOfFilingFeeFile;
  this.applicationForWaiverOfFilingFeeFileSize =
    rawCase.applicationForWaiverOfFilingFeeFileSize;
  this.caseCaption = rawCase.caseCaption;
  this.caseType = rawCase.caseType;
  this.filingType = rawCase.filingType;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice || false;
  this.mailingDate = rawCase.mailingDate;
  this.noticeOfAttachments = rawCase.noticeOfAttachments;
  this.orderDesignatingPlaceOfTrial = rawCase.orderDesignatingPlaceOfTrial;
  // this is so the validation that is checking for existence of 3 different fields
  // will work correctly
  if (this.orderDesignatingPlaceOfTrial === false) {
    this.orderDesignatingPlaceOfTrial = undefined;
  }
  this.orderForOds = rawCase.orderForOds;
  this.orderForAmendedPetition = rawCase.orderForAmendedPetition;
  this.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee;
  this.orderForFilingFee = rawCase.orderForFilingFee;
  this.orderForRatification = rawCase.orderForRatification;
  this.orderToShowCause = rawCase.orderToShowCause;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.petitionPaymentDate = rawCase.petitionPaymentDate;
  this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  this.petitionPaymentStatus = rawCase.petitionPaymentStatus;
  this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt;
  this.requestForPlaceOfTrialFile = rawCase.requestForPlaceOfTrialFile;
  this.requestForPlaceOfTrialFileSize = rawCase.requestForPlaceOfTrialFileSize;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;
  this.useSameAsPrimary = rawCase.useSameAsPrimary;

  this.statistics = Array.isArray(rawCase.statistics)
    ? rawCase.statistics.map(statistic => new Statistic(statistic))
    : [];

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    isPaper: true,
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

CaseInternal.VALIDATION_ERROR_MESSAGES = {
  ...Case.VALIDATION_ERROR_MESSAGES,
  applicationForWaiverOfFilingFeeFile:
    'Upload or scan an Application for Waiver of Filing Fee (APW)',
  chooseAtLeastOneValue:
    'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
  ownershipDisclosureFile: 'Upload or scan Ownership Disclosure Statement(ODS)',
  petitionFile: 'Upload or scan a Petition',
  petitionPaymentDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Payment date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid payment date',
  ],
  petitionPaymentStatus: 'Select a filing fee option',
  preferredTrialCity: 'Select a preferred trial location',
  requestForPlaceOfTrialFile:
    'Upload or scan a Request for Place of Trial (RQT)',
};

const paperRequirements = joi
  .object()
  .keys({
    applicationForWaiverOfFilingFeeFile: joi.when('petitionPaymentStatus', {
      is: Case.PAYMENT_STATUS.WAIVED,
      otherwise: joi.optional().allow(null),
      then: joi.object().required(),
    }),
    applicationForWaiverOfFilingFeeFileSize: joi.when(
      'applicationForWaiverOfFilingFeeFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.number().required().min(1).max(MAX_FILE_SIZE_BYTES).integer(),
      },
    ),
    caseCaption: joi.string().required(),
    caseType: joi.string().required(),
    hasVerifiedIrsNotice: joi.boolean().required(),
    irsNoticeDate: Case.validationRules.irsNoticeDate,
    mailingDate: joi.string().max(25).required(),
    noticeOfAttachments: Case.validationRules.noticeOfAttachments,
    orderDesignatingPlaceOfTrial:
      Case.validationRules.orderDesignatingPlaceOfTrial,
    orderForAmendedPetition: Case.validationRules.orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee:
      Case.validationRules.orderForAmendedPetitionAndFilingFee,
    orderForFilingFee: Case.validationRules.orderForFilingFee,
    orderForOds: Case.validationRules.orderForOds,
    orderForRatification: Case.validationRules.orderForRatification,
    orderToShowCause: Case.validationRules.orderToShowCause,
    ownershipDisclosureFile: joi.when('partyType', {
      is: joi
        .exist()
        .valid(
          ContactFactory.PARTY_TYPES.corporation,
          ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner,
          ContactFactory.PARTY_TYPES.partnershipBBA,
          ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters,
        ),
      otherwise: joi.optional().allow(null),
      then: joi.when('orderForOds', {
        is: joi.not(true),
        otherwise: joi.optional().allow(null),
        then: joi.object().required(),
      }),
    }),
    ownershipDisclosureFileSize: joi.when('ownershipDisclosureFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.number().required().min(1).max(MAX_FILE_SIZE_BYTES).integer(),
    }),
    partyType: joi.string().required(),
    petitionFile: joi.object().required(),
    petitionFileSize: joi.when('petitionFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.number().required().min(1).max(MAX_FILE_SIZE_BYTES).integer(),
    }),
    petitionPaymentDate: joi.when('petitionPaymentStatus', {
      is: Case.PAYMENT_STATUS.PAID,
      otherwise: joiStrictTimestamp.optional().allow(null),
      then: joiStrictTimestamp.max('now').required(),
    }),
    petitionPaymentMethod: Case.validationRules.petitionPaymentMethod,
    petitionPaymentStatus: Case.validationRules.petitionPaymentStatus,
    petitionPaymentWaivedDate: Case.validationRules.petitionPaymentWaivedDate,
    preferredTrialCity: joi
      .alternatives()
      .conditional('requestForPlaceOfTrialFile', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.string().required(),
      }),
    procedureType: joi.string().required(),
    receivedAt: joiStrictTimestamp.max('now').required(),
    requestForPlaceOfTrialFile: joi
      .alternatives()
      .conditional('preferredTrialCity', {
        is: joi.exist().not(null),
        otherwise: joi.object().optional(),
        then: joi.object().required(),
      }),
    requestForPlaceOfTrialFileSize: joi.when('requestForPlaceOfTrialFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.number().required().min(1).max(MAX_FILE_SIZE_BYTES).integer(),
    }),
    statistics: Case.validationRules.statistics,
    stinFile: joi.object().optional(),
    stinFileSize: joi.when('stinFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.number().required().min(1).max(MAX_FILE_SIZE_BYTES).integer(),
    }),
    useSameAsPrimary: Case.validationRules.useSameAsPrimary,
  })
  .or(
    'preferredTrialCity',
    'requestForPlaceOfTrialFile',
    'orderDesignatingPlaceOfTrial',
  );

joiValidationDecorator(
  CaseInternal,
  paperRequirements,
  CaseInternal.VALIDATION_ERROR_MESSAGES,
);

const originalGetValidationErrors = CaseInternal.prototype.getValidationErrors;

CaseInternal.prototype.getValidationErrors = function () {
  const validationErrors = originalGetValidationErrors.call(this);

  if (validationErrors && validationErrors['object.missing']) {
    validationErrors['chooseAtLeastOneValue'] =
      validationErrors['object.missing'];
    delete validationErrors['object.missing'];
  }

  return validationErrors;
};

module.exports = { CaseInternal };
