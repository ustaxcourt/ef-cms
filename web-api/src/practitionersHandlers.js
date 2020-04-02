module.exports = {
  getPractitionerByBarNumberLambda: require('./practitioners/getPractitionerByBarNumberLambda')
    .getPractitionersByNameLambda,
  getPractitionersByNameLambda: require('./practitioners/getPractitionersByNameLambda')
    .getPractitionerByBarNumberLambda,
};
