export type JoiErrorDetail = {
  message: string;
  type: string;
  context: { key: string | number; label: string };
};

export type TValidationError = {
  [key: string]: string | TValidationError | TValidationError[];
};

export function appendNestedEntitiesErrors(
  entity: any,
  errors: { [key: string]: string } | null,
): TValidationError | null {
  const entityProperties = Object.keys(entity);
  const errorsWithNestedErrorsAppended: TValidationError | null = { ...errors };

  for (let entityProperty of entityProperties) {
    const entityPropertyValue = entity[entityProperty];

    if (errors && errors[entityProperty]) {
      errorsWithNestedErrorsAppended[entityProperty] = errors[entityProperty];
      continue;
    } else if (Array.isArray(entityPropertyValue)) {
      const errorsForNestedEntitiesInArray = entityPropertyValue
        .map((item, index) => {
          if (item.getValidationErrors) {
            const itemErrors = item.getValidationErrors();
            return itemErrors ? { ...itemErrors, index } : null;
          }
        })
        .filter(itemErrors => !!itemErrors) as (TValidationError & {
        index: number;
      })[];

      if (errorsForNestedEntitiesInArray.length)
        errorsWithNestedErrorsAppended[entityProperty] =
          errorsForNestedEntitiesInArray;
      continue;
    } else if (
      typeof entityPropertyValue === 'object' &&
      entityPropertyValue &&
      entityPropertyValue.getValidationErrors
    ) {
      const objectErrors = entityPropertyValue.getValidationErrors();
      if (objectErrors)
        errorsWithNestedErrorsAppended[entityProperty] = objectErrors;
    }
  }

  return Object.keys(errorsWithNestedErrorsAppended).length
    ? errorsWithNestedErrorsAppended
    : null;
}

export function removeUnhelpfulErrorMessagesFromContactValidations(
  errors: { [key: string]: string } | null,
): { [key: string]: string } | null {
  if (!errors) return null;
  const updatedErrors = { ...errors };
  Object.entries(errors).forEach((entry: [string, string]) => {
    if (deleteUnhelpfulMessages(entry)) {
      delete updatedErrors[entry[0]];
    }
  });

  return Object.keys(updatedErrors).length ? updatedErrors : null;
}

function deleteUnhelpfulMessages(entry: [string, string]) {
  const message = entry[1];
  if (typeof message !== 'string') return false;
  if (message.endsWith('does not match any of the allowed types')) return true;
  return false;
}
