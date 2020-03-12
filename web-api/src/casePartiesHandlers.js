module.exports = {
  associateIrsPractitionerWithCaseLambda: require('./manualAssociation/associateIrsPractitionerWithCaseLambda')
    .handler,
  associatePrivatePractitionerWithCaseLambda: require('./manualAssociation/associatePrivatePractitionerWithCaseLambda')
    .handler,
  deleteCounselFromCaseLambda: require('./cases/deleteCounselFromCaseLambda')
    .handler,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .handler,
  updatePetitionDetailsLambda: require('./cases/updatePetitionDetailsLambda')
    .handler,
  updatePetitionerInformationLambda: require('./cases/updatePetitionerInformationLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
  updateSecondaryContactLambda: require('./cases/updateSecondaryContactLambda')
    .handler,
};
