# UserCaseNote
 ```
---
  type: "object"
  keys: 
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "UserCaseNote"
    notes: 
      type: "string"
      flags: 
        presence: "required"
    userId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"

 ```
