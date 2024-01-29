export const handler = async event => {
  // NOOP - not deleting this until after 10007 has been deployed so that the active color during a deployment does not lose cognito trigger capabilities.
  console.log('Cognito trigger running: ');
  return event;
};

export const updatePetitionerCasesLambda = async event => {
  // NOOP - not deleting this until after 10007 has been deployed so that the active color during a deployment does not lose cognito trigger capabilities.
  return event;
};
