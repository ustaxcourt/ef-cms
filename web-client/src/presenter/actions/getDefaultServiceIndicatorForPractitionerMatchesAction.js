import { state } from 'cerebral';

/**
 * gets the default serviceIndicator for the selected practitioner
 *
 * @param {string} matchesKey the key on state.modal from where to fetch practitioners
 * @returns {Function} the cerebral action
 */
export const getDefaultServiceIndicatorForPractitionerMatchesAction =
  matchesKey => {
    /**
     * @param {object} providers the providers object
     * @param {object} providers.applicationContext the application context
     * @param {object} providers.get the cerebral get method
     * @returns {object} props object containing defaultServiceIndicator
     */
    return ({ applicationContext, get }) => {
      const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
      const matches = get(state.modal[matchesKey]);
      const selectedPractitionerId = get(state.modal.user.userId);

      let defaultStateForSelected = null;

      if (matches && selectedPractitionerId) {
        const selectedPractitioner = matches.find(
          respondent => respondent.userId === selectedPractitionerId,
        );

        defaultStateForSelected = selectedPractitioner.email
          ? SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
          : SERVICE_INDICATOR_TYPES.SI_PAPER;
      }

      return {
        defaultServiceIndicator: defaultStateForSelected,
      };
    };
  };
