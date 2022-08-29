type TBounceRecipient = {
  emailAddress: string;
  diagnosticCode: string;
};

type TBounce = {
  bounceSubType: string;
  bounceType: string;
  bouncedRecipients: TBounceRecipient[];
};

type TNotification = {
  bounceRecipient: string;
  bounceSubType: string;
  bounceType: string;
  errorMessage: string;
  subject: string;
};
