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

export function getFormattedValidationErrors_NEW(
  entity,
): Record<string, string> | null {
  let errors: {} | null = null;

  if (isJoiValidationEntity(entity)) {
    errors = getFormattedValidationErrorsHelper_NEW(entity);
  }

  const updatedErrors =
    removeUnhelpfulErrorMessagesFromContactValidations(errors);

  return updatedErrors;
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
