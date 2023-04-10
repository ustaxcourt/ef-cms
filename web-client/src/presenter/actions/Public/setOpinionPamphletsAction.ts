import { state } from 'cerebral';
/**
 * sets the state.opinionPamphlets based on props.opinionPamphlets
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const setOpinionPamphletsAction = ({ props, store }) => {
  store.set(state.opinionPamphlets, props.opinionPamphlets);
};
