import app from './app.js';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  Nexora AI API Server running on port: ${PORT}`);
  console.log(`  Endpoint URL: http://localhost:${PORT}/api`);
  console.log(`  Press Ctrl+C to shut down gracefully.`);
  console.log(`===============================================`);
});

// Handle graceful termination
const gracefulShutdown = () => {
  console.log('Nexora API: Shutting down server gracefully...');
  server.close(() => {
    console.log('Nexora API: Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
