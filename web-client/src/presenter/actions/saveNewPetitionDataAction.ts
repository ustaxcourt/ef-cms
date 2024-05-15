import { state } from '@web-client/presenter/app.cerebral';

export const saveNewPetitionDataAction = ({ props, store }: ActionProps) => {
  const petitionData = {
    ...props.step1Data,
    ...props.step2Data,
    ...props.step3Data,
    ...props.step4Data,
    ...props.step5Data,
  };

  store.set(state.newPetitionData, petitionData);
};
