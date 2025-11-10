const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./db.sqlite');

const initSql = `
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tasks;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  role TEXT,
  points INTEGER DEFAULT 0
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  points INTEGER,
  type TEXT
);
`;

db.exec(initSql, async (err) => {
  if (err) throw err;

  const adminPass = await bcrypt.hash('admin123', 10);
  db.run('INSERT INTO users (username, password, role, points) VALUES (?, ?, ?, ?)',
    ['admin', adminPass, 'admin', 666]);

  const tasks = [
    ['Odwiedź stronę partnera', 'otwartego link i czekaj 20s', 5, 'visit'],
    ['Oglądaj reklamy', 'Oglądaj reklamy z lat 30.', 4, 'ads'],
    ['Rozwiąż captcha', 'Proste potwierdzenie', 2, 'captcha'],
  ];
  for (const t of tasks) db.run('INSERT INTO tasks (title, description, points, type) VALUES (?, ?, ?, ?)', t);

  console.log('✅ Baza danych zainicjalizowana');
});
