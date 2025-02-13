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

sendImageToTelegram(IMAGE_URL, '📸 Ảnh này được gửi từ server!');
