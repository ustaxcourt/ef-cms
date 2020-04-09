module.exports = {
  createPractitionerUserLambda: require('./practitioners/createPractitionerUserLambda')
    .createPractitionerUserLambda,
  getPractitionerByBarNumberLambda: require('./practitioners/getPractitionerByBarNumberLambda')
    .getPractitionerByBarNumberLambda,
  getPractitionersByNameLambda: require('./practitioners/getPractitionersByNameLambda')
    .getPractitionersByNameLambda,
  updatePractitionerUserLambda: require('./practitioners/updatePractitionerUserLambda')
    .updatePractitionerUserLambda,
};
