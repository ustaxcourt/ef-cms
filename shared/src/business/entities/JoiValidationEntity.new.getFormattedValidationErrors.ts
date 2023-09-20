import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

type JoiErrorDetail = {
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
  return errors;
}
