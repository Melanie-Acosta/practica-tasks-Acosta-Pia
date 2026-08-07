import express from "express";

const app = express();

const port =  4000;

app.get("/", (req, res) => {
  res.send("Hello Worl");
});

app.listen(port, ( ) => {
  console.log(`Server running on port http://localhost:${port}`);
}); 
