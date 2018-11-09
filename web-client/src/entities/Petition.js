function Petition(petition) {
  this.petitionFile = petition.petitionFile;
  this.requestForPlaceOfTrial = petition.requestForPlaceOfTrial;
  this.statementOfTaxpayerIdentificationNumber =
    petition.statementOfTaxpayerIdentificationNumber;
}

Petition.prototype.isValid = function isValid() {
  return (
    !!this.petitionFile &&
    !!this.requestForPlaceOfTrial &&
    !!this.statementOfTaxpayerIdentificationNumber
  );
};

export default Petition;
