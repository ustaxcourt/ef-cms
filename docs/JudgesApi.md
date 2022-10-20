# DevEfCms.JudgesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**judgesPost**](JudgesApi.md#judgesPost) | **POST** /judges | creates a judge user

<a name="judgesPost"></a>
# **judgesPost**
> User judgesPost()

creates a judge user

creates a judge user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.JudgesApi();
apiInstance.judgesPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

