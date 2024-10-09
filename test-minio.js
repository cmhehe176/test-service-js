import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

const minioClient = new Minio.Client({
  endPoint: '192.168.10.114', // Địa chỉ MinIO
  port: 9000,
  useSSL: false, // Nếu sử dụng HTTPS thì chuyển thành true
  accessKey: 'PdzQuQ1UCitLWQLt6I37',
  secretKey: 'xD9ABDwY1guiYhjfj6Svwd0XvhGcB5ENQalZ4KNf'
});

const bucketName = 'test';
const objectName = 'sensor_data/sensor_001_2024_09_27.json';
const filePath = `./fileMinio/${objectName}`;

const jsonData = {
  device_id: 'sensor_001',
  temperature: 26.7,
  humidity: 60,
  timestamp: '2024-09-27T12:34:56Z'
};

const jsonBuffer = Buffer.from(JSON.stringify(jsonData));

// Upload object lên MinIO
minioClient.putObject(bucketName, objectName, jsonBuffer, (err, etag) => {
  if (err) {
    return console.log('Lỗi khi upload:', err);
  }
  console.log('Upload thành công với etag:', etag);
});

// Tải xuống object ngay sau khi upload thành công
// minioClient.fGetObject(bucketName, objectName, filePath, (err) => {
//   if (err) {
//     return console.log('Lỗi khi tải xuống:', err);
//   }
//   console.log('Tải xuống thành công:', filePath);
// });

// minioClient.getObject(bucketName, objectName, (err, stream) => {
//   if (err) {
//     return console.log('Lỗi khi tải xuống:', err);
//   }

//   let data = '';
//   stream.on('data', (chunk) => {
//     data += chunk;
//   });

//   stream.on('end', () => {
//     // Chuyển đổi chuỗi về JSON
//     const sensorData = JSON.parse(data);
//     console.log(sensorData);
//   });
// });
