import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export type AuthUser = {
  role: Role;
  userId: string;
  email: string;
  name: string;
};

export type UnknownAuthUser = AuthUser | undefined;

export function isAuthUser(user): user is AuthUser {
  const authUserSchema = joi.object().keys({
    email: joi.string().min(1).max(100).email({ tlds: false }).required(),
    name: joi.string().min(1).required(),
    role: joi
      .string()
      .min(1)
      .valid(...Object.values(ROLES))
      .required(),
    userId: joi.string().min(1).uuid().required(),
  });

  const { error } = authUserSchema.validate(user);
  if (error) {
    return false;
  }

  return true;
}
