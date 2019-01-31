const REGULAR_TRIAL_CITIES = [
  {
    state: 'Alabama',
    city: 'Birmingham',
  },
  {
    state: 'Alabama',
    city: 'Mobile',
  },
  {
    state: 'Alaska',
    city: 'Anchorage',
  },
  {
    state: 'Arizona',
    city: 'Phoenix',
  },
  {
    state: 'Arkansas',
    city: 'Little Rock',
  },
  {
    state: 'California',
    city: 'Los Angeles',
  },
  {
    state: 'California',
    city: 'San Diego',
  },
  {
    state: 'California',
    city: 'San Francisco',
  },
  {
    state: 'Colorado',
    city: 'Denver',
  },
  {
    state: 'Connecticut',
    city: 'Hartford',
  },
  // {
  //   state: 'Delaware',
  //   city: '',
  // },
  {
    state: 'District of Columbia',
    city: 'Washington',
  },
  {
    state: 'Florida',
    city: 'Jacksonville',
  },
  {
    state: 'Florida',
    city: 'Miami',
  },
  {
    state: 'Florida',
    city: 'Tampa',
  },
  {
    state: 'Georgia',
    city: 'Atlanta',
  },
  {
    state: 'Hawaii',
    city: 'Honolulu',
  },
  {
    state: 'Idaho',
    city: 'Boise',
  },
  {
    state: 'Illinois',
    city: 'Chicago',
  },
  {
    state: 'Indiana',
    city: 'Indianapolis',
  },
  {
    state: 'Iowa',
    city: 'Des Moines',
  },
  // {
  //   state: 'Kansas',
  //   city: '',
  // },
  {
    state: 'Kentucky',
    city: 'Louisville',
  },
  {
    state: 'Louisiana',
    city: 'New Orleans',
  },
  // {
  //   state: 'Maine',
  //   city: '',
  // },
  {
    state: 'Maryland',
    city: 'Baltimore',
  },
  {
    state: 'Massachusetts',
    city: 'Boston',
  },
  {
    state: 'Michigan',
    city: 'Detroit',
  },
  {
    state: 'Minnesota',
    city: 'St. Paul',
  },
  {
    state: 'Mississippi',
    city: 'Jackson',
  },
  {
    state: 'Missouri',
    city: 'Kansas City',
  },
  {
    state: 'Missouri',
    city: 'St. Louis',
  },
  {
    state: 'Montana',
    city: 'Helena',
  },
  {
    state: 'Nebraska',
    city: 'Omaha',
  },
  {
    state: 'Nevada',
    city: 'Las Vegas',
  },
  {
    state: 'Nevada',
    city: 'Reno',
  },
  // {
  //   state: 'New Hampshire',
  //   city: '',
  // },
  // {
  //   state: 'New Jersey',
  //   city: '',
  // },
  {
    state: 'New Mexico',
    city: 'Albuquerque',
  },
  {
    state: 'New York',
    city: 'Buffalo',
  },
  {
    state: 'New York',
    city: 'New York City',
  },
  {
    state: 'North Carolina',
    city: 'Winston-Salem',
  },
  // {
  //   state: 'North Dakota',
  //   city: '',
  // },
  {
    state: 'Ohio',
    city: 'Cincinnati',
  },
  {
    state: 'Ohio',
    city: 'Cleveland',
  },
  {
    state: 'Ohio',
    city: 'Columbus',
  },
  {
    state: 'Oklahoma',
    city: 'Oklahoma City',
  },
  {
    state: 'Oregon',
    city: 'Portland',
  },
  {
    state: 'Pennsylvania',
    city: 'Philadelphia',
  },
  {
    state: 'Pennsylvania',
    city: 'Pittsburgh',
  },
  // {
  //   state: 'Rhode Island',
  //   city: '',
  // },
  {
    state: 'South Carolina',
    city: 'Columbia',
  },
  // {
  //   state: 'South Dakota',
  //   city: '',
  // },
  {
    state: 'Tennessee',
    city: 'Knoxville',
  },
  {
    state: 'Tennessee',
    city: 'Memphis',
  },
  {
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    state: 'Texas',
    city: 'Dallas',
  },
  {
    state: 'Texas',
    city: 'El Paso',
  },
  {
    state: 'Texas',
    city: 'Houston',
  },
  {
    state: 'Texas',
    city: 'Lubbock',
  },
  {
    state: 'Texas',
    city: 'San Antonio',
  },
  {
    state: 'Utah',
    city: 'Salt Lake City',
  },
  // {
  //   state: 'Vermont',
  //   city: '',
  // },
  {
    state: 'Virginia',
    city: 'Richmond',
  },
  {
    state: 'Washington',
    city: 'Seattle',
  },
  {
    state: 'Washington',
    city: 'Spokane',
  },
  {
    state: 'West Virginia',
    city: 'Charleston',
  },
  {
    state: 'Wisconsin',
    city: 'Milwaukee',
  },
  // {
  //   state: 'Wyoming',
  //   city: '',
  // },
];

