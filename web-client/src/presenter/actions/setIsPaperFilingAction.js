import { state } from 'cerebral';

/**
 * sets state.isPaperFiling based on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * * @param {object} providers.store the cerebral store object
 */
export const setIsPaperFilingAction = ({ props, store }) => {
  const { isPaperFiling } = props;
  store.set(state.isPaperFiling, !!isPaperFiling);
};
