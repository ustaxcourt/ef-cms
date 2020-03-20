module.exports = {
  associateIrsPractitionerWithCaseLambda: require('./manualAssociation/associateIrsPractitionerWithCaseLambda')
    .associateIrsPractitionerWithCaseLambda,
  associatePrivatePractitionerWithCaseLambda: require('./manualAssociation/associatePrivatePractitionerWithCaseLambda')
    .associatePrivatePractitionerWithCaseLambda,
  deleteCounselFromCaseLambda: require('./cases/deleteCounselFromCaseLambda')
    .deleteCounselFromCaseLambda,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .updateCounselOnCaseLambda,
  updatePetitionDetailsLambda: require('./cases/updatePetitionDetailsLambda')
    .updatePetitionDetailsLambda,
  updatePetitionerInformationLambda: require('./cases/updatePetitionerInformationLambda')
    .updatePetitionerInformationLambda,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .updatePrimaryContactLambda,
  updateSecondaryContactLambda: require('./cases/updateSecondaryContactLambda')
    .updateSecondaryContactLambda,
};
