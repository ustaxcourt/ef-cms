import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { state } from '@web-client/presenter/app.cerebral';

class CourtOrder extends JoiValidationEntity {
  public documentContents: string;

  constructor(rawOrder) {
    super('CourtOrder');
    this.documentContents = rawOrder.documentContents;
  }

  getValidationRules() {
    return {
      documentContents: JoiValidationConstants.STRING.required().messages({
        'any.required': 'Enter order text',
      }),
    };
  }
}

export const validateCourtOrderAction = ({ get, path }: ActionProps) => {
  const documentContents = get(state.form.documentContents);

  const orderWithoutBody = new CourtOrder({
    documentContents,
  });

  const errors = orderWithoutBody.getFormattedValidationErrors();

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = ['documentContents'];

    return path.error({
      errorDisplayOrder,
      errors,
    });
  }
};
