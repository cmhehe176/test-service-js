import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const BOT_TOKEN = '8170639669:AAEZzoMa_VG_MaODQVPicn6SivoAas4Kszo';
const CHAT_ID = '-1002345395149';
const IMAGE_URL =
  'http://103.166.183.191:9000/objects/images/7F:86:88:83:CB:BB:ID814986/2025-02-12T19:37:55.911456.jpg';

const sendImageToTelegram = async (imageUrl, caption) => {
  console.time('📸 Thời gian gửi ảnh sang Telegram');

  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000
    });

    const contentType = response.headers['content-type'];
    const ext = contentType.includes('image')
      ? contentType.split('/')[1]
      : 'jpeg';
    const filePath = `image.${ext}`;

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(filePath));
    form.append('caption', caption);
    form.append('parse_mode', 'HTML'); // ✅ Cho phép dùng HTML trong caption

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders(), timeout: 30000 }
    );

    console.log(
      '✅ Ảnh đã gửi thành công! :',
      telegramResponse.data.result.chat.title
    );

    fs.unlinkSync(filePath);
    console.timeEnd('📸 Thời gian gửi ảnh sang Telegram');
  } catch (error) {
    console.error('Lỗi tải hoặc gửi ảnh:', error.errors);
  } finally {
    console.log(new Date());
  }
};

export const sendDataHtmlToTelegram = async (data) => {
  try {
    let message = `<b>🚀 Dữ liệu cảm biến:</b>\n\n`;

    data.forEach((sensor) => {
      message += `📌 <b>${sensor.name}</b>\n`;
      message += `   - 📝 <b>Giá trị:</b> <code>${sensor.payload} ${sensor.unit}</code>\n\n`;
      // message += `   - 📝 <i>${sensor.description}</i>\n\n`;
    });

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });

    console.log('🚀 Đã gửi dữ liệu sensor lên Telegram!');
  } catch (error) {
    console.error('❌ Lỗi khi gửi tin nhắn:', error);
  }
};

const data = [
  {
    id: '0000',
    name: 'PMS5004 sensor: pm1',
    unit: 'ug/m3',
    payload: 19,
    description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm1'
  },
  {
    id: '0001',
    name: 'PMS5004 sensor: pm2.5',
    unit: 'ug/m3',
    payload: 29,
    description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm2.5'
  },
  {
    id: '0002',
    name: 'PMS5004 sensor: pm10',
    unit: 'ug/m3',
    payload: 19,
    description: 'PMS5003 sensor: PM 1.0, PM 2.5 and PM 10: pm10'
  },
  {
    id: '0003',
    name: 'LTR-390 sensor: uv index',
    unit: '',
    payload: 0,
    description: 'LTR-390 sensor: UV index: uv index'
  },
  {
    id: '0004',
    name: 'SCD41 sensor: co2',
    unit: 'ppm',
    payload: 1746,
    description: 'SCD41 sensor: CO2, temperature and humidity: co2'
  },
  {
    id: '0005',
    name: 'SCD41 sensor: temperature',
    unit: 'degree C',
    payload: 26.165847778320312,
    description: 'SCD41 sensor: CO2, temperature and humidity: temperature'
  },
  {
    id: '0006',
    name: 'SCD41 sensor: humidity',
    unit: 'percentage',
    payload: 60.7757568359375,
    description: 'SCD41 sensor: CO2, temperature and humidity: humidity'
  }
];
const test = `
              <b>📸 Object Detected!</b>\n
              <b>🎯Age:</b> ${22 || 'Unknown'}
              <b>🎯Type:</b> ${'Human' || 'Unknown'}
              <b>🎯Gender:</b> ${'Male' || 'Unknown'}
            `;
// sendDataHtmlToTelegram(data);

sendImageToTelegram(IMAGE_URL, test);
