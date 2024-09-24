import { state } from '@web-client/presenter/app.cerebral';

export const getCreatePetitionStep5DataAction = ({ get }: ActionProps) => {
  const { stinFile, stinFileSize } = get(state.form);

  const createPetitionStep5Data = {
    stinFile,
    stinFileSize,
  };

  return {
    createPetitionStep5Data,
  };
};
