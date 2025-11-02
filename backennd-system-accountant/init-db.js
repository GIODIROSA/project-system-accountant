const pool = require('./db');

async function initDatabase() {
  try {
    console.log('🔧 Inicializando base de datos...');

    // Crear tabla de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        cliente VARCHAR(255) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        productos JSONB NOT NULL,
        fecha TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Tabla "pedidos" creada correctamente');

    // Verificar que la tabla existe
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'pedidos'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Verificación exitosa: tabla "pedidos" existe');
    }

    // Mostrar estructura de la tabla
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Estructura de la tabla "pedidos":');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(requerido)' : '(opcional)'}`);
    });

    console.log('\n🎉 Base de datos inicializada correctamente');
    console.log('✅ Ahora puedes usar Thunder Client para crear pedidos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    console.error('\n💡 Posibles soluciones:');
    console.error('  1. Verifica que DATABASE_URL esté configurado en Render');
    console.error('  2. Verifica que la base de datos PostgreSQL esté activa');
    console.error('  3. Verifica que tengas permisos para crear tablas\n');
    process.exit(1);
  }
}

initDatabase();
