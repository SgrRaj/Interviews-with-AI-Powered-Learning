import mongoose from "mongoose";
import dns from "node:dns/promises"


export const connectDB = async () => {
  try {
   
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log(await dns.getServers());
    console.log(process.env.MONGODB_URI);

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

    console.log("MongoDB connected");
  } catch (error) {
    console.log("DB Error:", error);
  }
};

