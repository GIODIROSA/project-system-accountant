import 'dotenv/config';
import pool from './db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDatabase() {
  try {
    console.log('Iniciando la población de la base de datos con db.sql...');

    const sqlFilePath = join(__dirname, '..' , 'db.sql');
    const sql = readFileSync(sqlFilePath, 'utf8');

    // Ejecutar las sentencias SQL del archivo db.sql
    // Usamos un split para ejecutar cada sentencia por separado si hay varias
    // Esto es una simplificación, para SQL más complejo se necesitaría un parser más robusto
    const statements = sql.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log('Base de datos poblada exitosamente con db.sql.');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

seedDatabase();
