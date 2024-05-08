import { state } from '@web-client/presenter/app.cerebral';

export const getStep1DataAction = ({ get }: ActionProps) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionType,
    redactionAcknowledgement,
  } = get(state.form);

  const step1Data = {
    acknowledgeChecked: redactionAcknowledgement,
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionType,
  };

  return {
    step1Data,
  };
};
