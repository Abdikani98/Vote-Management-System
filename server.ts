import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), 'data.json');

// Initial Data
const getInitialData = () => {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
    return {
        students: {},
        candidates: [
            { id: 'c1', name: 'Cabdi Nuur', teamName: 'Hormar Team', voteCount: 0, imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
            { id: 'c2', name: 'Zahra Cali', teamName: 'Guul Team', voteCount: 0, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
            { id: 'c3', name: 'Maxamed Axmed', teamName: 'Midnimo Team', voteCount: 0, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }
        ]
    };
};

let dbData = getInitialData();

const saveData = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2));
};

// Admin Credentials (In a real app, use environment variables)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// API Routes
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Username ama Password waa khalad' });
    }
});

app.get('/api/candidates', (req, res) => {
    res.json(dbData.candidates);
});

app.get('/api/admin/students', (req, res) => {
    res.json(Object.values(dbData.students));
});

app.delete('/api/admin/students/:email', (req, res) => {
    const email = req.params.email.toLowerCase().trim();
    const student = dbData.students[email];

    if (!student) {
        return res.status(404).json({ error: 'Ardayga lama helin' });
    }

    // If the student voted, decrease the candidate's vote count
    if (student.hasVoted && student.votedFor) {
        const candidate = dbData.candidates.find((c: any) => c.id === student.votedFor);
        if (candidate && candidate.voteCount > 0) {
            candidate.voteCount -= 1;
        }
    }

    delete dbData.students[email];
    saveData();
    res.json({ success: true, students: Object.values(dbData.students), candidates: dbData.candidates });
});

app.post('/api/register', (req, res) => {
    const { fullName, email, semester } = req.body;
    if (!fullName || !email || !semester) {
        return res.status(400).json({ error: 'Fadlan buuxi dhamaan meelaha banaan' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    if (dbData.students[normalizedEmail]) {
        return res.json({ student: dbData.students[normalizedEmail], status: 'registered' });
    }

    const newStudent = {
        fullName,
        email: normalizedEmail,
        semester,
        registeredAt: new Date().toISOString(),
        hasVoted: false
    };

    dbData.students[normalizedEmail] = newStudent;
    saveData();
    res.json({ student: newStudent, status: 'new' });
});

app.post('/api/vote', (req, res) => {
    const { email, candidateId } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const student = dbData.students[normalizedEmail];

    if (!student) return res.status(404).json({ error: 'Ardayga lama helin' });
    if (student.hasVoted) return res.status(400).json({ error: 'Hore ayaad u soo codeysay!' });

    const candidate = dbData.candidates.find(c => c.id === candidateId);
    if (!candidate) return res.status(404).json({ error: 'Murashaxa lama helin' });

    candidate.voteCount += 1;
    student.hasVoted = true;
    student.votedFor = candidateId;
    
    saveData();
    res.json({ success: true, candidates: dbData.candidates });
});

async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(3000, '0.0.0.0', () => {
        console.log('Server is running on port 3000');
    });
}

startServer();
