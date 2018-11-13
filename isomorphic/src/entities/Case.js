function Case(petition) {
  this.petitionFile = petition.petitionFile;
  this.requestForPlaceOfTrial = petition.requestForPlaceOfTrial;
  this.statementOfTaxpayerIdentificationNumber =
    petition.statementOfTaxpayerIdentificationNumber;
}

Case.prototype.isValid = function isValid() {
  return (
    !!this.petitionFile &&
    !!this.requestForPlaceOfTrial &&
    !!this.statementOfTaxpayerIdentificationNumber
  );
};

module.exports = Case;
