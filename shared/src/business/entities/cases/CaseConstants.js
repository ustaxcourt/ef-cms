const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

exports.SERVICE_INDICATOR_TYPES = SERVICE_INDICATOR_TYPES;

exports.DOCKET_NUMBER_MATCHER = /^(\d{3,5}-\d{2})$/;

exports.TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

exports.CHIEF_JUDGE = 'Chief Judge';
