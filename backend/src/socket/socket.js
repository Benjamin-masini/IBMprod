const { Server } = require(
  "socket.io"
);

const User = require(
  "../modules/user/user.model.js"
);

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "⚡ User connected:",
      socket.id
    );

    // USER JOIN
    socket.on(
      "join",
      async (userId) => {
        socket.userId = userId;

        socket.join(userId);

        // UPDATE ONLINE
        await User.findByIdAndUpdate(
          userId,
          {
            isOnline: true,
          }
        );

        // EMIT ONLINE STATUS
        io.emit("userOnline", {
          userId,
        });

        console.log(
          `🟢 User online: ${userId}`
        );
      }
    );

    // DISCONNECT
    socket.on(
      "disconnect",
      async () => {
        if (socket.userId) {
          await User.findByIdAndUpdate(
            socket.userId,
            {
              isOnline: false,

              lastSeen:
                new Date(),
            }
          );

          io.emit(
            "userOffline",
            {
              userId:
                socket.userId,
            }
          );

          console.log(
            `⚫ User offline: ${socket.userId}`
          );
        }
      }
    );
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};