import 'dotenv/config';
import pool from './db.js';

async function migrateToRelational() {
  try {
    console.log('Iniciando migración a estructura relacional...\n');

    await pool.query('DROP TABLE IF EXISTS pedidos CASCADE');
    console.log('Tabla antigua eliminada');

    await pool.query(`
      CREATE TABLE usuario (
        id_usuario SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefono VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Tabla usuario creada');

    await pool.query(`
      CREATE TABLE producto (
        id_producto SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descrip TEXT,
        precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
        stock INTEGER DEFAULT 0 CHECK (stock >= 0),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Tabla producto creada');

    await pool.query(`
      CREATE TABLE pedido (
        id_pedido SERIAL PRIMARY KEY,
        fecha_pedido TIMESTAMP DEFAULT NOW(),
        estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completado', 'cancelado')),
        total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
        id_usuario INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
      )
    `);
    console.log('Tabla pedido creada');

    await pool.query(`
      CREATE TABLE detalle_pedido (
        id_detalle SERIAL PRIMARY KEY,
        id_pedido INTEGER NOT NULL,
        id_producto INTEGER NOT NULL,
        cantidad INTEGER NOT NULL CHECK (cantidad > 0),
        precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
        subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
        FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE RESTRICT
      )
    `);
    console.log('Tabla detalle_pedido creada');

    await pool.query('CREATE INDEX idx_pedido_usuario ON pedido(id_usuario)');
    await pool.query('CREATE INDEX idx_pedido_estado ON pedido(estado)');
    await pool.query('CREATE INDEX idx_pedido_fecha ON pedido(fecha_pedido)');
    await pool.query('CREATE INDEX idx_detalle_pedido ON detalle_pedido(id_pedido)');
    await pool.query('CREATE INDEX idx_detalle_producto ON detalle_pedido(id_producto)');
    console.log('Índices creados');

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('\nTablas creadas:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\nMigración completada exitosamente');
    console.log('Todas las tablas están vacías y listas para usar\n');

    process.exit(0);
  } catch (error) {
    console.error('\nError durante la migración:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

migrateToRelational();
