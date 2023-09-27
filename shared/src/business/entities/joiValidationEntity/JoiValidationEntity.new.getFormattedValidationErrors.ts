import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export type JoiErrorDetail = {
  message: string;
  context: { key: string };
};

function getFormattedValidationErrorsHelper_NEW(entity: JoiValidationEntity): {
  [key: string]: string;
} | null {
  const errors = entity.getValidationErrors_NEW();
  if (!errors) return null;

  const { details }: { details: JoiErrorDetail[] } = errors;
  const finalErrorMessages = {};
  details.forEach(d => {
    finalErrorMessages[d.context.key] = d.message;
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

// TODO: RECURSIVE LOGIC
function appendNestedEntitiesErrors(
  entity: any,
  errors: { [key: string]: string } | null,
): TempTyping | null {
  const entityProperties = Object.keys(entity);
  const errorsWithNestedErrorsAppended: TempTyping | null = {};

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
    }

    // THIS LOGIC WILL RUN ON PROPERTIES THAT ARE OBJECT, IT WILL CHECK IF ITS AN ENTITY AND VALIDATE IT
    // LEAVE THIS COMMENTED UNTIL WE HAVE TESTS VERIFYING EXPECTED RESULTS

    // else if (
    //   typeof value === 'object' &&
    //   value &&
    //   value.getFormattedValidationErrors
    // ) {
    //   const objectErrors = getFormattedValidationErrors_NEW(value);
    //   if (objectErrors) updatedErrors[entityProperty] = objectErrors;
    // }
  }

  return Object.keys(errorsWithNestedErrorsAppended).length
    ? errorsWithNestedErrorsAppended
    : null;
}

function removeUnhelpfulErrorMessagesFromContactValidations(
  errors: { [key: string]: string } | null,
): { [key: string]: string } | null {
  if (!errors) return null;
  const updatedErrors = {};
  Object.entries(errors)
    .filter((entry: [string, string]) =>
      isUnhelpfulErrorMessagesFromContactValidations(entry),
    )
    .forEach(([key, message]: [string, string]) => {
      updatedErrors[key] = message;
    });

  return Object.keys(updatedErrors).length ? updatedErrors : null;
}

function isUnhelpfulErrorMessagesFromContactValidations(
  entry: [string, string],
) {
  const message = entry[1];
  if (typeof message !== 'string') return true;
  if (!message.endsWith('does not match any of the allowed types')) return true;
  return false;
}
