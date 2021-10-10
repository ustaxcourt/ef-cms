const { deleteByGsi } = require('../helpers/deleteByGsi');

exports.deleteWorkItem = async ({ applicationContext, workItem }) =>
  deleteByGsi({ applicationContext, gsi: workItem.workItemId });
