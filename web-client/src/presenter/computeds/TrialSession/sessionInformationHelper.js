import { state } from 'cerebral';

export const sessionInformationHelper = get => {
  const isStandaloneSession =
    // get(state.form.sessionScope) === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;
    //do things
  const sessionTypesStandalone = ['Regular', 'Small', 'Hybrid'];
  const sessionTypesLocationBased = [
    'Regular',
    'Small',
    'Hybrid',
    'Special',
    'Motion/Hearing',
  ];

  const sessionTypes = isStandaloneSession
    ? sessionTypesStandalone
    : sessionTypesLocationBased;

  return {
    isStandaloneSession,
    sessionTypes,
  };
};
