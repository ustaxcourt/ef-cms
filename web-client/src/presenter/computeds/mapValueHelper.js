import {
  camelCase,
  isArray,
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  map,
} from 'lodash';

export const mapValueHelper = value => {
  let object = {};

  if (isString(value)) {
    const key = camelCase(value);
    object[key] = true;
  }

  if (isBoolean(value) || isNumber(value)) {
    const key = value.toString();
    object[key] = true;
  }

  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      object[i.toString()] = mapValueHelper(value[i]);
    }
  }

  if (isPlainObject(value)) {
    map(value, (value, key) => {
      object[key] = mapValueHelper(value);
    });
  }

  return object;
};
