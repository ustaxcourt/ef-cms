import { state } from '@web-client/presenter/app.cerebral';

export const getFilePetitionPetitionInformationAction = ({
  get,
}: ActionProps) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  } = get(state.form);

  const petitionInformation = {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  };

  return {
    petitionInformation,
  };
};
