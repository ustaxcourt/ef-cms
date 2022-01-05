/**
 * setPdfFormFields helper function
 *
 * @param {array} fields array of pdf form fields
 */

exports.setPdfFormFields = fields => {
  fields.forEach(field => {
    const fieldType = field.constructor.name;
    if (fieldType === 'PDFTextField') {
      const text = field.getText();
      field.setText(text);
    }
  });
};
