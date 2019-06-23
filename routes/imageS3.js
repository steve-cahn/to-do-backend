const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const config = require('config');
const multer = require('multer');

var storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const s3Client = new aws.S3({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey,
	region: 'us-west-1'
});

router.post('/upload-image', async (req, res) => {
	upload(req, res, function(err) {
		if (err instanceof multer.MulterError || err)
			return res.status(500).json(err);

		const uploadParams = {
			Bucket: config.aws.bucket,
			Key: req.file.originalname + Date.now(),
			ACL: 'public-read',
			Body: req.file.buffer
		};

		s3Client.upload(uploadParams, (err, data) => {
			if (err) res.status(500).json({ error: 'Error -> ' + err });

			return res.status(200).send(data.Location);
		});
	});
});

module.exports = router;
