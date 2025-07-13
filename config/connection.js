// Import the packages
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Start sequelize session and pass in values from .env file or AWS environment
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
    process.env.DB_NAME || process.env.RDS_DB_NAME,
    process.env.DB_USER || process.env.RDS_USERNAME,
    process.env.DB_PASSWORD || process.env.RDS_PASSWORD,
    {
      host: process.env.DB_HOST || process.env.RDS_HOSTNAME || 'localhost',
      port: process.env.DB_PORT || process.env.RDS_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );

// Function to test the database connection
async function testDbConnection() {
  try {
    console.log('Testing database connection...');
    console.log(process.env.DB_NAME);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_URL);
    
    await sequelize.authenticate();
    console.log(
      `✅ Connection to database [${process.env.DB_NAME}] on host [${process.env.DB_URL || 'localhost'}] successful.`
    );
    return true;
  } catch (error) {
    console.error(
      `❌ Unable to connect to the database [${process.env.DB_NAME}] on host [${process.env.DB_URL || 'localhost'}]:`,
      error
    );
    return false;
  }
}

// Function to check if the database is empty
async function checkDatabaseEmpty() {
  try {
    const [results] = await sequelize.query(
      "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
    );
    const tableCount = parseInt(results[0].table_count);
    
    if (tableCount === 0) {
      console.log('📋 Database is empty - no tables found');
      return { isEmpty: true, tableCount: 0 };
    } else {
      console.log(`📋 Database contains ${tableCount} table(s)`);
      
      // Get actual row counts from each table
      const [tableNames] = await sequelize.query(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
      );
      
      let totalRows = 0;
      const tableRowCounts = [];
      
      for (const table of tableNames) {
        try {
          const [rowResult] = await sequelize.query(
            `SELECT COUNT(*) as row_count FROM "${table.tablename}"`
          );
          const rowCount = parseInt(rowResult[0].row_count);
          totalRows += rowCount;
          tableRowCounts.push({ table: table.tablename, rows: rowCount });
        } catch (error) {
          console.log(`⚠️  Could not count rows in table ${table.tablename}:`, error.message);
        }
      }
      
      if (totalRows === 0) {
        console.log('📋 Database has tables but no data');
        return { isEmpty: true, tableCount, hasData: false, tableRowCounts };
      } else {
        console.log(`📋 Database has ${totalRows} total rows across all tables`);
        // Log individual table counts for debugging
        tableRowCounts.forEach(({ table, rows }) => {
          if (rows > 0) {
            console.log(`   - ${table}: ${rows} rows`);
          }
        });
        return { isEmpty: false, tableCount, totalRows, tableRowCounts };
      }
    }
  } catch (error) {
    console.error('❌ Error checking database status:', error.message);
    return { isEmpty: null, error: error.message };
  }
}

// Export the sequelize instance for use elsewhere in your application
export {
  sequelize,
  testDbConnection,
  checkDatabaseEmpty,
};
