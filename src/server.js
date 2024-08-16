const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();


connectDB();

const app = express();

app.use(express.json());


app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/taskRoute"));

const PORT = process.env.PORT || 8000;
module.exports = app;
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
