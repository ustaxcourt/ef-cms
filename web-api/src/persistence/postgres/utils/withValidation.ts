import { EntityNotValidatedError } from '@web-api/errors/errors';

function validateArgs(arg) {
  if (typeof arg === 'object' && arg.entityName) {
    console.trace();
    if (!arg.isValidated) {
      throw new EntityNotValidatedError(
        `a entity of type ${arg.entityName} was not validated before passed to a persistence method`,
      );
    }
  } else if (typeof arg === 'object') {
    for (const key in arg) {
      validateArgs(arg[key]);
    }
  }
}

export function withValidation<Parameters extends any[], ReturnType>(
  persistenceMethod: (...args: Parameters) => ReturnType,
): (...args: Parameters) => ReturnType {
  return (...args: Parameters): ReturnType => {
    validateArgs(args);
    return persistenceMethod(...args);
  };
}
