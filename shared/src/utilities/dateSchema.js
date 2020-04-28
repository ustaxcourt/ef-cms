const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { FORMATS } = require('../business/utilities/DateHandler');

export const getTimestampSchema = () => joi.date().iso().format(FORMATS.ISO);
