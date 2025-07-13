// Import the dependencies
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import utilities
import { sequelize, testDbConnection, checkDatabaseEmpty } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import auth from './utils/auth.js';
import handleSeedDatabase from './config/seeds.js';

// Define key variables
const app = express();
const PORT = process.env.PORT || 3001;
const authMiddleware = auth.authMiddleware;

// Instantiate the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Define StartServer function
const startServer = async () => {
  await server.start();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    '/graphql', 
    expressMiddleware(server, {
      context: authMiddleware
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Test the database connection
  const goodConnection = await testDbConnection();

  // If the connection is good, start the server first, then handle database operations
  if (goodConnection) {
    // Sync database and start server
    sequelize.sync({ force: false }).then(async () => {
      console.log('✅ Database synced successfully');
      
      // Start the server immediately
      app.listen(PORT, () => {
        console.log(`Now listening at http://localhost:${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
        
        // Handle database seeding asynchronously after server starts
        handleDatabaseSetup();
      });
    }).catch((err) => {
      console.error('Error syncing database:', err);
      // Start server anyway in production to avoid deployment failure
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️  Starting server despite database sync error in production');
        app.listen(PORT, () => {
          console.log(`Now listening at http://localhost:${PORT} (database sync failed)`);
        });
      } else {
        process.exit(1);
      }
    });
  } else {
    console.error('Database connection failed.');
    // In production, start server anyway to avoid deployment failure
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Starting server despite database connection failure in production');
      app.listen(PORT, () => {
        console.log(`Now listening at http://localhost:${PORT} (database connection failed)`);
      });
    } else {
      console.error('Server not started due to database connection failure.');
      process.exit(1);
    }
  }
}

// Async function to handle database setup without blocking server startup
async function handleDatabaseSetup() {
  try {
    // Skip seeding in production if environment variable is set
    if (process.env.SKIP_SEEDING === 'true') {
      console.log('🚫 Skipping database seeding (SKIP_SEEDING=true)');
      return;
    }

    // Check if database is empty
    const dbStatus = await checkDatabaseEmpty();
    
    if (dbStatus.isEmpty === true) {
      if (dbStatus.tableCount === 0) {
        console.log('🔄 Database is empty - tables will be created on sync');
      } else {
        console.log('🔄 Database has tables but no data - running seeds...');
        await handleSeedDatabase();
        console.log('✅ Seeding completed');
      }
    } else if (dbStatus.isEmpty === false) {
      console.log('✅ Database is populated and ready');
    }
  } catch (error) {
    console.error('Error during database setup:', error);
    // Don't exit the process, just log the error
  }
}


// Start the server
startServer();