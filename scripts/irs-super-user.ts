import { login, registerUser } from './irs-super-user.helpers';

registerUser().then(() => login());
