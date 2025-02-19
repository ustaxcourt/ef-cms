import { state } from '@web-client/presenter/app.cerebral';

export const checkIfTermInfoIsInStateAction = ({ get, path }: ActionProps) => {
  const termGeneratorInformation = get(state.termGeneratorInformation);
  if (!termGeneratorInformation) return path.doesNotExist();
  return path.exist();
};
