import express from 'express'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import socketConnect from './src/infra/websocket/socket.connect.js'
import mongooseConnect from './src/infra/db/mongo.config.js'

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3030;

const __dirname = dirname(fileURLToPath(import.meta.url));
// express.static('frontend/index.html') 

// app.get('/room', (req, res) => { res.sendFile(join(__dirname, '../frontend/.next')) })

mongooseConnect.then(() => {
  console.log('MongoDB connected')
  
  server.listen(port, () => {
    console.log('Server is running at http://localhost:3030');
  })

  socketConnect(server)

}).catch(err => {
  console.log('MongoDB connection error', err)
})

