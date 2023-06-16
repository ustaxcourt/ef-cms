import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.form.procedureType to a default if it is not already set on the form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultStartCaseInternalFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const {
    hasVerifiedIrsNotice,
    orderDesignatingPlaceOfTrial,
    preferredTrialCity,
    procedureType,
    requestForPlaceOfTrialFile,
    statistics,
  } = get(state.form);
  const { DEFAULT_PROCEDURE_TYPE } = applicationContext.getConstants();

  if (!procedureType) {
    store.set(state.form.procedureType, DEFAULT_PROCEDURE_TYPE);
  }

  if (hasVerifiedIrsNotice === undefined) {
    store.set(state.form.hasVerifiedIrsNotice, false);
  }

  if (
    orderDesignatingPlaceOfTrial === undefined &&
    !preferredTrialCity &&
    !requestForPlaceOfTrialFile
  ) {
    store.set(state.form.orderDesignatingPlaceOfTrial, true);
  }

  if (!statistics) {
    store.set(state.form.statistics, []);
  }

  store.set(state.form.isPaper, true);
};
