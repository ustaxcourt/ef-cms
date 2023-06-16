import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates the orderDesignatingPlaceOfTrial based on the preferredTrialCity
 * and requestForPlaceOfTrialFile on the form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateOrderForDesignatingPlaceOfTrialAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  if (
    ['preferredTrialCity', 'requestForPlaceOfTrialFile'].includes(props.key)
  ) {
    const { preferredTrialCity, requestForPlaceOfTrialFile } = get(state.form);

    if (!preferredTrialCity && !requestForPlaceOfTrialFile) {
      store.set(state.form.orderDesignatingPlaceOfTrial, true);
    } else {
      store.set(state.form.orderDesignatingPlaceOfTrial, false);
    }
  }
};
