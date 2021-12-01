participant Cognito UI
participant UI
participant API
participant New Tab
participant Cognito API
Cognito UI->UI: login send ?code
UI->API: send code POST@/auth
API->Cognito API: confirm code
Cognito API->API: tokens
API->UI: set refresh token in cookie
note over UI: store idToken in memory
UI->New Tab : user open new tab
New Tab->API: hit refreshToken endpoint
note over API: get refreshToken from cookie
API->Cognito API: send refresh token
Cognito API->API: get new idToken
API->New Tab: send fresh  idToken
note over New Tab: store idToken
note over UI: user clicks log out
UI->API: DELETE@/auth
API->UI: clear cookies
UI->Cognito UI: redirect