import express from 'express'
import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey },
  region: bucketRegion
})

const app = express()


app.use(express.json())
app.use(cookieParser())

const upload = multer({ storage: multer.memoryStorage() })


const _dirname = path.dirname('')
const buildPath = path.join(_dirname, '../frontend/build')
app.use(express.static(buildPath))


app.get("/", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.get("/post/:id", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.get("/write", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.get("/login", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.get("/register", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.get("/account", function(req, res){

  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
    );

})

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(200).json('')

  const filename = Date.now() + req.file.originalname

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }

  const command = new PutObjectCommand(params)

  await s3.send(command)

  res.status(200).json(filename)
})

app.use('/api/posts', postRoutes)
app.use('/api/auth', authRoutes)

app.get('/test', function (req, res) {
  res.json('j')
})

app.listen(8800, () => {
  console.log('connected 8800')
})
