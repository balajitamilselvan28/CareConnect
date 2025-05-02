import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNGO } from '../context/NGOContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSafeImageUrl, handleImageError } from '../utils/imageUtils';

// Function to get category-specific images
const getCategoryImage = (category) => {
  switch (category) {
    case 'Education':
      return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Health':
      return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Environment':
      return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Animal Welfare':
      return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Human Rights':
      return 'https://images.unsplash.com/photo-1591189824935-9d120b2f0f7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Disaster Relief':
      return 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    case 'Community Development':
      return 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    default:
      return 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
};

// Add custom animations for the NGO detail page
const animations = `
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

// Add the animations to the document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(animations));
document.head.appendChild(style);

// Care Connect theme styles with blue and green colors
const styles = {
  header: {
    background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.2) 0%, rgba(78, 219, 244, 0.2) 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 15s ease infinite',
    borderBottom: '1px solid rgba(128, 244, 78, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(78, 219, 244, 0.08)',
  },
  card: {
    border: '1px solid rgba(0, 128, 128, 0.1)',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.1)',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0, 128, 128, 0.15)'
    }
  },
  tabActive: {
    color: '#008080',
    borderBottom: '2px solid #0066CC',
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderRadius: '8px 8px 0 0'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
    border: 'none',
    color: 'white',
    padding: '10px 25px',
    borderRadius: '25px',
    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 128, 128, 0.3)'
    }
  },
  buttonOutline: {
    color: '#0066CC',
    border: '2px solid rgba(0, 128, 128, 0.5)',
    padding: '10px 25px',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 102, 204, 0.1)',
      transform: 'translateY(-2px)'
    }
  },
  profileImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '4px solid rgba(34, 139, 34, 0.2)',
    boxShadow: '0 4px 15px rgba(34, 139, 34, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(34, 139, 34, 0.3)'
    }
  },
  postImage: {
    maxHeight: '500px',
    objectFit: 'cover',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  eventCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 255, 240, 0.9) 100%)',
    border: '1px solid rgba(34, 139, 34, 0.1)',
    borderRadius: '15px',
    overflow: 'hidden'
  },
  icon: {
    color: '#228B22',
    marginRight: '8px'
  }
};

// Sample posts data
// Function to generate NGO-specific posts
const getNGOSpecificPosts = (ngo) => {
  if (!ngo) return [];
  
  // Define category-specific post data
  const postsByCategory = {
    'Education': [
      {
        _id: '1',
        title: 'Literacy Program Success',
        content: `Our literacy program in ${ngo.location} has successfully taught 200 children to read and write! Thank you to all our amazing volunteers and donors who made this possible.`,
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Education image
        createdAt: new Date('2024-03-15'),
        likes: 245,
        comments: [
          { _id: '1', text: 'Amazing work!', user: 'John Doe' },
          { _id: '2', text: 'Can\'t wait to volunteer for the next program!', user: 'Jane Smith' }
        ]
      }
    ],
    'Health': [
      {
        _id: '1',
        title: 'Medical Camp Success',
        content: `Our recent medical camp in ${ngo.location} provided free healthcare services to over 500 people! Thank you to all the doctors, nurses, and volunteers who contributed.`,
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Health image
        createdAt: new Date('2024-03-10'),
        likes: 320,
        comments: [
          { _id: '1', text: 'This is incredible work!', user: 'Dr. Smith' },
          { _id: '2', text: 'Proud to be part of this initiative!', user: 'Nurse Johnson' }
        ]
      }
    ],
    'Environment': [
      {
        _id: '1',
        title: 'Tree Planting Day Success',
        content: `We successfully planted 500 trees in ${ngo.location}! This initiative will help combat climate change and improve air quality in our community. Thank you to all our amazing volunteers who made this possible.`,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Environment image
        createdAt: new Date('2024-03-15'),
        likes: 245,
        comments: [
          { _id: '1', text: 'Amazing work for our planet!', user: 'John Doe' },
          { _id: '2', text: 'Can\'t wait for the next planting event!', user: 'Jane Smith' }
        ]
      }
    ],
    'Animal Welfare': [
      {
        _id: '1',
        title: 'Animal Rescue Success',
        content: `Our team successfully rescued and rehabilitated 30 stray animals in ${ngo.location} this month! All of them have found loving homes. Thank you to our dedicated volunteers and generous donors.`,
        image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Animal image
        createdAt: new Date('2024-03-12'),
        likes: 278,
        comments: [
          { _id: '1', text: 'This warms my heart!', user: 'Pet Lover' },
          { _id: '2', text: 'Thank you for your amazing work!', user: 'Animal Friend' }
        ]
      }
    ],
    'Human Rights': [
      {
        _id: '1',
        title: 'Legal Aid Camp Success',
        content: `Our legal aid camp in ${ngo.location} provided free legal assistance to over 100 underprivileged individuals. We're committed to ensuring justice for all. Thank you to all the lawyers and volunteers who participated.`,
        image: 'https://images.unsplash.com/photo-1591189824935-9d120b2f0f7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Human Rights image
        createdAt: new Date('2024-03-08'),
        likes: 198,
        comments: [
          { _id: '1', text: 'Justice for all!', user: 'Legal Eagle' },
          { _id: '2', text: 'Proud to support this cause!', user: 'Rights Advocate' }
        ]
      }
    ],
    'Disaster Relief': [
      {
        _id: '1',
        title: 'Flood Relief Success',
        content: `Our team provided emergency supplies and shelter to 200 families affected by recent floods in ${ngo.location}. We're continuing our efforts to help rebuild homes. Thank you to all donors and volunteers.`,
        image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Disaster Relief image
        createdAt: new Date('2024-03-05'),
        likes: 312,
        comments: [
          { _id: '1', text: 'Thank you for your quick response!', user: 'Community Member' },
          { _id: '2', text: 'How can we contribute more?', user: 'Willing Helper' }
        ]
      }
    ],
    'Community Development': [
      {
        _id: '1',
        title: 'Community Center Inauguration',
        content: `We're proud to announce the opening of our new community center in ${ngo.location}! This space will provide educational resources, vocational training, and a safe gathering place for local residents. Thank you to everyone who contributed to this project.`,
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Community Development image
        createdAt: new Date('2024-03-18'),
        likes: 267,
        comments: [
          { _id: '1', text: 'This is exactly what our community needed!', user: 'Local Resident' },
          { _id: '2', text: 'Looking forward to the programs!', user: 'Community Supporter' }
        ]
      }
    ]
  };
  
  // Default post if category doesn't match or is undefined
  const defaultPost = {
    _id: '1',
    title: `${ngo.name} Recent Success`,
    content: `We're making a difference in ${ngo.location}! Thanks to our dedicated volunteers and generous donors, we've been able to impact hundreds of lives positively. Stay tuned for more updates on our ongoing projects.`,
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Default image
    createdAt: new Date('2024-03-15'),
    likes: 245,
    comments: [
      { _id: '1', text: 'Great work!', user: 'John Doe' },
      { _id: '2', text: 'Proud to support this cause!', user: 'Jane Smith' }
    ]
  };
  
  // Return category-specific post or default one
  return postsByCategory[ngo.category] || [defaultPost];
};

