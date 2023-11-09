import { NewMessage } from '../../entities/NewMessage';

export const validateCreateMessageInteractor = ({
  message,
}: {
  message: {
    message?: string;
    subject?: string;
    toSection?: string;
    toUserId?: string;
  };
}): Record<string, string> | null => {
  return new NewMessage(message).getFormattedValidationErrors();
};
