const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const fastCSV = require("@fast-csv/parse");

app.get("/", (req, res) => {
  res.send("hello from container 2");
});

app.post("/calculate", (req, res) => {
  let responseSent = false;

  if (!req.body.file) {
    const err = { file: null, error: "Invalid JSON input." };
    responseSent = true;
    return res.status(400).send(err);
  }

  // const filePath = `../files/${req.body.file}`;
  const filePath = `../jainish_PV_dir/${req.body.file}`;
  console.log(`Checking file path: ${filePath}`);
  if (!checkFileExistsSync(filePath) && !responseSent) {
    const err = { file: req.body.file, error: "File not found." };
    responseSent = true;
    return res.status(400).send(err);
  }

  const file = fs.createReadStream(filePath);
  const fileData = [];

  const regex = /^[0-9]+$/;

  const checkAmount = (amount) => amount && regex.test(amount.trim());

  file
    .pipe(
      fastCSV.parse({
        headers: (headers) => headers.map((header) => header.trim()),
        ignoreEmpty: false,
        strictColumnHandling: true,
      })
    )
    .validate((data) => checkAmount(data.amount))
    .on("data-invalid", (row, rowNumber) => {
      // console.log("Invalid Row", row, rowNumber);

      const response = {
        file: req.body.file,
        error: "Input file not in CSV format.",
      };

      file.destroy();

      if (!responseSent) {
        responseSent = true;
        return res.status(200).json(response);
      }
    })
    .on("error", (error) => {
      // console.error("error : ", error);

      if (!responseSent) {
        const response = {
          file: req.body.file,
          error: "Input file not in CSV format.",
        };

        responseSent = true;
        file.destroy();

        return res.status(200).json(response);
      }
    })
    .on("data", (row) => fileData.push(row))
    .on("end", () => {
      if (!responseSent) {
        // console.log("file data : ", fileData);
        let sum = 0;

        if (fileData.length > 0) {
          fileData.forEach((item) => {
            if (item.product === req.body.product) {
              sum += parseInt(item.amount.trim());
            }
          });

          const response = {
            file: req.body.file,
            sum: sum,
          };
          responseSent = true;
          return res.status(200).json(response);
        } else {
          if (!responseSent) {
            const response = {
              file: req.body.file,
              error: "Input file not in CSV format.",
            };

            return res.status(200).json(response);
          }
        }
      }
    });
});

const port = 5000;
const server = app.listen(port, () => {
  console.log(`container2:Listening on port ${port}`);
});

server.setTimeout(300000);

function checkFileExistsSync(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
    return true;
  } catch (e) {
    console.log("checkFileExistsSync : ", e);
    return false;
  }
}
