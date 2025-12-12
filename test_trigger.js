// test_trigger.js
async function triggerCreate() {
  const url = 'http://localhost:5001/org/create';
  
  const payload = {
    organization_name: "test_company5",
    email: "admin@test.com",
    password: "password123"
  };

  console.log(`Sending POST request to ${url}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('------------------------------------------------');
    console.log(`Status Code: ${response.status}`);
    console.log('Response Body:', JSON.stringify(data, null, 2));
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Network or Server Error:', error.message);
  }
}

triggerCreate();