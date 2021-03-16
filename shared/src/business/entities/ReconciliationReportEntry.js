const {
  DOCKET_ENTRY_VALIDATION_RULES,
} = require('./EntityValidationConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { pick } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawDocketEntry the raw docket entry data
 * @constructor
 */
function ReconciliationReportEntry() {
  Object.defineProperty(this, 'entityName', {
    enumerable: false,
    value: 'ReconciliationReportEntry',
  });
}

const REPORT_PROPERTIES = [
  'docketNumber',
  'documentTitle',
  'docketEntryId',
  'eventCode',
  'filedBy',
  'filingDate',
  'caseCaption',
  'servedAt',
  'servedPartiesCode',
];

ReconciliationReportEntry.prototype.init = function init(rawDocketEntry) {
  REPORT_PROPERTIES.forEach(key => (this[key] = rawDocketEntry[key]));
};

joiValidationDecorator(ReconciliationReportEntry, {
  ...pick(DOCKET_ENTRY_VALIDATION_RULES, REPORT_PROPERTIES),
  // caseCaption: JoiValidationConstants.CASE_CAPTION.required(), // TODO: persistence method does not return caseCaption currently unless we do a join with the parent
});

module.exports = {
  ReconciliationReportEntry: validEntityDecorator(ReconciliationReportEntry),
};
