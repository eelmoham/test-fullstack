const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    
const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    post TEXT
  )
`);

const secretKey = 'mrx-is-here';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
};

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    console.log({ email, username, password });

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword], function (err) {
        if (err) {
            console.error('Error creating user:', err.message);
            return res.status(500).json({ message: 'Error creating user' });
        }

        const userId = this.lastID;

        // Create and sign a JWT
        const token = jwt.sign({ id: userId, username: username }, 'mrx-is-here', {
            expiresIn: '2h',
        });

        // Set the token as a cookie
        res.cookie('jwt', token, { httpOnly: true });

        console.log(`User ${username} created successfully with ID ${userId}`);
        res.status(201).json({ message: 'User created and logged in successfully' });
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error querying database' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'mrx-is-here', {
            expiresIn: '2h',
        });

        res.cookie('jwt', token, { httpOnly: true });

        console.log(`User ${username} logged in successfully`);
        res.json({ message: 'Login successful' });
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful' });
});

app.get('/profile', verifyToken, (req, res) => {
    const userId = req.userId;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error querying database' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userWithoutPassword = { id: user.id, username: user.username };
        res.json({ user: userWithoutPassword });
    });
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'mrx-is-here', (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err.message);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        console.log('Token decoded:', decoded);

        req.decoded = decoded; // Ensure that req.decoded is being set correctly

        next();
    });
};

// API endpoint to create a new post
app.post('/create-post', authenticateToken, (req, res) => {
    const { post } = req.body;

    if (!post) {
        return res.status(400).json({ message: 'Post content is required' });
    }

    const username = req.decoded.username; // Extract username from the decoded token

    db.run('INSERT INTO posts (username, post) VALUES (?, ?)', [username, post], function (err) {
        if (err) {
            console.error('Error creating post:', err.message);
            return res.status(500).json({ message: 'Error creating post' });
        }

        const postId = this.lastID;

        console.log(`Post created successfully with ID ${postId}`);

        // Fetch all posts after creating a new post
        db.all('SELECT * FROM posts', (err, posts) => {
            if (err) {
                console.error('Error getting posts:', err.message);
                return res.status(500).json({ message: 'Error getting posts' });
            }

            console.log('All Posts:', posts);

            res.status(201).json({ message: 'Post created successfully', postId, allPosts: posts });
        });
    });
});

app.get('/posts', authenticateToken,  (req, res) => {
    db.all('SELECT * FROM posts', (err, posts) => {
        if (err) {
            console.error('Error getting posts:', err.message);
            return res.status(500).json({ message: 'Error getting posts' });
        }

        console.log('All Posts:', posts);

        res.json({ posts });
    });
}
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
