import crypto from 'crypto';
import joi from 'joi';

function stringifyEverything(input): string {
  let bigOlString = '';
  function stringifyStuff(obj) {
    const theType = typeof obj;
    if (theType === 'object' || Array.isArray(obj)) {
      for (const key in obj) {
        stringifyStuff(obj[key]);
      }
    } else if (theType === 'string') {
      bigOlString += obj;
    } else if (theType === 'number') {
      bigOlString += obj.toString();
    } else if (theType === 'boolean') {
      bigOlString += obj.toString();
    } else if (theType === 'function') {
      bigOlString += obj.toString();
    } else if (theType === 'symbol') {
      bigOlString += obj.toString();
    } else if (theType === 'undefined') {
      bigOlString += undefined;
    }

    return bigOlString;
  }
  return stringifyStuff(input);
}

export function createValidationIdentifier(
  schema: Function | Record<string, any> | joi.ObjectSchema,
): string {
  const stringRules = stringifyEverything(schema);
  const hash = crypto.createHash('sha256').update(stringRules).digest('hex');
  return hash;
}
