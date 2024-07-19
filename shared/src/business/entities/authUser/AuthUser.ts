import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export type AuthUser = {
  role: Role;
  userId: string;
  email: string;
  name: string;
};

export class UserUndefinedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserUndefinedError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserUndefinedError);
    }
  }
}

export type UnknownAuthUser = AuthUser | undefined;

export function isAuthUser(user): user is AuthUser {
  const authUserSchema = joi
    .object()
    .required()
    .keys({
      email: joi.string().min(1).max(100).email({ tlds: false }).required(),
      name: joi.string().min(1).required(),
      role: joi
        .string()
        .min(1)
        .valid(...Object.values(ROLES))
        .required(),
      userId: joi.string().min(1).uuid().required(),
    });
  const { error } = authUserSchema.validate(user, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return false;
  }

  return true;
}
