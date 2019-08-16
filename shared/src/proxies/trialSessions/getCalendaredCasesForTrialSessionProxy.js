const { get } = require('../requests');

/**
 * get calendared cases for trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to get the calendared cases
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCalendaredCasesForTrialSessionInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  // return get({
  //   applicationContext,
  //   endpoint: `/trial-sessions/${trialSessionId}/get-calendared-cases`,
  // });
  const cases = [
    {
      caseCaption: 'Mona Schultz, Petitioner',
      caseId: 'd32b4575-4ddd-4463-b911-dc9c1b29d8db',
      caseTitle:
        'Mona Schultz, Petitioner v. Commissioner of Internal Revenue, Respondent',
      caseType: 'CDP (Lien/Levy)',
      contactPrimary: {
        address1: '734 Cowley Parkway',
        address2: 'Cum aut velit volupt',
        address3: 'Et sunt veritatis ei',
        city: 'Et id aut est velit',
        countryType: 'domestic',
        email: 'taxpayer',
        name: 'Mona Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      contactSecondary: {},
      createdAt: '2019-08-16T16:41:26.848Z',
      currentVersion: '9',
      docketNumber: '116-19',
      docketNumberSuffix: 'L',
      docketRecord: [
        {
          description: 'Petition',
          documentId: '4350e990-f50d-4cc2-9009-2030d31dc2f5',
          filedBy: 'Mona Schultz',
          filingDate: '2019-08-16T16:41:26.849Z',
          index: 1,
          status: 'R served on 08/16/2019 12:41 PM',
        },
        {
          description:
            'Request for Place of Trial at Albuquerque, New Mexico, 1565973686234',
          eventCode: 'RQT',
          filingDate: '2019-08-16T16:41:26.848Z',
          index: 2,
        },
      ],
      documents: [
        {
          caseId: 'd32b4575-4ddd-4463-b911-dc9c1b29d8db',
          createdAt: '2019-08-16T16:41:26.849Z',
          documentId: '4350e990-f50d-4cc2-9009-2030d31dc2f5',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Mona Schultz',
          processingStatus: 'complete',
          receivedAt: '2019-08-16T16:41:26.849Z',
          servedAt: '2019-08-16T16:41:27.535Z',
          status: 'served',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
              assigneeName: 'IRS Holding Queue',
              caseId: 'd32b4575-4ddd-4463-b911-dc9c1b29d8db',
              caseStatus: 'Batched for IRS',
              completedAt: '2019-08-16T16:41:27.535Z',
              completedBy: 'Test Petitionsclerk',
              completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              completedMessage: 'Served on IRS',
              createdAt: '2019-08-16T16:41:26.849Z',
              docketNumber: '116-19',
              docketNumberSuffix: 'L',
              document: {
                createdAt: '2019-08-16T16:41:26.849Z',
                documentId: '4350e990-f50d-4cc2-9009-2030d31dc2f5',
                documentType: 'Petition',
                eventCode: 'P',
                filedBy: 'Mona Schultz',
                processingStatus: 'pending',
                receivedAt: '2019-08-16T16:41:26.849Z',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              isInitializeCase: true,
              isInternal: false,
              messages: [
                {
                  createdAt: '2019-08-16T16:41:26.849Z',
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Mona Schultz is ready for review.',
                  messageId: 'a18860c1-97d2-4602-8f52-60df726b8340',
                },
                {
                  createdAt: '2019-08-16T16:41:27.234Z',
                  from: 'Test Petitionsclerk',
                  fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition batched for IRS',
                  messageId: 'ff5b1ead-e278-4e70-8946-02e0aaf8a6e8',
                  to: 'IRS Holding Queue',
                  toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
                },
                {
                  createdAt: '2019-08-16T16:41:27.535Z',
                  from: 'IRS Holding Queue',
                  fromUserId: '63784910-c1af-4476-8988-a02f92da8e09',
                  message: 'Served on IRS',
                  messageId: '3fa1af94-6562-4b39-8bc7-7044d0348214',
                  to: null,
                  toUserId: null,
                },
              ],
              section: 'irsBatchSection',
              sentBy: 'Test Petitionsclerk',
              sentBySection: 'petitions',
              sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-08-16T16:41:26.849Z',
              workItemId: '5e0d4897-4398-4124-99b3-3dd1c1e4428e',
            },
          ],
        },
        {
          caseId: 'd32b4575-4ddd-4463-b911-dc9c1b29d8db',
          createdAt: '2019-08-16T16:41:26.849Z',
          documentId: '89db1669-313b-41cc-ae82-6070c769eb5a',
          documentType: 'Statement of Taxpayer Identification',
          eventCode: 'STIN',
          filedBy: 'Mona Schultz',
          processingStatus: 'complete',
          receivedAt: '2019-08-16T16:41:26.849Z',
          status: 'served',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: false,
      initialDocketNumberSuffix: 'L',
      initialTitle:
        'Mona Schultz, Petitioner v. Commissioner of Internal Revenue, Respondent',
      irsSendDate: '2019-08-16T16:41:27.534Z',
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: 'Petitioner',
      practitioners: [
        {
          addressLine1: '123 Main Street',
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'PT1234',
          email: 'practitioner',
          name: 'Test Practitioner',
          phone: '111-111-1111',
          pk: '9805d1ab-18d0-43ec-bafb-654e83405416',
          practitionerId: '9805d1ab-18d0-43ec-bafb-654e83405416',
          representingPrimary: true,
          role: 'practitioner',
          section: 'practitioner',
          sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          addressLine1: '123 Main Street',
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'PT5432',
          email: 'practitioner1',
          name: 'Test Practitioner',
          phone: '111-111-1111',
          pk: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
          practitionerId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
          representingPrimary: true,
          role: 'practitioner',
          section: 'practitioner',
          sk: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
          userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
        },
      ],
      preferredTrialCity: 'Albuquerque, New Mexico, 1565973686234',
      procedureType: 'Regular',
      respondents: [
        {
          addressLine1: '123 Main Street',
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'RT0987',
          email: 'respondent1',
          name: 'Test Respondent',
          phone: '111-111-1111',
          pk: '5fb6e815-b5d3-459b-b08b-49c61f0fce5e',
          respondentId: '5fb6e815-b5d3-459b-b08b-49c61f0fce5e',
          role: 'respondent',
          section: 'respondent',
          sk: '5fb6e815-b5d3-459b-b08b-49c61f0fce5e',
          userId: '5fb6e815-b5d3-459b-b08b-49c61f0fce5e',
        },
        {
          addressLine1: '123 Main Street',
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'RT6789',
          email: 'respondent',
          name: 'Test Respondent',
          phone: '111-111-1111',
          pk: '5805d1ab-18d0-43ec-bafb-654e83405416',
          respondentId: '5805d1ab-18d0-43ec-bafb-654e83405416',
          role: 'respondent',
          section: 'respondent',
          sk: '5805d1ab-18d0-43ec-bafb-654e83405416',
          userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      status: 'Calendared',
      trialDate: '2025-12-12T05:00:00.000Z',
      trialJudge: 'Judge Cohen',
      trialLocation: 'Albuquerque, New Mexico, 1565973686234',
      trialSessionId: 'ae0ea59c-3440-46dd-8c68-0ad9d6dbcb4b',
      trialTime: '10:00',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    },
    {
      caseCaption: 'Mona Schultz, Petitioner',
      caseId: 'c6518dcf-c27a-4b67-b5ef-1c9df4ebe09c',
      caseTitle:
        'Mona Schultz, Petitioner v. Commissioner of Internal Revenue, Respondent',
      caseType: 'CDP (Lien/Levy)',
      contactPrimary: {
        address1: '734 Cowley Parkway',
        address2: 'Cum aut velit volupt',
        address3: 'Et sunt veritatis ei',
        city: 'Et id aut est velit',
        countryType: 'domestic',
        email: 'taxpayer',
        name: 'Mona Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      contactSecondary: {},
      createdAt: '2019-08-16T16:41:28.107Z',
      currentVersion: '5',
      docketNumber: '117-19',
      docketNumberSuffix: 'L',
      docketRecord: [
        {
          description: 'Petition',
          documentId: 'e9d054dd-e6d2-47e3-baeb-31fe90de9820',
          filedBy: 'Mona Schultz',
          filingDate: '2019-08-16T16:41:28.107Z',
          index: 1,
          status: 'R served on 08/16/2019 12:41 PM',
        },
        {
          description:
            'Request for Place of Trial at Albuquerque, New Mexico, 1565973686234',
          eventCode: 'RQT',
          filingDate: '2019-08-16T16:41:28.107Z',
          index: 2,
        },
      ],
      documents: [
        {
          caseId: 'c6518dcf-c27a-4b67-b5ef-1c9df4ebe09c',
          createdAt: '2019-08-16T16:41:28.107Z',
          documentId: 'e9d054dd-e6d2-47e3-baeb-31fe90de9820',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Mona Schultz',
          processingStatus: 'complete',
          receivedAt: '2019-08-16T16:41:28.107Z',
          servedAt: '2019-08-16T16:41:28.796Z',
          status: 'served',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [
            {
              assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
              assigneeName: 'IRS Holding Queue',
              caseId: 'c6518dcf-c27a-4b67-b5ef-1c9df4ebe09c',
              caseStatus: 'Batched for IRS',
              completedAt: '2019-08-16T16:41:28.796Z',
              completedBy: 'Test Petitionsclerk',
              completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              completedMessage: 'Served on IRS',
              createdAt: '2019-08-16T16:41:28.107Z',
              docketNumber: '117-19',
              docketNumberSuffix: 'L',
              document: {
                createdAt: '2019-08-16T16:41:28.107Z',
                documentId: 'e9d054dd-e6d2-47e3-baeb-31fe90de9820',
                documentType: 'Petition',
                eventCode: 'P',
                filedBy: 'Mona Schultz',
                processingStatus: 'pending',
                receivedAt: '2019-08-16T16:41:28.107Z',
                userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                workItems: [],
              },
              isInitializeCase: true,
              isInternal: false,
              messages: [
                {
                  createdAt: '2019-08-16T16:41:28.107Z',
                  from: 'Test Petitioner',
                  fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Mona Schultz is ready for review.',
                  messageId: 'fb782648-89b0-4d03-aaff-81cf27bcab09',
                },
                {
                  createdAt: '2019-08-16T16:41:28.494Z',
                  from: 'Test Petitionsclerk',
                  fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition batched for IRS',
                  messageId: '61296c07-c567-4faa-820a-3a30a2c5c622',
                  to: 'IRS Holding Queue',
                  toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
                },
                {
                  createdAt: '2019-08-16T16:41:28.796Z',
                  from: 'IRS Holding Queue',
                  fromUserId: '63784910-c1af-4476-8988-a02f92da8e09',
                  message: 'Served on IRS',
                  messageId: 'a095751a-6ac9-42e3-aabe-a8c40e89078d',
                  to: null,
                  toUserId: null,
                },
              ],
              section: 'irsBatchSection',
              sentBy: 'Test Petitionsclerk',
              sentBySection: 'petitions',
              sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              updatedAt: '2019-08-16T16:41:28.107Z',
              workItemId: '6087e449-00c8-4845-aa81-50248dfcc669',
            },
          ],
        },
        {
          caseId: 'c6518dcf-c27a-4b67-b5ef-1c9df4ebe09c',
          createdAt: '2019-08-16T16:41:28.107Z',
          documentId: '1b24c9b6-fcd2-413d-8a56-cd6be498f584',
          documentType: 'Statement of Taxpayer Identification',
          eventCode: 'STIN',
          filedBy: 'Mona Schultz',
          processingStatus: 'complete',
          receivedAt: '2019-08-16T16:41:28.108Z',
          status: 'served',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      filingType: 'Myself',
      hasIrsNotice: false,
      initialDocketNumberSuffix: 'L',
      initialTitle:
        'Mona Schultz, Petitioner v. Commissioner of Internal Revenue, Respondent',
      irsSendDate: '2019-08-16T16:41:28.795Z',
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: 'Petitioner',
      practitioners: [],
      preferredTrialCity: 'Albuquerque, New Mexico, 1565973686234',
      procedureType: 'Regular',
      respondents: [],
      status: 'Calendared',
      trialDate: '2025-12-12T05:00:00.000Z',
      trialJudge: 'Judge Cohen',
      trialLocation: 'Albuquerque, New Mexico, 1565973686234',
      trialSessionId: 'ae0ea59c-3440-46dd-8c68-0ad9d6dbcb4b',
      trialTime: '10:00',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    },
  ];
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  cases.push(cases[0]);
  return Promise.resolve(cases);
};