const SMALL_TRIAL_CITIES = [
  {
    state: 'Alabama',
    city: 'Birmingham',
  },
  {
    state: 'Alabama',
    city: 'Mobile',
  },
  {
    state: 'Alaska',
    city: 'Anchorage',
  },
  {
    state: 'Arizona',
    city: 'Phoenix',
  },
  {
    state: 'Arkansas',
    city: 'Little Rock',
  },
  {
    state: 'California',
    city: 'Fresno',
  },
  {
    state: 'California',
    city: 'Los Angeles',
  },
  {
    state: 'California',
    city: 'San Diego',
  },
  {
    state: 'California',
    city: 'San Francisco',
  },
  {
    state: 'Colorado',
    city: 'Denver',
  },
  {
    state: 'Connecticut',
    city: 'Hartford',
  },
  // {
  //   state: 'Delaware',
  //   city: '',
  // },
  {
    state: 'District of Columbia',
    city: 'Washington',
  },
  {
    state: 'Florida',
    city: 'Jacksonville',
  },
  {
    state: 'Florida',
    city: 'Miami',
  },
  {
    state: 'Florida',
    city: 'Tallahassee',
  },
  {
    state: 'Florida',
    city: 'Tampa',
  },
  {
    state: 'Georgia',
    city: 'Atlanta',
  },
  {
    state: 'Hawaii',
    city: 'Honolulu',
  },
  {
    state: 'Idaho',
    city: 'Boise',
  },
  {
    state: 'Idaho',
    city: 'Pocatello',
  },
  {
    state: 'Illinois',
    city: 'Chicago',
  },
  {
    state: 'Illinois',
    city: 'Peoria',
  },
  {
    state: 'Indiana',
    city: 'Indianapolis',
  },
  {
    state: 'Iowa',
    city: 'Des Moines',
  },
  {
    state: 'Kansas',
    city: 'Wichita',
  },
  {
    state: 'Kentucky',
    city: 'Louisville',
  },
  {
    state: 'Louisiana',
    city: 'New Orleans',
  },
  {
    state: 'Louisiana',
    city: 'Shreveport',
  },
  {
    state: 'Maine',
    city: 'Portland',
  },
  {
    state: 'Maryland',
    city: 'Baltimore',
  },
  {
    state: 'Massachusetts',
    city: 'Boston',
  },
  {
    state: 'Michigan',
    city: 'Detroit',
  },
  {
    state: 'Minnesota',
    city: 'St. Paul',
  },
  {
    state: 'Mississippi',
    city: 'Jackson',
  },
  {
    state: 'Missouri',
    city: 'Kansas City',
  },
  {
    state: 'Missouri',
    city: 'St. Louis',
  },
  {
    state: 'Montana',
    city: 'Billings',
  },
  {
    state: 'Montana',
    city: 'Helena',
  },
  {
    state: 'Nebraska',
    city: 'Omaha',
  },
  {
    state: 'Nevada',
    city: 'Las Vegas',
  },
  {
    state: 'Nevada',
    city: 'Reno',
  },
  // {
  //   state: 'New Hampshire',
  //   city: '',
  // },
  // {
  //   state: 'New Jersey',
  //   city: '',
  // },
  {
    state: 'New Mexico',
    city: 'Albuquerque',
  },
  {
    state: 'New York',
    city: 'Albany',
  },
  {
    state: 'New York',
    city: 'Buffalo',
  },
  {
    state: 'New York',
    city: 'New York City',
  },
  {
    state: 'New York',
    city: 'Syracuse',
  },
  {
    state: 'North Carolina',
    city: 'Winston-Salem',
  },
  {
    state: 'North Dakota',
    city: 'Bismarck',
  },
  {
    state: 'Ohio',
    city: 'Cincinnati',
  },
  {
    state: 'Ohio',
    city: 'Cleveland',
  },
  {
    state: 'Ohio',
    city: 'Columbus',
  },
  {
    state: 'Oklahoma',
    city: 'Oklahoma City',
  },
  {
    state: 'Oregon',
    city: 'Portland',
  },
  {
    state: 'Pennsylvania',
    city: 'Philadelphia',
  },
  {
    state: 'Pennsylvania',
    city: 'Pittsburgh',
  },
  // {
  //   state: 'Rhode Island',
  //   city: '',
  // },
  {
    state: 'South Carolina',
    city: 'Columbia',
  },
  {
    state: 'South Dakota',
    city: 'Aberdeen',
  },
  {
    state: 'Tennessee',
    city: 'Knoxville',
  },
  {
    state: 'Tennessee',
    city: 'Memphis',
  },
  {
    state: 'Tennessee',
    city: 'Nashville',
  },
  {
    state: 'Texas',
    city: 'Dallas',
  },
  {
    state: 'Texas',
    city: 'El Paso',
  },
  {
    state: 'Texas',
    city: 'Houston',
  },
  {
    state: 'Texas',
    city: 'Lubbock',
  },
  {
    state: 'Texas',
    city: 'San Antonio',
  },
  {
    state: 'Utah',
    city: 'Salt Lake City',
  },
  {
    state: 'Vermont',
    city: 'Burlington',
  },
  {
    state: 'Virginia',
    city: 'Richmond',
  },
  {
    state: 'Virginia',
    city: 'Roanoke',
  },
  {
    state: 'Washington',
    city: 'Seattle',
  },
  {
    state: 'Washington',
    city: 'Spokane',
  },
  {
    state: 'West Virginia',
    city: 'Charleston',
  },
  {
    state: 'Wisconsin',
    city: 'Milwaukee',
  },
  {
    state: 'Wyoming',
    city: 'Cheyenne',
  },
];

module.exports = {
  SMALL_TRIAL_CITIES,
  REGULAR_TRIAL_CITIES,
};
