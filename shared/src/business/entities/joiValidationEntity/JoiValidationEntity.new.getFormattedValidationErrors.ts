import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export type JoiErrorDetail = {
  message: string;
  type: string;
  context: { key: string | number; label: string };
};

function getFormattedValidationErrorsHelper_NEW(entity: JoiValidationEntity): {
  [key: string]: string;
} | null {
  const errors = entity.getValidationErrors_NEW();
  if (!errors) return null;

  const { details }: { details: JoiErrorDetail[] } = errors;
  const finalErrorMessages = {};
  details.forEach(d => {
    if (!Number.isInteger(d.context.key)) {
      finalErrorMessages[d.context.key || d.type] = d.message;
    } else {
      finalErrorMessages[d.context.label] = d.message;
    }
  });
  return finalErrorMessages;
}

function isJoiValidationEntity(entity): boolean {
  return !!entity.getFormattedValidationErrors;
}

export function getFormattedValidationErrors_NEW(entity): TempTyping | null {
  let errors: {} | null = null;

  if (isJoiValidationEntity(entity)) {
    errors = getFormattedValidationErrorsHelper_NEW(entity);
  }

  const updatedErrors =
    removeUnhelpfulErrorMessagesFromContactValidations(errors);

  const nestedErrors = appendNestedEntitiesErrors(entity, updatedErrors);

  return nestedErrors;
}

export type TempTyping = {
  [key: string]: string | TempTyping | TempTyping[];
};

function appendNestedEntitiesErrors(
  entity: any,
  errors: { [key: string]: string } | null,
): TempTyping | null {
  const entityProperties = Object.keys(entity);
  const errorsWithNestedErrorsAppended: TempTyping | null = { ...errors };

  for (let entityProperty of entityProperties) {
    const entityPropertyValue = entity[entityProperty];

    if (errors && errors[entityProperty]) {
      errorsWithNestedErrorsAppended[entityProperty] = errors[entityProperty];
      continue;
    } else if (Array.isArray(entityPropertyValue)) {
      const errorsForNestedEntitiesInArray = entityPropertyValue
        .map((item, index) => {
          const itemErrors = getFormattedValidationErrors_NEW(item);
          return itemErrors ? { ...itemErrors, index } : null;
        })
        .filter(itemErrors => !!itemErrors) as (TempTyping & {
        index: number;
      })[];

      if (errorsForNestedEntitiesInArray.length)
        errorsWithNestedErrorsAppended[entityProperty] =
          errorsForNestedEntitiesInArray;
      continue;
    } else if (
      typeof entityPropertyValue === 'object' &&
      entityPropertyValue &&
      entityPropertyValue.getFormattedValidationErrors
    ) {
      const objectErrors =
        getFormattedValidationErrors_NEW(entityPropertyValue);
      if (objectErrors)
        errorsWithNestedErrorsAppended[entityProperty] = objectErrors;
    }
  }

  return Object.keys(errorsWithNestedErrorsAppended).length
    ? errorsWithNestedErrorsAppended
    : null;
}

function removeUnhelpfulErrorMessagesFromContactValidations(
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
