import { state } from 'cerebral';

export const todaysOpinionsHelper = get => {
  const todaysOpinions = get(state.todaysOpinions);

  // const formattedTodaysOpinions = todaysOpinions.map(opinion => opinion);

  return { todaysOpinions };
};
