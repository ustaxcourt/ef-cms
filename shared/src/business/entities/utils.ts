import { v4 as uuidv4 } from 'uuid';

export const getUniqueId = (): string => {
  return uuidv4();
};
