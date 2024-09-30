import { AUTOMATIC_BLOCKED_REASONS } from '@shared/business/entities/EntityConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import crypto from 'crypto';
import joi from 'joi';

const fruitSchema = joi.object({
  automaticBlockedReasons: JoiValidationConstants.STRING.valid(
    ...Object.values(AUTOMATIC_BLOCKED_REASONS),
  ),
  color: joi.string().required(),
  name: joi.string().custom((value, helpers) => {
    if (value === 'pear') {
      return value;
    }
    return helpers.error('any.invalid');
  }),
});

// console.log(fruitSchema.validate({ color: 'red', name: 'pear' }));

// function NechamasFunction(a, b) {
//   JoiValidationConstants.STRING.valid(
//     ...Object.values(AUTOMATIC_BLOCKED_REASONS),
//   );
//   a - b;

//   return a + b;
// }

export function stringifyEverything(input): string {
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

const stringRules = stringifyEverything(fruitSchema);
// console.log(stringRules);
const hash = crypto.createHash('sha256').update(stringRules).digest('hex');
console.log(hash);
