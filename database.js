import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('meals_v2.db');

//////////////////////////////
// USER TABLE
//////////////////////////////

export async function initUserTable() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  // Eksik sütunları ekle (zaten varsa hata almaz)
  await db.runAsync(`ALTER TABLE users ADD COLUMN goal TEXT;`).catch(() => {});
  await db.runAsync(`ALTER TABLE users ADD COLUMN calorieLimit INTEGER;`).catch(() => {});
  await db.runAsync(`ALTER TABLE users ADD COLUMN avatarUri TEXT;`).catch(() => {});
}

export async function registerUser(name, email, password) {
  await db.runAsync(
    `INSERT INTO users (name, email, password, goal, calorieLimit, avatarUri)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [name, email, password, '', null, null]
  );
}

export async function findUserByEmail(email) {
  return await db.getFirstAsync(
    'SELECT * FROM users WHERE email = ?;',
    [email]
  );
}

export async function loginUser(email, password) {
  return await db.getFirstAsync(
    'SELECT * FROM users WHERE email = ? AND password = ?;',
    [email, password]
  );
}

export async function updateUserProfile(email, updates) {
  const user = await findUserByEmail(email);
  if (!user) return;

  const newGoal = updates.goal ?? user.goal;
  const newCalorieLimit = updates.calorieLimit ?? user.calorieLimit;
  const newAvatarUri = updates.avatarUri ?? user.avatarUri;

  await db.runAsync(
    `UPDATE users SET goal = ?, calorieLimit = ?, avatarUri = ? WHERE email = ?;`,
    [newGoal, newCalorieLimit, newAvatarUri, email]
  );
}

//////////////////////////////
// MEALS TABLE (STATIC)
//////////////////////////////

export async function initMealTable() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      calories INTEGER,
      fat REAL,
      carbs REAL,
      protein REAL,
      ingredients TEXT
    );
  `);
}

export async function insertMeal(title, image, category, description, calories, fat, carbs, protein, ingredients) {
  await db.runAsync(
    `INSERT INTO meals (title, image, category, description, calories, fat, carbs, protein, ingredients)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [title, image, category, description, calories, fat, carbs, protein, JSON.stringify(ingredients)]
  );
}

export async function getMealsByCategory(category) {
  return await db.getAllAsync(
    'SELECT * FROM meals WHERE category = ?;',
    [category]
  );
}

export async function getMealById(id) {
  return await db.getFirstAsync(
    'SELECT * FROM meals WHERE id = ?;',
    [id]
  );
}

//////////////////////////////
// USER MEALS TABLE (DYNAMIC)
//////////////////////////////

export async function initUserMealsTable() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      title TEXT NOT NULL,
      calories INTEGER NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

export async function insertUserMeal(email, title, calories, category, notes) {
  const timestamp = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO user_meals (email, title, calories, category, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [email, title, parseInt(calories), category, notes, timestamp]
  );
}

export async function getUserMeals(email) {
  return await db.getAllAsync(
    `SELECT * FROM user_meals WHERE email = ?;`,
    [email]
  );
}

//////////////////////////////
// OPTIONAL: INIT ALL TOGETHER
//////////////////////////////

export async function initAllTables() {
  await initUserTable();
  await initMealTable();
  await initUserMealsTable();
}

export default db;
