const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory room store
const rooms = {};

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
        console.log('[socket] connected:', socket.id);

        // Create a new duo room
        socket.on('create-room', (callback) => {
            const roomId = uuidv4().slice(0, 8);
            rooms[roomId] = { host: socket.id, guest: null, ready: {} };
            socket.join(roomId);
            socket.roomId = roomId;
            console.log('[room] created:', roomId);
            callback({ roomId });
        });

        // Join existing room
        socket.on('join-room', ({ roomId }, callback) => {
            const room = rooms[roomId];
            if (!room) return callback({ error: 'Room not found' });
            if (room.guest) return callback({ error: 'Room is full' });

            room.guest = socket.id;
            socket.join(roomId);
            socket.roomId = roomId;
            io.to(roomId).emit('room-update', { roomId, hostId: room.host, guestId: room.guest });
            console.log('[room] guest joined:', roomId);
            callback({ roomId, hostId: room.host });
        });

        // Share live frame thumbnail for split preview
        socket.on('send-frame', ({ roomId, frameData }) => {
            socket.to(roomId).emit('receive-frame', { fromId: socket.id, frameData });
        });

        // Trigger synchronized countdown + capture
        socket.on('start-countdown', ({ roomId }) => {
            io.to(roomId).emit('countdown-start');
        });

        // Share captured photo
        socket.on('share-capture', ({ roomId, imageData }) => {
            socket.to(roomId).emit('receive-capture', { fromId: socket.id, imageData });
        });

        // Disconnect cleanup
        socket.on('disconnect', () => {
            const { roomId } = socket;
            if (roomId && rooms[roomId]) {
                delete rooms[roomId];
                io.to(roomId).emit('partner-left');
                console.log('[room] cleaned up:', roomId);
            }
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`> Cozy Photobooth ready on http://localhost:${PORT}`);
    });
});