// Function to generate NGO-specific events
const getNGOSpecificEvents = (ngo) => {
  if (!ngo) return [];
  
  // Define category-specific event data
  const eventsByCategory = {
    'Education': [
      {
        _id: '1',
        title: 'Education for All Workshop',
        description: `Join ${ngo.name} for a day of educational workshops, teaching demonstrations, and community learning activities. Help us make education accessible to everyone in ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Education event image
        date: '2024-04-15',
        time: '9:00 AM - 3:00 PM',
        location: ngo.location,
        registeredCount: 120
      }
    ],
    'Health': [
      {
        _id: '1',
        title: 'Health Awareness Camp',
        description: `${ngo.name} invites you to our health awareness camp featuring free check-ups, health education sessions, and wellness workshops. Together, let's build a healthier community in ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Health event image
        date: '2024-04-18',
        time: '10:00 AM - 4:00 PM',
        location: ngo.location,
        registeredCount: 180
      }
    ],
    'Environment': [
      {
        _id: '1',
        title: 'Earth Day Celebration',
        description: `Join ${ngo.name} for a day of environmental awareness, tree planting, clean-up drives, and eco-friendly workshops. Let's work together to protect our planet, starting with ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Environment event image
        date: '2024-04-22',
        time: '10:00 AM - 4:00 PM',
        location: ngo.location,
        registeredCount: 150
      }
    ],
    'Animal Welfare': [
      {
        _id: '1',
        title: 'Animal Adoption Day',
        description: `${ngo.name} is hosting an adoption day for rescued animals. Come meet potential furry friends, learn about responsible pet ownership, and support our animal welfare initiatives in ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Animal event image
        date: '2024-04-20',
        time: '11:00 AM - 5:00 PM',
        location: ngo.location,
        registeredCount: 90
      }
    ],
    'Human Rights': [
      {
        _id: '1',
        title: 'Rights Awareness Workshop',
        description: `${ngo.name} invites you to a workshop on understanding and protecting your rights. Legal experts will provide guidance on accessing justice and standing up for equality in ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1591189824935-9d120b2f0f7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Human Rights event image
        date: '2024-04-25',
        time: '2:00 PM - 6:00 PM',
        location: ngo.location,
        registeredCount: 110
      }
    ],
    'Disaster Relief': [
      {
        _id: '1',
        title: 'Disaster Preparedness Training',
        description: `Join ${ngo.name} for essential disaster preparedness training. Learn life-saving skills, emergency response techniques, and how to protect your community in ${ngo.location} during natural disasters.`,
        image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Disaster Relief event image
        date: '2024-04-28',
        time: '9:00 AM - 5:00 PM',
        location: ngo.location,
        registeredCount: 130
      }
    ],
    'Community Development': [
      {
        _id: '1',
        title: 'Community Building Workshop',
        description: `${ngo.name} is organizing a community building workshop featuring skill development sessions, networking opportunities, and collaborative projects to strengthen our community in ${ngo.location}.`,
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Community Development event image
        date: '2024-04-30',
        time: '10:00 AM - 4:00 PM',
        location: ngo.location,
        registeredCount: 140
      }
    ]
  };
  
  // Default event if category doesn't match or is undefined
  const defaultEvent = {
    _id: '1',
    title: `${ngo.name} Community Event`,
    description: `Join us for a day of community engagement, awareness activities, and collaborative initiatives. Together, we can make a difference in ${ngo.location}.`,
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Default event image
    date: '2024-04-22',
    time: '10:00 AM - 4:00 PM',
    location: ngo.location,
    registeredCount: 150
  };
  
  // Return category-specific event or default one
  return eventsByCategory[ngo.category] || [defaultEvent];
};

// Initialize with empty arrays, will be populated in useEffect
const samplePosts = [];
const sampleEvents = [];

// Function to generate NGO-specific internship data
const getNGOSpecificInternships = (ngo) => {
  if (!ngo) return [];
  
  // Define category-specific internship data
  const internshipsByCategory = {
    'Education': [
      {
        _id: '1',
        title: 'Education Program Coordinator Intern',
        description: `Join ${ngo.name}'s education team to help develop and implement educational programs for underprivileged children in ${ngo.location}.`,
        requirements: ['Education background', 'Experience working with children', 'Curriculum development skills'],
        duration: '6 months',
        stipend: '₹15,000/month',
        postedDate: new Date('2024-03-15'),
        deadline: '2024-04-30'
      },
      {
        _id: '2',
        title: 'Digital Learning Specialist',
        description: `Help ${ngo.name} create digital learning materials and online courses for students in ${ngo.location}.`,
        requirements: ['Educational technology experience', 'Content creation skills', 'Basic programming knowledge'],
        duration: '4 months',
        stipend: '₹12,000/month',
        postedDate: new Date('2024-03-10'),
        deadline: '2024-04-20'
      }
    ],
    'Health': [
      {
        _id: '1',
        title: 'Community Health Intern',
        description: `Support ${ngo.name}'s health initiatives by conducting health awareness campaigns in ${ngo.location}.`,
        requirements: ['Healthcare background', 'Public health knowledge', 'Communication skills'],
        duration: '3 months',
        stipend: '₹18,000/month',
        postedDate: new Date('2024-03-05'),
        deadline: '2024-04-15'
      },
      {
        _id: '2',
        title: 'Medical Camp Coordinator',
        description: `Help organize and manage medical camps for underserved communities in ${ngo.location}.`,
        requirements: ['Healthcare administration experience', 'Event management skills', 'First aid certification'],
        duration: '5 months',
        stipend: '₹20,000/month',
        postedDate: new Date('2024-03-12'),
        deadline: '2024-04-25'
      }
    ],
    'Environment': [
      {
        _id: '1',
        title: 'Environmental Research Intern',
        description: `Join ${ngo.name}'s research team to study local ecosystem changes and contribute to conservation efforts in ${ngo.location}.`,
        requirements: ['Environmental Science background', 'Field research experience', 'Data analysis skills'],
        duration: '3 months',
        stipend: '₹16,000/month',
        postedDate: new Date('2024-03-20'),
        deadline: '2024-04-15'
      },
      {
        _id: '2',
        title: 'Sustainable Agriculture Specialist',
        description: `Work with local farmers in ${ngo.location} to implement sustainable farming practices and reduce environmental impact.`,
        requirements: ['Agricultural knowledge', 'Sustainability expertise', 'Community outreach experience'],
        duration: '6 months',
        stipend: '₹22,000/month',
        postedDate: new Date('2024-03-08'),
        deadline: '2024-04-22'
      }
    ],
    'Animal Welfare': [
      {
        _id: '1',
        title: 'Animal Rescue Coordinator',
        description: `Assist ${ngo.name} in coordinating animal rescue operations and rehabilitation programs in ${ngo.location}.`,
        requirements: ['Veterinary background', 'Animal handling experience', 'Emergency response training'],
        duration: '4 months',
        stipend: '₹14,000/month',
        postedDate: new Date('2024-03-18'),
        deadline: '2024-04-28'
      },
      {
        _id: '2',
        title: 'Wildlife Conservation Intern',
        description: `Support ${ngo.name}'s wildlife conservation initiatives and habitat protection programs in ${ngo.location}.`,
        requirements: ['Zoology/Wildlife biology background', 'Conservation experience', 'Field research skills'],
        duration: '5 months',
        stipend: '₹18,000/month',
        postedDate: new Date('2024-03-14'),
        deadline: '2024-04-24'
      }
    ],
    'Human Rights': [
      {
        _id: '1',
        title: 'Legal Aid Intern',
        description: `Assist ${ngo.name}'s legal team in providing legal support to marginalized communities in ${ngo.location}.`,
        requirements: ['Law background', 'Human rights knowledge', 'Legal research skills'],
        duration: '6 months',
        stipend: '₹20,000/month',
        postedDate: new Date('2024-03-10'),
        deadline: '2024-04-20'
      },
      {
        _id: '2',
        title: 'Advocacy Campaign Coordinator',
        description: `Help develop and implement advocacy campaigns for human rights issues in ${ngo.location}.`,
        requirements: ['Public policy knowledge', 'Campaign management experience', 'Social media skills'],
        duration: '4 months',
        stipend: '₹16,000/month',
        postedDate: new Date('2024-03-15'),
        deadline: '2024-04-25'
      }
    ],
    'Disaster Relief': [
      {
        _id: '1',
        title: 'Emergency Response Coordinator',
        description: `Support ${ngo.name}'s disaster preparedness and response initiatives in ${ngo.location}.`,
        requirements: ['Emergency management background', 'First aid certification', 'Logistics experience'],
        duration: '3 months',
        stipend: '₹22,000/month',
        postedDate: new Date('2024-03-05'),
        deadline: '2024-04-15'
      },
      {
        _id: '2',
        title: 'Relief Distribution Specialist',
        description: `Coordinate relief material distribution and aid management for affected communities in ${ngo.location}.`,
        requirements: ['Supply chain management', 'Inventory control experience', 'Community outreach skills'],
        duration: '4 months',
        stipend: '₹18,000/month',
        postedDate: new Date('2024-03-12'),
        deadline: '2024-04-22'
      }
    ],
    'Community Development': [
      {
        _id: '1',
        title: 'Community Outreach Intern',
        description: `Work with ${ngo.name} to develop and implement community development programs in ${ngo.location}.`,
        requirements: ['Social work background', 'Community engagement experience', 'Program management skills'],
        duration: '5 months',
        stipend: '₹15,000/month',
        postedDate: new Date('2024-03-18'),
        deadline: '2024-04-28'
      },
      {
        _id: '2',
        title: 'Microfinance Program Coordinator',
        description: `Support ${ngo.name}'s microfinance initiatives for small entrepreneurs in ${ngo.location}.`,
        requirements: ['Finance/Economics background', 'Microfinance knowledge', 'Community development experience'],
        duration: '6 months',
        stipend: '₹20,000/month',
        postedDate: new Date('2024-03-14'),
        deadline: '2024-04-24'
      }
    ]
  };
  
  // Default internships if category doesn't match or is undefined
  const defaultInternships = [
    {
      _id: '1',
      title: `Program Development Intern at ${ngo.name}`,
      description: `Join ${ngo.name}'s team to help develop and implement various programs in ${ngo.location}.`,
      requirements: ['Relevant educational background', 'Good communication skills', 'Passion for social work'],
      duration: '4 months',
      stipend: '₹15,000/month',
      postedDate: new Date('2024-03-15'),
      deadline: '2024-04-25'
    },
    {
      _id: '2',
      title: `Social Media & Outreach Intern`,
      description: `Help ${ngo.name} expand its digital presence and community outreach in ${ngo.location}.`,
      requirements: ['Digital marketing skills', 'Content creation experience', 'Social media management'],
      duration: '3 months',
      stipend: '₹12,000/month',
      postedDate: new Date('2024-03-10'),
      deadline: '2024-04-20'
    }
  ];
  
  // Return category-specific internships or default ones
  return internshipsByCategory[ngo.category] || defaultInternships;
};

