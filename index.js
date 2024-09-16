import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = 3000;

// Tạo kết nối đến cơ sở dữ liệu
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'demo_database'
});

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error('Kết nối thất bại: ' + err.stack);
    return;
  }
  console.log('Đã kết nối với demo_database ' + connection.authorized);
});

const routeApi = '/';

// Định nghĩa một route GET để lấy dữ liệu từ database
app.get(routeApi, (_req, res) => {
  const whereVariable = {
    name: 'header'
  };

  const query = `
        SELECT data, name
        FROM components
        WHERE name = '${whereVariable.name}'
        AND JSON_UNQUOTE(JSON_EXTRACT(data, '$[1].name')) = '${whereVariable.name}'
        `;

  // Thực hiện truy vấn đến cơ sở dữ liệu
  connection.query(query, (err, results, _fields) => {
    console.log('query', query);

    // Nếu có lỗi, trả về HTTP 500 và thông báo lỗi
    if (err)
      return res
        .status(500)
        .json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu', details: err.stack });

    // Biến đổi results trả về phù hợp theo required của FE
    results = results.map((item) => item);

    // Trả về kết quả API dưới dạng JSON
    res.json(results);
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
