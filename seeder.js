const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const NGO = require('./models/NGO');
const Post = require('./models/Post');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prongo');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456'
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: '123456'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: '123456'
  }
];

const ngos = [
  {
    name: 'Agaram Foundation',
    slogan: 'Aram Seiya Virumbuvom',
    location: 'Tamilnadu, India',
    yearEstablished: 2006,
    website: 'https://agaram.in/',
    description: 'Creating positive change in the socio-economic status of rural society by offering quality education and empowering youth with skills for a better future.',
    category: 'Education',
    photo: '/logos/agaram logo.jpg',
    volunteerCount: 0
  },
  {
    name: 'Uzhavan Foundation',
    slogan: 'Paiṟ seiya virumbu',
    location: 'Tamilnadu, India',
    yearEstablished: 2019,
    website: 'https://uzhavanfoundation.in/',
    description: 'Promote sustainable and environmentally friendly farming practices',
    category: 'Environment',
    photo: '/logos/uzhavan logo.jpg',
    volunteerCount: 0
  },
  {
    name: 'Victory Foundation',
    slogan: 'Coz everyone deserves a win',
    location: 'Tamilnadu, India',
    yearEstablished: 2008,
    website: 'https://victorysportsfoundation.org/',
    description: 'mission is to empower marginalized children and youth through sports, fostering self-confidence, integrity, and talent',
    category: 'Other',
    photo: '/logos/victory logo.jpg',
    volunteerCount: 0
  },
  {
    name: 'Help On Hunger',
    slogan: 'Living in a Home',
    location: 'Tamilnadu , India',
    yearEstablished: 2018,
    website: 'https://helponhunger.org/',
    description: 'We provide food assistance to those in need through community pantries, meal programs, and emergency food services. We believe everyone deserves access to nutritious food.',
    category: 'Community Development',
    photo: '/logos/help on hunger logo.jpg',
    volunteerCount: 0
  },
  {
    name: 'EKAM Foundation',
    slogan: 'enhancing maternal and child health',
    location: 'Tamilnadu, India',
    yearEstablished: 2019,
    website: 'https://ekam.ngo/',
    description: 'To ensure that no child or mother is denied access to quality healthcare due to financial constraints',
    category: 'Health',
    photo: '/logos/ekamfoundation logo.jpg',
    volunteerCount: 0
  }
];

const posts = [
  {
    title: 'Summer Camp Registration',
    description: 'Join our summer camp for underprivileged children. Activities include arts and crafts, sports, nature exploration, and educational workshops. Limited spots available, register early!',
    photo: '/images/agaram events.jpg',
    eventDate: '2024-07-01'
  },
  {
    title: 'Tree Planting Day',
    description: 'Help us plant 1000 trees in the city park. Join our environmental conservation efforts to create a greener future. Tools and refreshments will be provided for all volunteers.',
    photo: '/images/agaram post.jpg',
    eventDate: '2024-06-15'
  },
  {
    title: 'Basketball Tournament',
    description: 'Annual basketball tournament for youth. Teams from across the city will compete in this exciting event. Prizes for winners and participation certificates for all players.',
    photo: '/images/agaram 1 (1).jpg',
    eventDate: '2024-08-01'
  },
  {
    title: 'Food Drive',
    description: 'Help us collect food for those in need. We\'re accepting non-perishable food items, canned goods, and hygiene products. Your donations will directly support local families facing food insecurity.',
    photo: '/images/agaram 1 (2).jpg',
    eventDate: '2024-06-20'
  },
  {
    title: 'Coding Workshop',
    description: 'Learn coding basics in our free workshop. Perfect for beginners with no prior experience. Topics include HTML, CSS, and JavaScript fundamentals. Laptops will be provided for participants.',
    photo: '/images/agaram logo.jpg',
    eventDate: '2024-07-15'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await NGO.deleteMany();
    await Post.deleteMany();

    // Create users
    const createdUsers = await User.create(users);

    // Create NGOs
    const createdNGOs = await NGO.create(ngos);

    // Create posts with NGO references
    const createdPosts = await Post.create(
      posts.map((post, index) => ({
        ...post,
        ngo: createdNGOs[index]._id
      }))
    );

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await NGO.deleteMany();
    await Post.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 