// We'll use a state variable for internships instead of a constant

const NGODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [ngo, setNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [sampleInternships, setSampleInternships] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'events', or 'internships'
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showLikeAnimation, setShowLikeAnimation] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch NGO details
        const ngoRes = await axios.get(`http://localhost:5001/api/ngos/${id}`);
        console.log('NGO Response:', ngoRes.data);

        if (!ngoRes.data || !ngoRes.data.success) {
          throw new Error('Failed to load NGO data');
        }

        const ngoData = ngoRes.data.data;
        setNGO(ngoData);

        // Generate NGO-specific internships based on category
        const internships = getNGOSpecificInternships(ngoData);
        console.log('Generated internships for NGO:', internships);

        // Fetch real posts for this NGO
        try {
          const postsRes = await axios.get(`http://localhost:5001/api/posts?ngo=${id}`);
          if (postsRes.data && postsRes.data.success && postsRes.data.data && postsRes.data.data.length > 0) {
            // If we have real posts, use them
            // Format the posts to match the expected structure
            const formattedPosts = postsRes.data.data.map(post => ({
              _id: post._id,
              title: post.title,
              content: post.description,
              image: post.photo,
              createdAt: post.createdAt || new Date(),
              likes: 0,
              comments: []
            }));
            // Only use one post per NGO
            setPosts([formattedPosts[0]]);
          } else {
            // If no real posts, use NGO-specific posts
            const ngoPosts = getNGOSpecificPosts(ngoData);
            console.log('Generated posts for NGO:', ngoPosts);
            setPosts(ngoPosts);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
          // If error, use NGO-specific posts
          const ngoPosts = getNGOSpecificPosts(ngoData);
          console.log('Generated posts for NGO (after error):', ngoPosts);
          setPosts(ngoPosts);
        }

        // Generate NGO-specific events
        const ngoEvents = getNGOSpecificEvents(ngoData);
        console.log('Generated events for NGO:', ngoEvents);
        setEvents(ngoEvents);

        // Set the internships
        setSampleInternships(internships);

        setLoading(false);
      } catch (err) {
        console.error('Error in fetchNGOData:', err);
        setError(err.response?.data?.error || 'Failed to load NGO data. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchNGOData();
    } else {
      setError('Invalid NGO ID');
      setLoading(false);
    }
  }, [id]);

  const handleDonate = () => {
    if (!user) {
      navigate('/login', { state: { from: `/donation/${id}` } });
      return;
    }
    navigate(`/donation/${id}`);
  };

  const handleVolunteer = () => {
    if (!user) {
      navigate('/login', { state: { from: `/volunteer/${id}` } });
      return;
    }
    navigate(`/volunteer/${id}`);
  };

  const handleLike = (postId) => {
    if (!user) {
      navigate('/login', { state: { from: `/ngo/${id}` } });
      return;
    }

    // Show heart animation
    setShowLikeAnimation(postId);
    setTimeout(() => setShowLikeAnimation(null), 1000);

    // Check if post is already liked
    const isCurrentlyLiked = likedPosts.has(postId);
    console.log(`Post ${postId} is ${isCurrentlyLiked ? 'liked' : 'not liked'}`);
    
    // Find the current post and its like count
    const currentPost = posts.find(post => post._id === postId);
    const currentLikes = currentPost ? currentPost.likes || 0 : 0;
    console.log(`Current likes: ${currentLikes}`);
    
    // Calculate new like count
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
    console.log(`New like count will be: ${newLikeCount}`);

    // Update post likes count immediately
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: newLikeCount
          };
        }
        return post;
      })
    );

    // Toggle liked state
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (isCurrentlyLiked) {
        newLikedPosts.delete(postId);
        console.log(`Removed post ${postId} from liked posts`);
      } else {
        newLikedPosts.add(postId);
        console.log(`Added post ${postId} to liked posts`);
      }
      return newLikedPosts;
    });
    
    // In a real app, you would send an API request here to update the like count on the server
    // Example:
    // try {
    //   await axios.post(`http://localhost:5001/api/posts/${postId}/like`, { 
    //     action: isCurrentlyLiked ? 'unlike' : 'like' 
    //   });
    // } catch (error) {
    //   console.error('Error updating like status:', error);
    // }
  };

  // Toggle expanded state for post content
  const toggleExpandPost = (postId) => {
    setExpandedPosts(prev => {
      const newExpandedPosts = new Set(prev);
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId);
      } else {
        newExpandedPosts.add(postId);
      }
      return newExpandedPosts;
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-success">Loading NGO details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading NGO Details</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-primary" 
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          NGO not found
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* CSS for heart animation */}
      <style>
        {`
          @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.3); }
            50% { transform: scale(1); }
            75% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {/* NGO Header with Enhanced Animations */}
      <div className="py-5" style={styles.header}>
        {/* Animated Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.4) 0%, rgba(78, 219, 244, 0.4) 100%)',
          animation: 'float 6s ease-in-out infinite, pulse 4s ease-in-out infinite',
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(78, 219, 244, 0.4) 0%, rgba(128, 244, 78, 0.4) 100%)',
          animation: 'float 8s ease-in-out infinite 1s, pulse 5s ease-in-out infinite 0.5s',
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.3) 0%, rgba(78, 219, 244, 0.3) 100%)',
          animation: 'float 7s ease-in-out infinite 0.5s',
          zIndex: 1
        }}></div>
        
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-2 text-center" style={{ animation: 'fadeInLeft 0.8s ease-out' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '2px solid rgba(128, 244, 78, 0.3)',
                  animation: 'pulse 2s infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: '2px solid rgba(78, 219, 244, 0.3)',
                  animation: 'pulse 2s infinite 0.5s'
                }}></div>
                <img
                  src={getSafeImageUrl(ngo.photo)}
                  alt={ngo.name}
                  style={{
                    ...styles.profileImage,
                    animation: 'float 6s ease-in-out infinite',
                    position: 'relative',
                    zIndex: 2
                  }}
                  onError={handleImageError}
                />
              </div>
            </div>
            <div className="col-md-7" style={{ animation: 'fadeInRight 0.8s ease-out' }}>
              <h1 className="mb-3 fw-bold" style={{ 
                background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                position: 'relative'
              }}>
                {ngo.name}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '0',
                  width: '60%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                  borderRadius: '2px',
                  animation: 'gradientShift 3s ease infinite'
                }}></div>
              </h1>
              <p className="lead mb-3" style={{ 
                color: '#0066CC',
                animation: 'fadeInUp 1s ease-out',
                fontStyle: 'italic',
                borderLeft: '3px solid rgba(128, 244, 78, 0.7)',
                paddingLeft: '10px'
              }}>"{ngo.slogan}"</p>
              <div className="mb-3">
                {/* Location with map marker icon */}
                <p className="mb-2" style={{ color: '#008080' }}>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {ngo.location}
                </p>
                
                {/* Website link with globe icon */}
                <p className="mb-2" style={{ color: '#0066CC' }}>
                  <i className="fas fa-globe me-2"></i>
                  <a href={ngo.website || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{ color: '#0066CC', textDecoration: 'none' }}
                     className="hover-underline">
                    {ngo.website || "www.careconnect.org"}
                  </a>
                </p>
                
                {/* Email with envelope icon */}
                <p className="mb-2" style={{ color: '#008080' }}>
                  <i className="fas fa-envelope me-2"></i>
                  <a href={`mailto:${ngo.email || "contact@careconnect.org"}`}
                     style={{ color: '#008080', textDecoration: 'none' }}
                     className="hover-underline">
                    {ngo.email || "contact@careconnect.org"}
                  </a>
                </p>
                
                {/* Social Media Links */}
                <div className="mt-3">
                  <a href={ngo.facebook || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#4267B2', fontSize: '1.5rem' }}
                     title="Facebook">
                    <i className="fab fa-facebook-square"></i>
                  </a>
                  <a href={ngo.twitter || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#1DA1F2', fontSize: '1.5rem' }}
                     title="Twitter">
                    <i className="fab fa-twitter-square"></i>
                  </a>
                  <a href={ngo.instagram || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="me-3"
                     style={{ color: '#E1306C', fontSize: '1.5rem' }}
                     title="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href={ngo.linkedin || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{ color: '#0077B5', fontSize: '1.5rem' }}
                     title="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3 text-end">
              <button 
                className="btn me-2" 
                onClick={handleDonate}
                style={{
                  background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                  color: 'white',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 102, 204, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-heart me-2"></i>
                Donate
              </button>
              <button 
                className="btn" 
                onClick={handleVolunteer}
                style={{
                  color: '#0066CC',
                  border: '2px solid rgba(0, 128, 128, 0.5)',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
              >
                <i className="fas fa-hands-helping me-2"></i>
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="row">
          {/* Left Column - Feed */}
          <div className="col-md-8">
            {/* Updated Tab Navigation */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                  style={activeTab === 'posts' ? styles.tabActive : {}}
                >
                  <i className="fas fa-images me-2"></i>
                  Posts
                </button>
              </li>
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                  style={activeTab === 'events' ? styles.tabActive : {}}
                >
                  <i className="fas fa-calendar-alt me-2"></i>
                  Events
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'internships' ? 'active' : ''}`}
                  onClick={() => setActiveTab('internships')}
                  style={activeTab === 'internships' ? styles.tabActive : {}}
                >
                  <i className="fas fa-briefcase me-2"></i>
                  Internships
                </button>
              </li>
            </ul>

            {/* Enhanced Posts Feed with heart animation and read more functionality */}
            {activeTab === 'posts' && (
              <div className="posts-feed">
                {posts.map((post) => (
                  <div key={post._id} className="card mb-4" style={styles.card}>
                    <div className="card-header bg-white d-flex align-items-center">
                      <img
                        src={getSafeImageUrl(ngo.photo)}
                        alt={ngo.name}
                        className="rounded-circle me-3"
                        style={{ width: '45px', height: '45px', objectFit: 'cover', border: '2px solid rgba(0, 128, 128, 0.2)' }}
                      />
                      <div>
                        <h6 className="mb-0" style={{ color: '#008080' }}>{ngo.name}</h6>
                        <small className="text-muted">
                          <i className="far fa-clock me-1"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="position-relative">
                      <img
                        src={getSafeImageUrl(post.image)}
                        className="card-img-top"
                        alt={post.title}
                        style={styles.postImage}
                        onDoubleClick={() => handleLike(post._id)}
                      />
                      {/* Large heart animation when double-clicking the image */}
                      {showLikeAnimation === post._id && (
                        <div className="position-absolute top-50 start-50 translate-middle heart-animation">
                          <i className="fas fa-heart" 
                             style={{ 
                               fontSize: '6rem', 
                               color: '#E91E63',
                               opacity: 0.9, 
                               filter: 'drop-shadow(0 0 15px white)',
                               animation: 'heartPulse 1s ease-in-out'
                             }}></i>
                        </div>
                      )}
                      
                      <style jsx="true">{`
                        @keyframes heartPulse {
                          0% { transform: scale(0); opacity: 0; }
                          25% { transform: scale(1.1); opacity: 0.9; }
                          50% { transform: scale(1.2); opacity: 1; }
                          75% { transform: scale(1.1); opacity: 0.9; }
                          100% { transform: scale(1); opacity: 0; }
                        }
                        
                        @keyframes heartBeat {
                          0% { transform: scale(1); }
                          25% { transform: scale(1.4); }
                          50% { transform: scale(1); }
                          75% { transform: scale(1.4); }
                          100% { transform: scale(1); }
                        }
                        
                        .heart-animation {
                          z-index: 10;
                        }
                        
                        .hover-underline {
                          position: relative;
                          transition: all 0.3s ease;
                        }
                        
                        .hover-underline:hover {
                          opacity: 0.8;
                        }
                        
                        .hover-underline::after {
                          content: '';
                          position: absolute;
                          width: 0;
                          height: 1px;
                          bottom: -2px;
                          left: 0;
                          background-color: currentColor;
                          transition: width 0.3s ease;
                        }
                        
                        .hover-underline:hover::after {
                          width: 100%;
                        }
                      `}</style>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* Heart Like Button */}
                        <button 
                          className="btn p-0 me-3"
                          onClick={() => handleLike(post._id)}
                          style={{ 
                            transition: 'all 0.3s ease',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none'
                          }}
                          aria-label="Like post"
                        >
                          <i className={`${likedPosts.has(post._id) ? 'fas' : 'far'} fa-heart`} 
                             style={{ 
                               fontSize: '2.5rem', 
                               color: likedPosts.has(post._id) ? '#E91E63' : '#6c757d',
                               filter: likedPosts.has(post._id) ? 'drop-shadow(0 0 5px rgba(233, 30, 99, 0.5))' : 'none',
                               animation: showLikeAnimation === post._id ? 'heartBeat 1s' : 'none',
                               transform: likedPosts.has(post._id) ? 'scale(1.1)' : 'scale(1)',
                               transition: 'all 0.3s ease'
                             }}></i>
                        </button>
                        
                        {/* Like Count Display */}
                        <span className="me-3" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6c757d' }}>
                          {post.likes || 0}
                        </span>
                        
                        {/* Comment Button */}
                        <button className="btn p-0 me-3" 
                          style={{ background: 'transparent', border: 'none' }}
                          aria-label="Comment">
                          <i className="far fa-comment" 
                             style={{ 
                               fontSize: '2.2rem', 
                               color: '#6c757d' 
                             }}></i>
                        </button>
                        
                        {/* Share Button */}
                        <button className="btn p-0" 
                          style={{ background: 'transparent', border: 'none' }}
                          aria-label="Share">
                          <i className="far fa-paper-plane" 
                             style={{ 
                               fontSize: '2.2rem', 
                               color: '#6c757d' 
                             }}></i>
                        </button>
                      </div>
                      
                      {/* Like Count */}
                      <p className="mb-2">
                        <strong className="me-2" style={{ color: '#0066CC', fontSize: '1.1rem' }}>
                          <i className="fas fa-heart me-1" style={{ color: '#E91E63' }}></i>
                          {post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}
                        </strong>
                      </p>
                      <h5 className="card-title mb-2" style={{ color: '#008080' }}>{post.title}</h5>
                      
                      {/* Post content with read more functionality */}
                      {post.content.length > 150 && !expandedPosts.has(post._id) ? (
                        <div>
                          <p className="card-text">{post.content.substring(0, 150)}...</p>
                          <button 
                            className="btn btn-link p-0 text-primary" 
                            onClick={() => toggleExpandPost(post._id)}
                            style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                          >
                            Read more
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="card-text">{post.content}</p>
                          {post.content.length > 150 && (
                            <button 
                              className="btn btn-link p-0 text-primary" 
                              onClick={() => toggleExpandPost(post._id)}
                              style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Comment count */}
                      {post.comments && post.comments.length > 0 && (
                        <button 
                          className="btn btn-link p-0 text-muted mt-2 d-block" 
                          style={{ fontSize: '0.9rem' }}
                        >
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Internships Feed with Enhanced Animations */}
            {activeTab === 'internships' && (
              <div className="internships-feed">
                {sampleInternships.map((internship, index) => (
                  <div 
                    key={internship._id} 
                    className="card mb-4" 
                    style={{
                      ...styles.card,
                      animation: `fadeInUp 0.6s ease-out ${0.1 * index}s`,
                      animationFillMode: 'both',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 255, 240, 0.95) 100%)',
                      borderLeft: '4px solid #80f44e',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 128, 128, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.1)';
                    }}
                  >
                    <div className="card-body">
                      {/* Internship title with NGO name */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}>
                        <h5 className="card-title mb-0" style={{ 
                          background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'inline-block',
                          fontWeight: 'bold',
                          animation: 'fadeInLeft 0.8s ease-out'
                        }}>{internship.title}</h5>
                        <span style={{
                          background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.9) 0%, rgba(78, 219, 244, 0.9) 100%)',
                          padding: '5px 15px',
                          borderRadius: '20px',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          animation: 'pulse 2s infinite'
                        }}>
                          {ngo.name}
                        </span>
                      </div>
                      
                      <p className="card-text" style={{ animation: 'fadeInUp 0.9s ease-out' }}>
                        {internship.description}
                      </p>
                      
                      <div className="mb-3" style={{ animation: 'fadeInUp 1s ease-out' }}>
                        <h6 style={{ 
                          color: '#008080',
                          fontWeight: 'bold',
                          borderBottom: '2px solid rgba(128, 244, 78, 0.3)',
                          paddingBottom: '5px',
                          display: 'inline-block'
                        }}>Requirements:</h6>
                        <ul className="list-unstyled mt-2">
                          {internship.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="mb-2" style={{
                              animation: `fadeInLeft ${0.8 + (reqIndex * 0.1)}s ease-out`,
                              animationFillMode: 'both',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <i className="fas fa-check-circle me-2" style={{ 
                                color: '#80f44e',
                                animation: `pulse 2s infinite ${reqIndex * 0.2}s`
                              }}></i>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="row mb-3" style={{ animation: 'fadeInUp 1.1s ease-out' }}>
                        <div className="col-md-6">
                          <p className="mb-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            background: 'rgba(128, 244, 78, 0.1)'
                          }}>
                            <i className="fas fa-clock me-2" style={{ 
                              color: '#4edbf4',
                              animation: 'pulse 2s infinite'
                            }}></i>
                            <strong>Duration:</strong> <span className="ms-1">{internship.duration}</span>
                          </p>
                          <p className="mb-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            background: 'rgba(78, 219, 244, 0.1)'
                          }}>
                            <i className="fas fa-money-bill-wave me-2" style={{ 
                              color: '#80f44e',
                              animation: 'pulse 2s infinite 0.3s'
                            }}></i>
                            <strong>Stipend:</strong> <span className="ms-1">{internship.stipend}</span>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            background: 'rgba(128, 244, 78, 0.1)'
                          }}>
                            <i className="fas fa-map-marker-alt me-2" style={{ 
                              color: '#4edbf4',
                              animation: 'pulse 2s infinite 0.6s'
                            }}></i>
                            <strong>Location:</strong> <span className="ms-1">{ngo.location}</span>
                          </p>
                          <p className="mb-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            background: 'rgba(78, 219, 244, 0.1)'
                          }}>
                            <i className="fas fa-calendar-times me-2" style={{ 
                              color: '#80f44e',
                              animation: 'pulse 2s infinite 0.9s'
                            }}></i>
                            <strong>Deadline:</strong> <span className="ms-1">{new Date(internship.deadline).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        className="btn w-100"
                        style={{
                          ...styles.buttonPrimary,
                          animation: 'fadeInUp 1.2s ease-out',
                          position: 'relative',
                          overflow: 'hidden',
                          marginTop: '10px'
                        }}
                      >
                        {/* Shine effect */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                          transform: 'translateX(-100%)',
                          animation: 'shine 3s infinite'
                        }}></div>
                        <i className="fas fa-paper-plane me-2"></i>
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Events Feed with Enhanced Animations */}
            {activeTab === 'events' && (
              <div className="events-feed">
                {events.map((event, index) => (
                  <div 
                    key={event._id} 
                    className="card mb-4" 
                    style={{
                      ...styles.eventCard,
                      animation: `fadeInUp 0.6s ease-out ${0.1 * index}s`,
                      animationFillMode: 'both',
                      transform: 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    {/* Category-based image with NGO name overlay */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={getCategoryImage(ngo.category)}
                        className="card-img-top"
                        alt={event.title}
                        style={{ 
                          maxHeight: '300px', 
                          objectFit: 'cover',
                          transition: 'all 0.5s ease',
                          transform: 'scale(1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '20px'
                      }}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(128, 244, 78, 0.9) 0%, rgba(78, 219, 244, 0.9) 100%)',
                          padding: '5px 15px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          alignSelf: 'flex-start',
                          marginBottom: '10px',
                          animation: 'pulse 2s infinite'
                        }}>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {ngo.category}
                          </span>
                        </div>
                        <h3 style={{ 
                          color: 'white', 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          animation: 'fadeInUp 0.8s ease-out'
                        }}>
                          {ngo.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="card-body" style={{ animation: 'fadeInUp 1s ease-out' }}>
                      <h5 className="card-title" style={{ 
                        background: 'linear-gradient(90deg, #80f44e, #4edbf4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        fontWeight: 'bold'
                      }}>{event.title}</h5>
                      <p className="card-text">{event.description}</p>
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <p className="mb-2" style={{ animation: 'fadeInLeft 0.8s ease-out' }}>
                            <i className="far fa-calendar me-2" style={{
                              ...styles.icon,
                              animation: 'pulse 2s infinite'
                            }}></i>
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="mb-2" style={{ animation: 'fadeInLeft 1s ease-out' }}>
                            <i className="far fa-clock me-2" style={{
                              ...styles.icon,
                              animation: 'pulse 2s infinite 0.3s'
                            }}></i>
                            {event.time}
                          </p>
                          <p className="mb-0" style={{ animation: 'fadeInLeft 1.2s ease-out' }}>
                            <i className="fas fa-map-marker-alt me-2" style={{
                              ...styles.icon,
                              animation: 'pulse 2s infinite 0.6s'
                            }}></i>
                            {/* Use NGO location instead of event location */}
                            {ngo.location}
                          </p>
                        </div>
                        <button 
                          className="btn btn-success"
                          style={{
                            ...styles.buttonPrimary,
                            animation: 'fadeInRight 1s ease-out',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Shine effect */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                            transform: 'translateX(-100%)',
                            animation: 'shine 3s infinite'
                          }}></div>
                          <i className="fas fa-user-plus me-2"></i>
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="col-md-4">
            {/* About Card */}
            <div className="card mb-4" style={styles.card}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#008080' }}>
                  <i className="fas fa-info-circle me-2"></i>
                  About
                </h5>
                <p className="card-text">{ngo.description}</p>
                <hr style={{ borderColor: 'rgba(0, 128, 128, 0.1)' }} />
                <p className="mb-3">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-calendar-alt me-2"></i>
                    Established:
                  </strong> {ngo.yearEstablished || '2020'}
                </p>
                <p className="mb-3">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-tag me-2"></i>
                    Category:
                  </strong> {ngo.category}
                </p>
                <p className="mb-0">
                  <strong style={{ color: '#008080' }}>
                    <i className="fas fa-users me-2"></i>
                    Volunteers:
                  </strong> {ngo.volunteerCount}
                </p>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="card mb-4" style={styles.card}>
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: '#0066CC' }}>
                  <i className="fas fa-address-card me-2"></i>
                  Contact Information
                </h5>
                
                <p className="mb-3">
                  <i className="fas fa-phone-alt me-2" style={{ color: '#0066CC' }}></i>
                  <a href={`tel:${ngo.phone || "+1234567890"}`} 
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.phone || "+1 (234) 567-890"}
                  </a>
                </p>
                
                <p className="mb-3">
                  <i className="fas fa-envelope me-2" style={{ color: '#0066CC' }}></i>
                  <a href={`mailto:${ngo.email || "contact@careconnect.org"}`}
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.email || "contact@careconnect.org"}
                  </a>
                </p>
                
                <p className="mb-3">
                  <i className="fas fa-globe me-2" style={{ color: '#0066CC' }}></i>
                  <a href={ngo.website || "#"} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hover-underline"
                     style={{ color: '#0066CC', textDecoration: 'none' }}>
                    {ngo.website || "www.careconnect.org"}
                  </a>
                </p>
                
                <p className="mb-4">
                  <i className="fas fa-map-marker-alt me-2" style={{ color: '#0066CC' }}></i>
                  {ngo.location}
                </p>
                
                {/* Map Link */}
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(ngo.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100"
                  style={{
                    background: 'linear-gradient(135deg, #008080 0%, #0066CC 100%)',
                    color: 'white',
                    borderRadius: '25px'
                  }}
                >
                  <i className="fas fa-map-marked-alt me-2"></i>
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODetail; 