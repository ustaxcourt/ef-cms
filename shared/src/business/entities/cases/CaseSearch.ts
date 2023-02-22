const joi = require('joi');
const {
  CASE_SEARCH_MIN_YEAR,
  COUNTRY_TYPES,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * Case Search entity
 *
 * @param {object} rawProps the raw case search data
 * @constructor
 */
function CaseSearch() {
  this.entityName = 'CaseSearch';
}

CaseSearch.prototype.init = function init(rawProps) {
  this.petitionerName = rawProps.petitionerName;
  this.yearFiledMin = rawProps.yearFiledMin || CASE_SEARCH_MIN_YEAR;
  this.yearFiledMax = rawProps.yearFiledMax || undefined;
  this.petitionerState = rawProps.petitionerState || undefined;
  this.countryType = rawProps.countryType || undefined;
};

CaseSearch.VALIDATION_ERROR_MESSAGES = {
  petitionerName: 'Enter a name',
  yearFiledMax: [
    {
      contains: 'must be larger',
      message: 'Enter an ending year which occurs after start year',
    },
    'Enter a valid ending year',
  ],
  yearFiledMin: 'Enter a valid start year',
};

CaseSearch.schema = joi.object().keys({
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.DOMESTIC,
    COUNTRY_TYPES.INTERNATIONAL,
  ).optional(),
  petitionerName: JoiValidationConstants.STRING.max(500).required(),
  petitionerState: JoiValidationConstants.STRING.valid(
    ...Object.keys(US_STATES),
    ...Object.keys(US_STATES_OTHER),
  ).optional(),
  yearFiledMax: JoiValidationConstants.YEAR_MAX_CURRENT.min(
    joi.ref('yearFiledMin'),
  ).when('yearFiledMin', {
    is: joi.number(),
    otherwise: joi.number().min(1900),
    then: joi.number().min(joi.ref('yearFiledMin')),
  }),
  yearFiledMin: JoiValidationConstants.YEAR_MAX_CURRENT,
});

joiValidationDecorator(
  CaseSearch,
  CaseSearch.schema,
  CaseSearch.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseSearch: validEntityDecorator(CaseSearch) };
