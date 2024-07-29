import { state } from '@web-client/presenter/app.cerebral';

export const getStep5DataAction = ({
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
