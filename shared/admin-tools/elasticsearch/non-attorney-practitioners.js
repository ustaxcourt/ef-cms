const { formatDateString } = require('../../src/business/utilities/DateHandler');
const { getClient } = require('../../../web-api/elasticsearch/client');
const { getVersion } = require('../util');

const environmentName = process.env.ENV;

const substantiveEventCodes = [
  'M001','M002','M003','M004','M005','M007','M008','M009','M010','M011','M012','M013','M014','M015','M016','M017',
  'M018','M019','M020','M021','M022','M023','M024','M026','M027','M028','M029','M030','M033','M034','M035','M036',
  'M037','M038','M039','M040','M041','M042','M043','M044','M045','M046','M047','M049','M050','M051','M052','M053',
  'M054','M055','M056','M058','M059','M060','M061','M062','M063','M064','M065','M066','M067','M068','M069','M070',
  'M071','M072','M073','M074','M075','M076','M077','M078','M080','M081','M083','M084','M085','M087','M088','M089',
  'M090','M091','M092','M093','M094','M095','M096','M097','M098','M099','M100','M101','M102','M103','M104','M105',
  'M106','M107','M108','M109','M110','M111','M113','M114','M115','M117','M118','M119','M120','M121','M122','M123',
  'M124','M125','M126','M129','M130','M131','M132','M133','M134','M135','M136','M137','M218','MOTR','PSDE'
];
const nonAttorneyBarNos = [
  'BJ2034','BA0665','EA0144','JD0205','PS0324','RR0797','TJ0667','VZ0001','BM0872','BC0724','CE0413','ED0179','MM1044',
  'SP0468','SD1024','WT0298','RR0823','BG0565','RT0273','MS0666','GS0544','HK0214','SR1670','SK0350','JA0160','GJ1264',
  'PJ0942','CL0378','CD0646','DA0359','FA0371','GP0278','GT0262','IA0045','JP0104','LM0582','MC0772','MR1393','MH0594',
  'NK0052','PB0210','RD0551','RC0451','SA0943','SM1230','TB0158','VJ0274','WT0310','WG0374','AC0285','AL0231','BW0910',
  'BC0758','CL0385','CM0729','CW0694','GD0512','JL0146','JS0165','KN0116','KG0276','LD0528','MM1108','MK0306','SK0367',
  'GA0580','GB0317','TC0290','SC0880','MC0793','PC0388','TD0271','BD0904','HE0466','SE0702','KF0163','ZJ0151','WJ1332',
  'CK0263','ML0544','SM1266','CR1072','VR0172','RS0509','GS0565','FT0222','BT0466'
];

const getNonAttorneys = async () => {
  const version = await getVersion();
  const esClient = await getClient({ environmentName, version });
  const query = {
    body: {
      _source: ['barNumber.S', 'name.S', 'pk.S'],
      from: 0,
      query: {
        bool: {
          must: [
            {
              terms: {
                'barNumber.S': nonAttorneyBarNos,
              },
            },
          ],
        },
      },
      size: 10000,
    },
    index: 'efcms-user',
  };

  const nonAttorneys = {};
  const results = await esClient.search(query);
  results.hits.hits.forEach(hit => {
    const userId = hit['_source']['pk']['S'].replace('user|', '');
    nonAttorneys[userId] = {
      barNumber: hit['_source']['barNumber']['S'],
      name: hit['_source']['name']['S'],
      userId
    };
  });
  return nonAttorneys;
};

const getUsersCases = async userId => {
  const version = await getVersion();
  const esClient = await getClient({ environmentName, version });
  const query = {
    body: {
      _source: [
        'caseCaption.S',
        'closedDate.S',
        'docketNumber.S',
        'docketNumberSuffix.S',
        'noticeOfTrialDate.S',
        'receivedAt.S',
        'status.S',
        'trialDate.S',
        'trialSessionId.S'
      ],
      from: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                'privatePractitioners.L.M.userId.S': userId,
              },
            },
          ],
        },
      },
      size: 10000,
    },
    index: 'efcms-case',
  };
  const results = await esClient.search(query);
  const usersCases = [];
  for (const hit of results.hits.hits) {
    const docketNumber = hit['_source']['docketNumber']['S'];
    const docketEntries = await getCasesDocketEntries(docketNumber);
    const caseRecord = {
      caseCaption: hit['_source'].caseCaption?.S ? hit['_source']['caseCaption']['S'] : '',
      closedDate: hit['_source'].closedDate?.S ? formatDateString(hit['_source']['closedDate']['S'], 'MMDDYYYY') : '',
      docketEntries,
      docketNumber,
      docketNumberSuffix: hit['_source'].docketNumberSuffix?.S ? hit['_source']['docketNumberSuffix']['S'] : '',
      noticeOfTrialDate: hit['_source'].noticeOfTrialDate?.S ?
        formatDateString(hit['_source']['noticeOfTrialDate']['S'], 'MMDDYYYY') : '',
      receivedAt: hit['_source'].receivedAt?.S ? formatDateString(hit['_source']['receivedAt']['S'], 'MMDDYYYY') : '',
      status: hit['_source']['status']['S'],
      trialDate: hit['_source'].trialDate?.S ? formatDateString(hit['_source']['trialDate']['S'], 'MMDDYYYY') : '',
      trialSessionId: hit['_source'].trialSessionId?.S ? hit['_source']['trialSessionId']['S'] : null
    };

    usersCases.push({
      ...caseRecord,
      closedByStipulatedDecision: closedByStipulatedDecision(caseRecord),
      hasNoticeOfAppeal: hasNoticeOfAppeal(caseRecord),
      userFiledPretrialMemorandum: userFiledPretrialMemorandum(caseRecord, userId),
      usersDocumentsCount: countUsersDocumentsFiled(caseRecord, userId),
      usersSubstantiveDocumentsCount: countUsersSubstantiveDocumentsFiled(caseRecord, userId),
      wentToTrial: wentToTrial(caseRecord)
    });

    await wait(1000);
  }
  return usersCases;
};

