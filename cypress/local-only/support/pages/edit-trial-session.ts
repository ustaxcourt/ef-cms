export const navigateTo = (username, trialSessionId) => {
  cy.login(username, `/edit-trial-session/${trialSessionId}`);
};

export const getCancelButton = () => {
  return cy.contains('Cancel');
};
