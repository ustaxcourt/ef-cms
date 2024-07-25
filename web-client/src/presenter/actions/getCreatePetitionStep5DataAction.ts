import { state } from '@web-client/presenter/app.cerebral';

export const getCreatePetitionStep5DataAction = ({
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const { stinFile, stinFileSize } = get(state.form);

  const step5Data = {
    stinFile,
    stinFileSize,
  };

  return {
    step5Data,
  };
};