const getCasesDocketEntries = async docketNumber => {
  const version = await getVersion();
  const esClient = await getClient({ environmentName, version });
  const query = {
    body: {
      _source: ['docketNumber.S', 'eventCode.S', 'receivedAt.S', 'userId.S'],
      from: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                'docketNumber.S': docketNumber,
              },
            },
          ],
        },
      },
      size: 10000,
    },
    index: 'efcms-docket-entry',
  };
  const results = await esClient.search(query);
  return results.hits.hits.map(hit => {
    return {
      docketNumber: hit['_source']['docketNumber']['S'],
      eventCode: hit['_source'].eventCode?.S ? hit['_source']['eventCode']['S'] : null,
      receivedAt: hit['_source'].receivedAt?.S ? formatDateString(hit['_source']['receivedAt']['S'], 'MMDDYYYY') : null,
      userId: hit['_source'].userId?.S ? hit['_source']['userId']['S'] : null
    };
  });
};

const closedByStipulatedDecision = caseRecord => {
  return hasDocumentWithEventCodes(caseRecord, ['SDEC']);
};

const countUsersDocumentsFiled = (caseRecord, userId) => {
  return caseRecord.docketEntries.filter(de => {
    return de.userId === userId;
  }).length;
};

const countUsersSubstantiveDocumentsFiled = (caseRecord, userId) => {
  return caseRecord.docketEntries.filter(de => {
    return de.userId === userId && (de.eventCode in substantiveEventCodes);
  }).length;
};

const hasDocumentWithEventCodes = (caseRecord, eventCodes) => {
  return caseRecord.docketEntries.filter(de => {
    return (de.eventCode in eventCodes);
  }).length > 0;
};

const hasDocumentWithEventCodesFiledByUser = (caseRecord, eventCodes, userId) => {
  return caseRecord.docketEntries.filter(de => {
    return de.userId === userId && (de.eventCode in eventCodes);
  }).length > 0;
};

const hasNoticeOfAppeal = caseRecord => {
  return hasDocumentWithEventCodes(caseRecord, ['NOA']);
};

const userFiledPretrialMemorandum = (caseRecord, userId) => {
  return hasDocumentWithEventCodesFiledByUser(caseRecord, ['PHM', 'PMT'], userId);
};

const wentToTrial = caseRecord => {
  return !!(caseRecord.trialSessionId || caseRecord.trialDate);
}

const wait = async ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

(async () => {
  const nonAttorneys = await getNonAttorneys();
  console.log(
    '"Bar Number","Name","Docket Number","Proceedings Type","Case Caption","Case Status","Documents Filed",' +
    '"Substantive Documents Filed","Filed Pretrial Memorandum","Closed by Stipulated Decision","Went to Trial",' +
    '"Date of Receipt of Petition","Date of Notice of Trial","Date Closed","Trial Date","Has Notice of Appeal"',
  );
  for (const userId of Object.keys(nonAttorneys)) {
    const usersCases = await getUsersCases(userId);
    for (const uc of usersCases) {
      console.log(
        `"${nonAttorneys[userId]['barNumber']}","${nonAttorneys[userId]['name']}","${uc.docketNumber}",` +
        `"${uc.docketNumberSuffix}","${uc.caseCaption}","${uc.status}","${uc.usersDocumentsCount}",` +
        `"${uc.usersSubstantiveDocumentsCount}","${uc.userFiledPretrialMemorandum}",` +
        `"${uc.closedByStipulatedDecision}","${uc.wentToTrial}","${uc.receivedAt}","${uc.noticeOfTrialDate}",` +
        `"${uc.closedDate}","${uc.trialDate}","${uc.hasNoticeOfAppeal}"`,
      );
    }
  }
})();
