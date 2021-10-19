const { deleteByGsi } = require('../helpers/deleteByGsi');

exports.deleteWorkItem = ({ applicationContext, workItem }) =>
  deleteByGsi({ applicationContext, gsi: `work-item|${workItem.workItemId}` });
