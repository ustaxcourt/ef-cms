const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

CaseSearch.CASE_SEARCH_PAGE_COUNT = 5;

CaseSearch.validationName = 'CaseSearch';

/**
 * Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function CaseSearch(rawProps) {
  this.petitionerName = rawProps.petitionerName;
  this.yearFiledMin = rawProps.yearFiledMin || 1900;
  this.yearFiledMax = rawProps.yearFiledMax || undefined;
  this.petitionerState = rawProps.petitionerState || undefined;
  this.countryType = rawProps.countryType || undefined;
}

CaseSearch.errorToMessageMap = {
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
  countryType: joi.string().optional(),
  petitionerName: joi.string().required(),
  petitionerState: joi.string().optional(),
  yearFiledMax: joi.when('yearFiledMin', {
    is: joi.number(),
    otherwise: joi
      .number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear()),
    then: joi
      .number()
      .integer()
      .min(joi.ref('yearFiledMin'))
      .max(new Date().getFullYear()),
  }),
  yearFiledMin: joi
    .number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear()),
});

joiValidationDecorator(
  CaseSearch,
  CaseSearch.schema,
  undefined,
  CaseSearch.errorToMessageMap,
);

module.exports = { CaseSearch };
