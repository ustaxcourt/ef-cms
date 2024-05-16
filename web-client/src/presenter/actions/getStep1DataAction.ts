import { state } from '@web-client/presenter/app.cerebral';

export const getStep1DataAction = ({ get }: ActionProps) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  } = get(state.form);

  const step1Data = {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  };

  return {
    step1Data,
  };
};
