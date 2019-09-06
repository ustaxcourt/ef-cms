const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

CaseSearch.validationName = 'CaseSearch';

/**
 * Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function CaseSearch(rawProps) {
  this.practitionerName = rawProps.practitionerName;
  this.yearFiledMin = rawProps.yearFiledMin;
  this.yearFiledMax = rawProps.yearFiledMax;
  this.practitionerState = rawProps.practitionerState;
  this.countryType = rawProps.countryType;
}

CaseSearch.errorToMessageMap = {
  practitionerName: 'Enter a name',
  //TODO - year filed min/max valid values, year min should be less than year max
};

CaseSearch.schema = joi.object().keys({
  countryType: joi.string().optional(),
  practitionerName: joi.string().required(),
  practitionerState: joi.string().optional(),
  yearFiledMax: joi
    .number()
    .integer()
    .min(1986)
    .max(new Date().getFullYear),
  yearFiledMin: joi
    .number()
    .integer()
    .min(1986)
    .max(new Date().getFullYear),
});

joiValidationDecorator(
  CaseSearch,
  CaseSearch.schema,
  undefined,
  CaseSearch.errorToMessageMap,
);

module.exports = { CaseSearch };
