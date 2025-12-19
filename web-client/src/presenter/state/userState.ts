import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import {
  ACCOUNT_STATUS,
  Role,
} from '@shared/business/entities/EntityConstants';

export const emptyUserState: GetUserResponse & {
  email: string;
  barNumber?: string;
} = {
  email: '',
  entityName: '',
  name: '',
  role: '' as Role,
  section: '',
  userId: '',
  accountStatus: ACCOUNT_STATUS.active,
}; // We know that the logged in user has an email otherwise they could not login.
