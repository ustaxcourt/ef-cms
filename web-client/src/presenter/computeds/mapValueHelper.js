import _ from 'lodash';

export const mapValueHelper = value => {
  let object = {};

  if (_.isString(value)) {
    const key = _.camelCase(value);
    object[key] = true;
  }

  return object;
};
