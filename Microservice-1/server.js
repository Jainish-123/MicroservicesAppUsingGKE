const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const axios = require("axios");

app.get("/", (req, res) => {
  res.send("Hello from container 1");
});

app.post("/store-file", (req, res) => {
  let responseSent = false;
  if (!req.body.file) {
    const err = { file: null, error: "Invalid JSON input." };
    responseSent = true;
    return res.status(400).send(err);
  }

  // const path = `../files/${req.body.file}`;
  const path = `../jainish_PV_dir/${req.body.file}`;

  fs.writeFile(path, req.body.data, (err) => {
    if (err) {
      console.error(err);
      const err = {
        file: req.body.file,
        error: "Error while storing the file to the storage.",
      };
      if (!responseSent) {
        responseSent = true;
        return res.status(400).send(err);
      }
    } else {
      console.log(`File Save : ${req.body.file}`);
      const resp = { file: req.body.file, message: "Success." };
      if (!responseSent) {
        responseSent = true;
        return res.status(200).send(resp);
      }
    }
  });
});

app.post("/calculate", (req, res) => {
  let responseSent = false;
  if (!req.body.file) {
    const err = { file: null, error: "Invalid JSON input." };
    responseSent = true;
    return res.status(400).send(err);
  }
  axios
    .post("http://container2-service:8081/calculate", {
      file: req.body.file,
      product: req.body.product,
    })
    .then((response) => {
      if (!responseSent) {
        res.send(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
      if (!responseSent) {
        const err = { file: req.body.file, error: "File not found." };
        responseSent = true;
        res.status(500).send(err);
      }
    });
});

const port = 6000;
app.listen(port, () => {
  console.log(`container1:Listening on port ${port}`);
});
