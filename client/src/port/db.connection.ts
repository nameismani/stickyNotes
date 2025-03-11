import mongoose from "mongoose";

const connection: {
  isConnected?: number;
} = {};

export const dbConnection = async () => {
  try {
    if (connection?.isConnected) {
      console.log("using existing connection");
      return;
    }
    const db = await mongoose.connect(
      process.env.MONGODB_URL ?? "mongodb://localhost:27017/"
    );
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error("Error connecting to database: ", err);
    return process.exit(1);
  }
};
