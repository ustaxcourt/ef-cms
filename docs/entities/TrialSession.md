# TrialSession
 ```
---
  type: "object"
  keys: 
    address1: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""
    address2: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""
    city: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""
    courtReporter: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
    courthouseName: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
      allow: 
        - ""
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "TrialSession"
    irsCalendarAdministrator: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 100
    isCalendared: 
      type: "boolean"
      flags: 
        presence: "required"
    judge: 
      type: "object"
      flags: 
        presence: "optional"
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
        userId: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "guid"
              args: 
                options: 
                  version: 
                    - "uuidv4"
    maxCases: 
      type: "number"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "greater"
          args: 
            limit: 0
        - 
          name: "integer"
    notes: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 400
    noticeIssuedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    postalCode: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "pattern"
          args: 
            regex: "/^(\\d{5}|\\d{5}-\\d{4})$/"
    sessionType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Regular"
        - "Small"
        - "Hybrid"
        - "Special"
        - "Motion/Hearing"
    startDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
    startTime: 
      type: "string"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "pattern"
          args: 
            regex: "/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/"
    state: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "AK"
        - "AL"
        - "AR"
        - "AZ"
        - "CA"
        - "CO"
        - "CT"
        - "DC"
        - "DE"
        - "FL"
        - "GA"
        - "HI"
        - "IA"
        - "ID"
        - "IL"
        - "IN"
        - "KS"
        - "KY"
        - "LA"
        - "MA"
        - "MD"
        - "ME"
        - "MI"
        - "MN"
        - "MO"
        - "MS"
        - "MT"
        - "NC"
        - "ND"
        - "NE"
        - "NH"
        - "NJ"
        - "NM"
        - "NV"
        - "NY"
        - "OH"
        - "OK"
        - "OR"
        - "PA"
        - "RI"
        - "SC"
        - "SD"
        - "TN"
        - "TX"
        - "UT"
        - "VA"
        - "VT"
        - "WA"
        - "WI"
        - "WV"
        - "WY"
        - "AA"
        - "AE"
        - "AP"
        - "AS"
        - "FM"
        - "GU"
        - "MH"
        - "MP"
        - "PR"
        - "PW"
        - "VI"
    swingSession: 
      type: "boolean"
      flags: 
        presence: "optional"
    swingSessionId: 
      type: "string"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      whens: 
        - 
          ref: 
            path: 
              - "swingSession"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
    term: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Winter"
        - "Fall"
        - "Spring"
        - "Summer"
    termYear: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 4
    trialClerk: 
      type: "object"
      flags: 
        presence: "optional"
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 100
        userId: 
          type: "string"
          flags: 
            presence: "required"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "guid"
              args: 
                options: 
                  version: 
                    - "uuidv4"
    trialLocation: 
      type: "alternatives"
      flags: 
        presence: "required"
      matches: 
        - 
          schema: 
            type: "string"
            flags: 
              only: true
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
            allow: 
              - "Fresno, California"
              - "Tallahassee, Florida"
              - "Pocatello, Idaho"
              - "Peoria, Illinois"
              - "Wichita, Kansas"
              - "Shreveport, Louisiana"
              - "Portland, Maine"
              - "Billings, Montana"
              - "Albany, New York"
              - "Syracuse, New York"
              - "Bismarck, North Dakota"
              - "Aberdeen, South Dakota"
              - "Burlington, Vermont"
              - "Roanoke, Virginia"
              - "Cheyenne, Wyoming"
              - "Birmingham, Alabama"
              - "Mobile, Alabama"
              - "Anchorage, Alaska"
              - "Phoenix, Arizona"
              - "Little Rock, Arkansas"
              - "Los Angeles, California"
              - "San Diego, California"
              - "San Francisco, California"
              - "Denver, Colorado"
              - "Hartford, Connecticut"
              - "Washington, District of Columbia"
              - "Jacksonville, Florida"
              - "Miami, Florida"
              - "Tampa, Florida"
              - "Atlanta, Georgia"
              - "Honolulu, Hawaii"
              - "Boise, Idaho"
              - "Chicago, Illinois"
              - "Indianapolis, Indiana"
              - "Des Moines, Iowa"
              - "Louisville, Kentucky"
              - "New Orleans, Louisiana"
              - "Baltimore, Maryland"
              - "Boston, Massachusetts"
              - "Detroit, Michigan"
              - "St. Paul, Minnesota"
              - "Jackson, Mississippi"
              - "Kansas City, Missouri"
              - "St. Louis, Missouri"
              - "Helena, Montana"
              - "Omaha, Nebraska"
              - "Las Vegas, Nevada"
              - "Reno, Nevada"
              - "Albuquerque, New Mexico"
              - "Buffalo, New York"
              - "New York City, New York"
              - "Winston-Salem, North Carolina"
              - "Cincinnati, Ohio"
              - "Cleveland, Ohio"
              - "Columbus, Ohio"
              - "Oklahoma City, Oklahoma"
              - "Portland, Oregon"
              - "Philadelphia, Pennsylvania"
              - "Pittsburgh, Pennsylvania"
              - "Columbia, South Carolina"
              - "Knoxville, Tennessee"
              - "Memphis, Tennessee"
              - "Nashville, Tennessee"
              - "Dallas, Texas"
              - "El Paso, Texas"
              - "Houston, Texas"
              - "Lubbock, Texas"
              - "San Antonio, Texas"
              - "Salt Lake City, Utah"
              - "Richmond, Virginia"
              - "Seattle, Washington"
              - "Spokane, Washington"
              - "Charleston, West Virginia"
              - "Milwaukee, Wisconsin"
              - null
        - 
          schema: 
            type: "string"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "pattern"
                args: 
                  regex: "/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/"
    trialSessionId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseOrder: 
      type: "array"
      items: 
        - 
          type: "object"
          keys: 
            docketNumber: 
              type: "string"
              flags: 
                presence: "required"
                description: "Docket number of the case."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            isManuallyAdded: 
              type: "boolean"
              flags: 
                presence: "optional"
            removedFromTrial: 
              type: "boolean"
              flags: 
                presence: "optional"
            disposition: 
              type: "string"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 100
              whens: 
                - 
                  ref: 
                    path: 
                      - "removedFromTrial"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            removedFromTrialDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
              whens: 
                - 
                  ref: 
                    path: 
                      - "removedFromTrial"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null

 ```
