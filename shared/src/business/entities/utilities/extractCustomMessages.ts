import Joi from 'joi';

export function extractCustomMessages(
  schema,
  isJoiObject = false,
): { [key: string]: string[] } {
  const joiSchema = isJoiObject ? schema : Joi.object(schema);
  const customMessages = {};
  const keys = Object.keys(joiSchema.describe().keys);
  keys.forEach(key => {
    const field = joiSchema.describe().keys[key];
    if (field.preferences?.messages) {
      customMessages[key] = Object.values(field.preferences?.messages);
    }
  });
  return customMessages;
}
