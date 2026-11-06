/**
 * Holds every GET request that matches the url until release is called, so a
 * test can check a loading state without a timed delay. After release, the held
 * requests continue to the server.
 */
export const holdRequests = (url: string): { release: () => void } => {
  let release: () => void = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });

  cy.intercept('GET', url, () => held);

  return { release: () => release() };
};
