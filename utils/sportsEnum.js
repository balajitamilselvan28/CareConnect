/**
 * Sports enum - A collection of common sports categories and specific sports
 */

// Sports Categories
const SPORTS_CATEGORIES = {
  TEAM: 'Team Sports',
  INDIVIDUAL: 'Individual Sports',
  WATER: 'Water Sports',
  COMBAT: 'Combat Sports',
  ATHLETICS: 'Athletics',
  RACKET: 'Racket Sports',
  WINTER: 'Winter Sports',
  EXTREME: 'Extreme Sports',
  MIND: 'Mind Sports',
  OTHER: 'Other'
};

// Specific Sports by Category
const SPORTS = {
  // Team Sports
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  CRICKET: 'Cricket',
  VOLLEYBALL: 'Volleyball',
  HOCKEY: 'Hockey',
  BASEBALL: 'Baseball',
  RUGBY: 'Rugby',
  HANDBALL: 'Handball',
  
  // Individual Sports
  TENNIS: 'Tennis',
  GOLF: 'Golf',
  SWIMMING: 'Swimming',
  ATHLETICS: 'Athletics',
  GYMNASTICS: 'Gymnastics',
  CYCLING: 'Cycling',
  
  // Water Sports
  SWIMMING_COMP: 'Swimming (Competitive)',
  DIVING: 'Diving',
  WATER_POLO: 'Water Polo',
  SURFING: 'Surfing',
  SAILING: 'Sailing',
  ROWING: 'Rowing',
  
  // Combat Sports
  BOXING: 'Boxing',
  WRESTLING: 'Wrestling',
  JUDO: 'Judo',
  KARATE: 'Karate',
  TAEKWONDO: 'Taekwondo',
  
  // Athletics
  RUNNING: 'Running',
  JUMPING: 'Jumping',
  THROWING: 'Throwing',
  COMBINED_EVENTS: 'Combined Events',
  
  // Racket Sports
  BADMINTON: 'Badminton',
  TABLE_TENNIS: 'Table Tennis',
  SQUASH: 'Squash',
  
  // Winter Sports
  SKIING: 'Skiing',
  SNOWBOARDING: 'Snowboarding',
  ICE_HOCKEY: 'Ice Hockey',
  FIGURE_SKATING: 'Figure Skating',
  
  // Extreme Sports
  SKATEBOARDING: 'Skateboarding',
  BMX: 'BMX',
  ROCK_CLIMBING: 'Rock Climbing',
  PARKOUR: 'Parkour',
  
  // Mind Sports
  CHESS: 'Chess',
  BRIDGE: 'Bridge',
  ESPORTS: 'Esports',
  
  // Other
  ARCHERY: 'Archery',
  FENCING: 'Fencing',
  EQUESTRIAN: 'Equestrian'
};

// Popularity Levels
const POPULARITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

module.exports = {
  SPORTS_CATEGORIES,
  SPORTS,
  POPULARITY_LEVELS
};