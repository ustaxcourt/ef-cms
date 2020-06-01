# contacts/SurvivingSpouseContact
 ```
---
  type: "object"
  keys: 
    countryType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "domestic"
    address1: 
      type: "string"
      flags: 
        presence: "required"
    address2: 
      type: "string"
      flags: 
        presence: "optional"
    address3: 
      type: "string"
      flags: 
        presence: "optional"
    city: 
      type: "string"
      flags: 
        presence: "required"
    email: 
      type: "string"
      flags: 
        presence: "optional"
    inCareOf: 
      type: "string"
      flags: 
        presence: "optional"
    name: 
      type: "string"
      flags: 
        presence: "required"
    phone: 
      type: "string"
      flags: 
        presence: "optional"
    secondaryName: 
      type: "string"
      flags: 
        presence: "required"
    title: 
      type: "string"
      flags: 
        presence: "optional"
    serviceIndicator: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "Electronic"
        - "None"
        - "Paper"
    state: 
      type: "string"
      flags: 
        presence: "required"
    postalCode: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"

 ```
