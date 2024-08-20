import { state } from '@web-client/presenter/app.cerebral';

export const getCreatePetitionStep2DataAction = ({ get }: ActionProps) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  } = get(state.form);

  const createPetitionStep2Data = {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  };

  return {
    createPetitionStep2Data,
  };
};
