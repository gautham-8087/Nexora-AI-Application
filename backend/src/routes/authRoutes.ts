import { Router, Request, Response } from 'express';

const router = Router();

// In-memory user database
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Dev simplicity: plaintext comparison
  createdAt: Date;
}

const usersStore: UserRecord[] = [
  // Default seed user
  {
    id: 'usr_gautham_123',
    name: 'Gautham Research',
    email: 'gautham@nexora.ai',
    passwordHash: 'password123',
    createdAt: new Date()
  }
];

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const emailLower = email.trim().toLowerCase();
    const existing = usersStore.find(u => u.email === emailLower);
    if (existing) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: emailLower,
      passwordHash: password, // Store password
      createdAt: new Date()
    };

    usersStore.push(newUser);
    console.log(`Nexora Auth: Registered user ${newUser.name} (${newUser.email})`);

    const mockToken = `mock-token-${newUser.id}`;
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token: mockToken
    });
  } catch (error: any) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailLower = email.trim().toLowerCase();
    const user = usersStore.find(u => u.email === emailLower);

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log(`Nexora Auth: Logged in user ${user.name}`);
    const mockToken = `mock-token-${user.id}`;
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: mockToken
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Failed to sign in.' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const userId = token.replace('mock-token-', '');
    const user = usersStore.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired authorization token.' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: any) {
    console.error('Auth verify error:', error.message);
    return res.status(500).json({ error: 'Failed to verify user profile.' });
  }
});

export default router;
