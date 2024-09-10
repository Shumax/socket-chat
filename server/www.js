import express from 'express'
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3030;

server.listen(port, () => {
  console.log('server running at http://localhost:3030');
});