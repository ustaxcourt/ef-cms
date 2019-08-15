module.exports = [
  'http://localhost:1234/mock-login?token=judgeArmen&path=/',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  // the below sessions will become "in the past" on 11/29/2019 -- which may make working-copy not visible
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
];
