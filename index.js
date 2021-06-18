var express = require("express"),
  app = express(),
  port = process.env.PORT || 3500;

bodyParser = require("body-parser");
var decoder = require('object-encrypt-decrypt');

let shorten=require('simple-short');
var StringCrypto = require('string-crypto');

const {
  encryptString,
  decryptString,
} = new StringCrypto({digest : 'md4'});
const dotenv = require('dotenv');
dotenv.config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let { createDataFromObject } = require("./utils");
let { getDataFromFirestore } = require("./firebae_utils");
let failedResponse = {
  code: 422,
  message:
    "Oops! Looks like there was an error creating your data. If you're confident that the resquest sent was in correct JSON format, send it to us so we could figure out what's wrong",
};

app.get("/data/:id", async (req, res) => {
  try {
    const documentId = req.params.id;
    let data = await getDataFromFirestore({id: documentId});

    if(!data ) return res.status(422).send(failedResponse);

    let hash = data.hash;
    let requestObject =decoder.decrypt(hash);

    if (!Object.keys(requestObject).length) throw "err";
    let generatedData = createDataFromObject(requestObject);
    let finalData =
      requestObject.length && requestObject.length > 1
        ? generatedData
        : generatedData[0];

    let responseBody = {
      code: 200,
      data: finalData,
      message: "Data Fetch Successful",
    };
    if (requestObject.showTotalInMeta)
      responseBody.meta = { total: requestObject.showTotalInMeta };

    return res.status(200).send(responseBody);
  } catch (e) {
    return res.status(422).send(failedResponse);
  }
});

app.listen(port);
