import { state } from '@web-client/presenter/app.cerebral';

export const checkIfTermInfoIsInStateAction = ({ get, path }: ActionProps) => {
  console.log('aaaaaaaaaaaaa');
  const termGeneratorInformation = get(state.termGeneratorInformation);
  if (!termGeneratorInformation) return path.doesNotExist();
  console.log('bbbbbbbbbbbbbbbbbb');
  return path.exist();
};
