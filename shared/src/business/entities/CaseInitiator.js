/**
 * constructor
 * @param rawCaseInitiator
 * @constructor
 */
function CaseInitiator(rawCaseInitiator) {
  this.petitionFile = rawCaseInitiator.petitionFile;
  this.requestForPlaceOfTrial = rawCaseInitiator.requestForPlaceOfTrial;
  this.statementOfTaxpayerIdentificationNumber =
    rawCaseInitiator.statementOfTaxpayerIdentificationNumber;
}

/**
 * isValid
 * @returns {boolean}
 */
CaseInitiator.prototype.isValid = function isValid() {
  return (
    !!this.petitionFile &&
    !!this.requestForPlaceOfTrial &&
    !!this.statementOfTaxpayerIdentificationNumber
  );
};

CaseInitiator.prototype.exportObject = function exportObject() {
  return Object.assign({}, this);
};

CaseInitiator.prototype.validate = function validate() {
  if (!this.isValid()) {
    throw new Error('The case initiator was invalid');
  }
};

module.exports = CaseInitiator;
