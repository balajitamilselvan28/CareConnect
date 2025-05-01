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
    name: 'Education for All',
    slogan: 'Empowering through Education',
    location: 'New York, USA',
    yearEstablished: 2010,
    website: 'https://educationforall.org',
    description: 'We provide quality education to underprivileged children.',
    category: 'Education',
    photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 0
  },
  {
    name: 'Green Earth',
    slogan: 'Protecting Our Planet',
    location: 'San Francisco, USA',
    yearEstablished: 2015,
    website: 'https://greenearth.org',
    description: 'We work to protect the environment and promote sustainable living.',
    category: 'Environment',
    photo: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 0
  },
  {
    name: 'Sports for Youth',
    slogan: 'Building Character Through Sports',
    location: 'Chicago, USA',
    yearEstablished: 2012,
    website: 'https://sportsforyouth.org',
    description: 'We provide sports opportunities for underprivileged youth.',
    category: 'Sports',
    photo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 0
  },
  {
    name: 'Food for All',
    slogan: 'Ending Hunger Together',
    location: 'Los Angeles, USA',
    yearEstablished: 2018,
    website: 'https://foodforall.org',
    description: 'We provide food assistance to those in need.',
    category: 'Food',
    photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 0
  },
  {
    name: 'Tech for Good',
    slogan: 'Technology for Social Change',
    location: 'Seattle, USA',
    yearEstablished: 2019,
    website: 'https://techforgood.org',
    description: 'We provide technology education and resources to underserved communities.',
    category: 'Education',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    volunteerCount: 0
  }
];

const posts = [
  {
    title: 'Summer Camp Registration',
    description: 'Join our summer camp for underprivileged children.',
    photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    eventDate: '2024-07-01'
  },
  {
    title: 'Tree Planting Day',
    description: 'Help us plant 1000 trees in the city park.',
    photo: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    eventDate: '2024-06-15'
  },
  {
    title: 'Basketball Tournament',
    description: 'Annual basketball tournament for youth.',
    photo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    eventDate: '2024-08-01'
  },
  {
    title: 'Food Drive',
    description: 'Help us collect food for those in need.',
    photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    eventDate: '2024-06-20'
  },
  {
    title: 'Coding Workshop',
    description: 'Learn coding basics in our free workshop.',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
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