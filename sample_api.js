require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://www.desotobitsandbytes.com',
            'https://desotobitsandbytes.com',
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-Cache-Control'
    ]
};

const app = express();



// Trust Vercel proxy
app.set('trust proxy', 1);

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

const verifyTurnstileToken = async (token, ip) => {
  if (!token) {
    return { success: false, errors: ['missing-input-response'] };
  }

  const params = new URLSearchParams();
  params.append('secret', TURNSTILE_SECRET_KEY);
  params.append('response', token);
  if (ip) params.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) throw new Error(`Turnstile verify failed (${response.status})`);
  return response.json();
};

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false, 
});

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.json({message: 'Hello from the DBB Server :)'})
})



app.post('/validateTurnstile', async (req, res) => {
  try {
    const { token } = req.body;
    const verification = await verifyTurnstileToken(token, req.ip);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        errors: verification['error-codes'] || ['unknown-error']
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Turnstile validation error:', error);
    res.status(500).json({ success: false, message: 'Validation failed' });
  }
});

app.post('/sendMessage', limiter, async (req, res) => {
    try {
        const data = req.body;
        console.log('turn stile token: ', data.turnstileToken)
        const verification = await verifyTurnstileToken(data.turnstileToken, req.ip);
        console.log('verification response from verifyTurnstileToken function: ', verification)
        if (!verification.success) {
        return res.status(400).json({
            success: false,
            message: 'Security validation failed',
            errors: verification['error-codes'] || []
        });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
                user: "erickcrowne85@gmail.com",
                pass: process.env.PASSWORD,
            },
        });

        // Format email content properly
        const emailContent = `
            Name: ${data.name || 'Not provided'}
            Email: ${data.email || 'Not provided'}
            Message: ${data.message || 'Not provided'}
        `;

        const info = await transporter.sendMail({
            from: '"Desoto Bits and Bytes" <admin@desotobitsandbytes.com>',
            to: "admin@desotobitsandbytes.com",
            subject: "You Have a new message!",
            text: emailContent,
            replyTo: data.email || undefined,
        });

        if (info.accepted.length > 0) {
            res.status(200).json({ success: true, message: 'Email sent!' });
        } else {
            res.status(500).json({ success: false, message: "Email failed!" });
        }
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: "Email failed!", error: error.message });
    }
});

// POST a new customer review
app.post('/reviews', async (req, res) => {
    try {
        const { name, service, rating, review } = req.body;

        if (!name || !service || !rating || !review) {
            return res.status(400).json({ success: false, message: 'name, service, rating, and review are required.' });
        }

        const parsedRating = parseInt(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
        }

        const docRef = await db.collection('customerReviews').add({
            name,
            date: new Date(),
            reviewed: false,
            service,
            rating: parsedRating,
            review,
        });

        res.status(201).json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: 'Failed to create review.' });
    }
});

// GET all customer reviews
app.get('/reviews', async (req, res) => {
    try {
        const snapshot = await db.collection('customerReviews').orderBy('date', 'desc').get();
        const reviews = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                service: data.service,
                rating: data.rating || 5,
                review: data.review,
                date: data.date.toDate ? data.date.toDate().toISOString() : data.date,
                reviewed: data.reviewed,
            };
        });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
    }
});

// Export for Vercel serverless function
app.listen(3000, (e) => {
    if(e) {throw new Error(e.message)}
    else {console.log('Server is running on Port 3000')}
});
