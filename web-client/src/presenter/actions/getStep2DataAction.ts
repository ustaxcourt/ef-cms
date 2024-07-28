import { state } from '@web-client/presenter/app.cerebral';

export const getStep2DataAction = ({ get }: ActionProps) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  } = get(state.form);

  const step2Data = {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionRedactionAcknowledgement,
    petitionType,
  };

  return {
    step2Data,
  };
};
