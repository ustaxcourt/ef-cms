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
  mail: any;
  bounceRecipient: string;
  bouncedRecipients: {
    emailAddress: string;
    diagnosticCode: string;
  }[];
  bounceSubType: string;
  bounceType: string;
  errorMessage: string;
  subject: string;
};
