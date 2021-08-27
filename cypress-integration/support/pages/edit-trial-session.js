exports.navigateTo = (username, trialSessionId) => {
  cy.login(username, `/edit-trial-session/${trialSessionId}`);
};

exports.getCancelButton = () => {
  return cy.contains('Cancel');
};
