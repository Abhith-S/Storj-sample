var express = require("express");
var router = express.Router();

var { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,    //the .env file contents should be replaced using your details recieved while creating storj account
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: "ap-1", //check while creating storj account ,region can change
  endpoint: "https://gateway.storjshare.io",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/presign", async function (req, res, next) {
  try {
    let params = {
      Bucket: "vtl-nodejs", //Here my bucket name is given "vtl-nodejs", Substitute with your bucket name
      Key: req.body.key,
    };

    let command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    res.json({ url: signedUrl });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
