export const saveAndSubmitCaseAction = () => {
  const docketNumber = ''; // TODO: update to docket number that was generated
  return {
    alertSuccess: {
      message:
        'Your case has been created and your documents sent to the U.S. Tax Court.',
      title: `Your case has been assigned docket number ${docketNumber}`,
    },
  };
};
