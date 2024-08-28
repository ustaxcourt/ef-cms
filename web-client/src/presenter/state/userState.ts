import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import { Role } from '@shared/business/entities/EntityConstants';

export const emptyUserState: GetUserResponse & {
  email: string;
} = {
  email: '',
  entityName: '',
  name: '',
  role: '' as Role,
  section: '',
  userId: '',
}; // We know that the logged in user has an email otherwise they could not login.
