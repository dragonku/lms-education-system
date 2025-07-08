import dotenv from 'dotenv';
import { App } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const app = new App();
    const server = app.getApp().listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');
        app.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('HTTP server closed');
        app.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();