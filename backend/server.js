const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const db = new sqlite3.Database('./db.sqlite');

// LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Niepoprawne dane logowania' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Niepoprawne hasło' });

    res.json({ success: true, user: { username: user.username, role: user.role, points: user.points } });
  });
});

// GET TASKS
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CLAIM TASK
app.post('/api/claim', (req, res) => {
  const { username, taskId } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err2, task) => {
      if (!task) return res.status(404).json({ error: 'Zadanie nie istnieje' });

      const newPoints = user.points + task.points;
      db.run('UPDATE users SET points = ? WHERE username = ?', [newPoints, username]);
      res.json({ success: true, newPoints });
    });
  });
});

// ADD TASK (ADMIN)
app.post('/api/add-task', (req, res) => {
  const { title, description, points, type } = req.body;
  db.run('INSERT INTO tasks (title, description, points, type) VALUES (?, ?, ?, ?)',
    [title, description, points, type],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// USERS LIST (ADMIN)
app.get('/api/users', (req, res) => {
  db.all('SELECT username, role, points FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CATCH-ALL FRONTEND
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(4000, () => console.log('✅ API działa na porcie 4000'));
