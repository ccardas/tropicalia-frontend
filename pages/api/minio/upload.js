const Minio = require('minio');

var minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    useSSL: process.env.MINIO_USE_SSL,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
})

export const config = {
    api: {
        externalResolver: true,
    },
};
  
export default async function handler(req, res) {
    const bucketName = "tropicalia"
    const objectName = "excel/" + req.query["name"];
    try {
        // creates presigned url
        minioClient.presignedPutObject(bucketName, objectName, (err, url) => {
            if (err) throw err;
            res.end(url);
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            code: err?.code,
        });
    }
}
