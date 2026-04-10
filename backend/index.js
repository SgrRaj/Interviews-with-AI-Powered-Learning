

//! create an express server and check if it's working

// 1) we are importing express module which we installed using npm i
import express from "express";
import cors from "cors"; // cross origin  resource sharing (browser blocks the request which comes from anywhere but localhost:8000)
import { connectDB } from "./config/database-config.js";
import userRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import aiRoutes from "./routes/ai-route.js";
import dotenv from "dotenv";

dotenv.config();

//2.call /invoke the function 
let app=express()    // object ={listen}

const allowedOrigins = [
  "http://localhost:5173",
  "https://interviews-with-ai-powered-learning-qvbqaojvd-sgrrajs-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));
// app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", userRoutes); // http:/localhost:9000/api/auth/signup
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

//4. declare routes ->app.http_method('endpoint',callback)

app.get("/",(req,res)=>{
  //req,res ->object
  
  //  res.send("welcome");
//   res.json({
//     success:true,
//     message:"okay",
//     data:{userName: "sagar"},
//   });

res.status(500).json({
    success:false,
    message:"error occured",
    err:{name:"some error"},
});
    
});

connectDB().then(() => {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}..`);
  });
}).catch((error) => console.log(error));




//3.assign a port number to our server


//app.listen(PORT_NUMBER ,callback)



//! to check if the server is running, in cmd(git bash), goto backend folder and type "npx nodemon index.js"
// open browser -> localhost:PORT_NUMBER and press enter

// https://nodejs.org/en/ (/) =>  this is base url
// https://nodejs.org/en/blog => /blog is one endpoint
// https://nodejs.org/en/download