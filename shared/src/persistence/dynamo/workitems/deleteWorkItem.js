const { deleteByGsi } = require('../helpers/deleteByGsi');

exports.deleteWorkItem = ({ applicationContext, workItem }) =>
  deleteByGsi({ applicationContext, gsi: workItem.workItemId });
