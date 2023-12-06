import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the state.form.caseCaption to the props.caseCaption passed in.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for passing in props.caseCaption
 * @param {Function} providers.store the cerebral store used for setting the state.form.caseCaption
 */
export const setCaseCaptionForCaseInfoTabAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.form.caseCaption, props.caseCaption);
};
