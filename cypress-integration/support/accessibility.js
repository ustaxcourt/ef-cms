export const DAWSON_GLOBAL_DISABLED_AXE_ERRORS = {
  region: { enabled: false },
};

exports.checkA11y = ({ ignoredErrors, terminalLog }) => {
  cy.waitUntilSettled(50);

  cy.injectAxe();
  cy.checkA11y(
    'html',
    {
      rules: {
        ...ignoredErrors,
      },
    },
    terminalLog,
  );
};
