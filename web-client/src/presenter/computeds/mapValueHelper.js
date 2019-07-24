import _ from 'lodash';

export const mapValueHelper = value => {
  let object = {};

  if (_.isString(value)) {
    const key = _.camelCase(value);
    object[key] = true;
  }

  if (_.isBoolean(value) || _.isNumber(value)) {
    const key = value.toString();
    object[key] = true;
  }

  if (_.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      object[i.toString()] = mapValueHelper(value[i]);
    }
  }

  if (_.isPlainObject(value)) {
    _.map(value, (value, key) => {
      object[key] = mapValueHelper(value);
    });
  }

  return object;
};
