function Petition({
  petitionFile = '',
  requestForPlaceOfTrial = '',
  statementOfTaxpayerIdentificationNumber = '',
} = {}) {
  this.petitionFile = petitionFile;
  this.requestForPlaceOfTrial = requestForPlaceOfTrial;
  this.statementOfTaxpayerIdentificationNumber = statementOfTaxpayerIdentificationNumber;
}

Petition.prototype.isValid = function isValid() {
  return (
    !!this.petitionFile &&
    !!this.requestForPlaceOfTrial &&
    !!this.statementOfTaxpayerIdentificationNumber
  );
};

Petition.prototype.exportPlainObject = function exportPlainObject() {
  return {
    petitionFile: this.petitionFile,
    requestForPlaceOfTrial: this.requestForPlaceOfTrial,
    statementOfTaxpayerIdentificationNumber: this
      .statementOfTaxpayerIdentificationNumber,
    isValid: this.isValid(),
  };
};

export default Petition;
