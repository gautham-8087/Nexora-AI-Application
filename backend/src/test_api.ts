// Native global fetch is used (Node 18+)

async function testFullSuite() {
  const baseUrl = 'http://localhost:5001/api';
  console.log('=== STARTING NEXORA FULL SUITE TEST ===');

  try {
    // 1. Auth Register Test
    console.log('\n--- 1. Testing Register Endpoint ---');
    const registerPayload = {
      name: 'Test Engineer',
      email: `test_${Date.now()}@nexora.ai`,
      password: 'mypassword123'
    };
    
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    
    if (!regRes.ok) {
      throw new Error(`Register failed with status ${regRes.status}: ${await regRes.text()}`);
    }
    
    const regData: any = await regRes.json();
    console.log('Register Success:', regData.message);
    console.log('User Profile:', JSON.stringify(regData.user));
    const token = regData.token;
    console.log('Token Received:', token);

    // 2. Auth Login Test
    console.log('\n--- 2. Testing Login Endpoint ---');
    const loginPayload = {
      email: registerPayload.email,
      password: registerPayload.password
    };
    
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    
    const loginData: any = await loginRes.json();
    console.log('Login Success:', loginData.message);

    // 3. Auth Me Profile Test
    console.log('\n--- 3. Testing Auth Profile Verification ---');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!meRes.ok) {
      throw new Error(`Me profile verification failed with status ${meRes.status}`);
    }
    
    const meData: any = await meRes.json();
    console.log('Me Verification Profile:', JSON.stringify(meData));

    // 4. Initial Search Thread Creation
    console.log('\n--- 4. Creating Search Thread ---');
    const searchRes = await fetch(`${baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is deep learning?' })
    });
    
    if (!searchRes.ok) {
      throw new Error(`Initial search failed with status ${searchRes.status}`);
    }
    
    const threadData: any = await searchRes.json();
    console.log('Thread Created ID:', threadData.id);
    console.log('Total Messages:', threadData.messages.length);
    console.log('Current Active Path Index:', threadData.activePathIndex);
    console.log('Total Branch Paths:', threadData.paths?.length);

    const threadId = threadData.id;

    // 5. Prompt Branching (Edit message at index 0)
    console.log('\n--- 5. Testing Conversational Prompt Branching ---');
    const branchRes = await fetch(`${baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What is deep learning and neural networks?',
        threadId: threadId,
        editMessageIndex: 0
      })
    });
    
    if (!branchRes.ok) {
      throw new Error(`Prompt branching failed with status ${branchRes.status}`);
    }
    
    const branchedThread: any = await branchRes.json();
    console.log('Branched Thread Messages Count:', branchedThread.messages.length);
    console.log('New Active Path Index:', branchedThread.activePathIndex);
    console.log('Total Paths in Thread:', branchedThread.paths?.length);
    console.log('Latest Active Query:', branchedThread.messages[0].text);

    // 6. Path Branch Toggling
    console.log('\n--- 6. Testing Switch Active Path Branch ---');
    const switchRes = await fetch(`${baseUrl}/search/switch-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: threadId,
        pathIndex: 0
      })
    });
    
    if (!switchRes.ok) {
      throw new Error(`Switch path failed with status ${switchRes.status}`);
    }
    
    const switchedThread: any = await switchRes.json();
    console.log('Switched Active Path Index:', switchedThread.activePathIndex);
    console.log('Active Path Query (should revert to original):', switchedThread.messages[0].text);

    console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY ===');
  } catch (err: any) {
    console.error('Test suite failed:', err.message);
  }
}

testFullSuite();
