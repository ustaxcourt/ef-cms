module.exports = [
  'http://localhost:1234/mock-login?token=practitioner&path=/',
  'http://localhost:1234/mock-login?token=practitioner&path=/user/contact/edit',
  'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/105-19',
  'http://localhost:1234/mock-login?token=practitioner&path=/file-a-petition/step-1',
  'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/102-19/request-access',
  {
    actions: [
      'wait for element #react-select-2-input to be visible',
      'click #react-select-2-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-2-option-5', //Substitution of Counsel
      'check field #primaryDocument-certificateOfService',
      'wait for element #objections-Unknown to be visible',
      'set field #objections-Unknown to Unknown',
      'check field #objections-Unknown',
      'check field #party-primary',
    ],
    notes: 'fill out request-access form and review inputs',
    url:
      'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/102-19/request-access&filled-form=true',
  },
  'http://localhost:1234/mock-login?token=practitioner&path=/search/no-matches',
];
