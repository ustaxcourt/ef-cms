const { get } = require('lodash');
/**
 * @param {object} arguments deconstructed arguments
 * @param {object} arguments.applicationContext the application context
 * @param {string} arguments.index the index we're querying
 * @returns {object} the mapping properties of the specified index
 */
exports.getIndexMappingFields = async ({ applicationContext, index }) => {
  try {
    const searchClient = applicationContext.getSearchClient();

    const indexMapping = await searchClient.indices.getMapping({
      index,
    });
    return get(indexMapping, `${index}.mappings.properties`);
  } catch (e) {
    await applicationContext.notifyHoneybadger(e, { index });
  }
};
