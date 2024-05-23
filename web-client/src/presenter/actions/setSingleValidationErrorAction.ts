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

type Key = string | { property: string; value: any };

function getNestedErrorMessage(
  errors: ValidationErrors,
  keys: Key[],
): string | undefined {
  return keys.reduce<ValidationErrors | string | undefined>(
    (acc, key, index) => {
      if (index === 0) acc = errors;

      if (
        typeof key === 'object' &&
        key !== null &&
        'property' in key &&
        'value' in key
      ) {
        if (Array.isArray(acc)) {
          acc = acc.find(item => item[key.property] === key.value) || undefined;
        } else {
          return undefined;
        }
      } else if (acc && typeof key === 'string') {
        acc = acc[key];
      } else {
        return undefined;
      }
      return acc;
    },
    undefined,
  ) as string | undefined;
}

function setNestedErrorMessage(validationErrors, validationKeys, errorMessage) {
  let current = validationErrors;
  validationKeys.forEach((key, index) => {
    if (index === validationKeys.length - 1) {
      current[key] = errorMessage;
      return;
    }

    const nextKey = validationKeys[index + 1];
    const shouldCreateArray = typeof nextKey === 'object' && nextKey !== null;

    if (
      Array.isArray(current) &&
      typeof key === 'object' &&
      key !== null &&
      'property' in key &&
      'value' in key
    ) {
      let found = current.find(item => item[key.property] === key.value);
      if (!found) {
        found = { [key.property]: key.value };
        current.push(found);
      }
      current = found;
    } else {
      if (shouldCreateArray) {
        current[key] = Array.isArray(current[key]) ? current[key] : [];
      } else {
        current[key] =
          typeof current[key] === 'object' && current[key] !== null
            ? current[key]
            : {};
      }
      current = current[key];
    }
  });
}
