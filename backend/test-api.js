// API Testing Script for Yearbook Backend
// Run with: node test-api.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (authToken && !options.skipAuth) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { response: null, data: null };
  }
}

async function testAuth() {
  console.log('\n🔐 Testing Authentication...');

  // Register admin user
  console.log('1. Registering admin user...');
  const registerResult = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@test.com',
      password: 'password123',
      fullName: 'Admin User',
      role: 'admin'
    }),
    skipAuth: true
  });

  if (registerResult.response?.ok) {
    console.log('✅ Admin registration successful');
    authToken = registerResult.data.token;
  } else {
    console.log('❌ Admin registration failed:', registerResult.data?.message);
  }

  // Register regular user
  console.log('2. Registering regular user...');
  const userRegister = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'user@test.com',
      password: 'password123',
      fullName: 'Regular User'
    }),
    skipAuth: true
  });

  if (userRegister.response?.ok) {
    console.log('✅ User registration successful');
  } else {
    console.log('❌ User registration failed:', userRegister.data?.message);
  }

  // Login
  console.log('3. Testing login...');
  const loginResult = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@test.com',
      password: 'password123'
    }),
    skipAuth: true
  });

  if (loginResult.response?.ok) {
    console.log('✅ Login successful');
    authToken = loginResult.data.token;
  } else {
    console.log('❌ Login failed:', loginResult.data?.message);
  }

  // Get current user
  console.log('4. Getting current user...');
  const meResult = await makeRequest('/auth/me');
  if (meResult.response?.ok) {
    console.log('✅ Get current user successful');
  } else {
    console.log('❌ Get current user failed:', meResult.data?.message);
  }
}

async function testProfiles() {
  console.log('\n👤 Testing Profile Management...');

  // Get profiles
  console.log('1. Getting all profiles...');
  const profilesResult = await makeRequest('/profiles');
  if (profilesResult.response?.ok) {
    console.log(`✅ Retrieved ${profilesResult.data.length} profiles`);
  } else {
    console.log('❌ Get profiles failed:', profilesResult.data?.message);
  }

  // Update profile
  console.log('2. Updating profile...');
  const updateResult = await makeRequest('/profiles/me', {
    method: 'PUT',
    body: JSON.stringify({
      bio: 'Updated bio from API test',
      location: 'Test City'
    })
  });

  if (updateResult.response?.ok) {
    console.log('✅ Profile update successful');
  } else {
    console.log('❌ Profile update failed:', updateResult.data?.message);
  }
}

async function testEvents() {
  console.log('\n📅 Testing Events...');

  // Create event
  console.log('1. Creating event...');
  const eventResult = await makeRequest('/events', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Reunion Event',
      description: 'A test event for API testing',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Venue',
      eventType: 'reunion'
    })
  });

  let eventId = null;
  if (eventResult.response?.ok) {
    console.log('✅ Event creation successful');
    eventId = eventResult.data._id;
  } else {
    console.log('❌ Event creation failed:', eventResult.data?.message);
  }

  // Get events
  console.log('2. Getting events...');
  const eventsResult = await makeRequest('/events');
  if (eventsResult.response?.ok) {
    console.log(`✅ Retrieved ${eventsResult.data.length} events`);
  } else {
    console.log('❌ Get events failed:', eventsResult.data?.message);
  }

  // RSVP to event
  if (eventId) {
    console.log('3. RSVPing to event...');
    const rsvpResult = await makeRequest(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status: 'attending' })
    });

    if (rsvpResult.response?.ok) {
      console.log('✅ RSVP successful');
    } else {
      console.log('❌ RSVP failed:', rsvpResult.data?.message);
    }
  }
}

async function testJobs() {
  console.log('\n💼 Testing Jobs...');

  // Create job
  console.log('1. Creating job...');
  const jobResult = await makeRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Software Engineer',
      company: 'Test Company',
      description: 'A test job posting',
      location: 'Remote',
      jobType: 'full-time',
      domain: 'Technology',
      applyUrl: 'https://example.com/apply'
    })
  });

  if (jobResult.response?.ok) {
    console.log('✅ Job creation successful');
  } else {
    console.log('❌ Job creation failed:', jobResult.data?.message);
  }

  // Get jobs
  console.log('2. Getting jobs...');
  const jobsResult = await makeRequest('/jobs');
  if (jobsResult.response?.ok) {
    console.log(`✅ Retrieved ${jobsResult.data.length} jobs`);
  } else {
    console.log('❌ Get jobs failed:', jobsResult.data?.message);
  }
}

async function testStories() {
  console.log('\n📖 Testing Stories...');

  // Create story
  console.log('1. Creating story...');
  const storyResult = await makeRequest('/stories', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Story',
      content: 'This is a test story content with enough characters to pass validation.',
      excerpt: 'A test story excerpt',
      tags: ['test', 'api']
    })
  });

  if (storyResult.response?.ok) {
    console.log('✅ Story creation successful');
  } else {
    console.log('❌ Story creation failed:', storyResult.data?.message);
  }

  // Get stories
  console.log('2. Getting stories...');
  const storiesResult = await makeRequest('/stories');
  if (storiesResult.response?.ok) {
    console.log(`✅ Retrieved ${storiesResult.data.length} stories`);
  } else {
    console.log('❌ Get stories failed:', storiesResult.data?.message);
  }
}

async function testStats() {
  console.log('\n📊 Testing Statistics...');

  const statsResult = await makeRequest('/stats');
  if (statsResult.response?.ok) {
    console.log('✅ Platform stats retrieved:', statsResult.data);
  } else {
    console.log('❌ Get stats failed:', statsResult.data?.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Yearbook Backend API Tests...');
  console.log('Base URL:', BASE_URL);

  try {
    await testAuth();
    await testProfiles();
    await testEvents();
    await testJobs();
    await testStories();
    await testStats();

    console.log('\n🎉 API Testing Complete!');
    console.log('Check the results above for any failed tests.');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, makeRequest };