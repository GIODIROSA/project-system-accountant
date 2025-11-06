import pool from './db.js'; 

async function initDatabase() {
    try {
        console.log('Inicializando base de datos...');

        // --- 1. Crear tabla USUARIO ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuario (
                id_usuario SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                telefono VARCHAR(50) UNIQUE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Tabla "usuario" creada correctamente.');

        // --- 2. Crear tabla PRODUCTO ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS producto (
                id_producto SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT,
                precio NUMERIC(10, 2) NOT NULL
            );
        `);
        console.log('Tabla "producto" creada correctamente.');

        // --- 3. Crear tabla PEDIDO (depende de usuario) ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pedido (
                id_pedido SERIAL PRIMARY KEY,
                fecha_pedido TIMESTAMP DEFAULT NOW(),
                estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
                total NUMERIC(10, 2) NOT NULL,
                id_usuario INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                
                -- Clave Foránea
                FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
            );
        `);
        console.log('Tabla "pedido" creada correctamente.');

        // --- 4. Crear tabla DETALLE_PEDIDO (Tabla de relación) ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS detalle_pedido (
                id_pedido INTEGER NOT NULL,
                id_producto INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario NUMERIC(10, 2) NOT NULL,
                
                -- Definición de Claves Foráneas
                FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
                FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
                
                -- Clave Primaria Compuesta
                PRIMARY KEY (id_pedido, id_producto)
            );
        `);
        console.log('Tabla "detalle_pedido" creada correctamente.');
        
      
        
        console.log('\nBase de datos inicializada correctamente con las 4 tablas.');
        process.exit(0);

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        console.error('\nVerifica la conexión y permisos de PostgreSQL.');
        process.exit(1);
    }
}

initDatabase();