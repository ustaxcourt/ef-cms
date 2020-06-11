import { state } from 'cerebral';
/**
 * sets the state.today'sOpinions based on props.today'sOpinions
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const setTodaysOpinionsAction = async ({ props, store }) => {
  store.set(state.todaysOpinions, props.todaysOpinions);
};
