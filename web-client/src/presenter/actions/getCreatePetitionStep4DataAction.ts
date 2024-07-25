import { state } from '@web-client/presenter/app.cerebral';

export const getCreatePetitionStep4DataAction = ({
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const { preferredTrialCity, procedureType } = get(state.form);

  const step4Data = {
    preferredTrialCity,
    procedureType,
  };

  return {
    step4Data,
  };
};
