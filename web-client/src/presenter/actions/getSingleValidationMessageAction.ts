import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setSingleValidationErrorAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { errors, validationKey } = props;
  const validationErrors = cloneDeep(get(state.validationErrors));

  if (!errors) return store.unset(state.validationErrors);

  const rootErrorMessage = getNestedErrorMessage(errors, validationKey);
  setNestedErrorMessage(validationErrors, validationKey, rootErrorMessage);
  store.set(state.validationErrors, validationErrors);
};

type ValidationErrors =
  | undefined
  | {
      [key: string]: undefined | string | ValidationErrors;
    };

function getNestedErrorMessage(
  errors: ValidationErrors,
  keys: string[],
): string | undefined {
  return keys.reduce(
    (acc, key, index) => {
      if (index === 0) acc = errors;
      return acc && acc[key] ? acc[key] : undefined;
    },
    undefined as ValidationErrors | string,
  ) as string | undefined;
}

function setNestedErrorMessage(validationErrors, validationKeys, errorMessage) {
  let current = validationErrors;

  validationKeys.forEach((key, index) => {
    if (index === validationKeys.length - 1) {
      current[key] = errorMessage;
    } else {
      if (typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
  });
}
