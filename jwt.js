import * as jwt_decode from 'jwt-decode';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiY3JlYXRlZEF0IjoiMjAyNC0xMC0wOFQwMTo0NjoyOC4xNThaIiwidXBkYXRlZEF0IjoiMjAyNC0xMC0wOFQwMTo0NjoyOC4xNThaIiwicm9sZUlkIjoyLCJuYW1lIjoiIiwiZW1haWwiOiJjb25nbmRtQHJhYmlsb28uY29tIiwidGVsZXBob25lIjoiMTIzNDMiLCJ0aHVtYm5haWxVcmwiOm51bGwsInBhc3N3b3JkIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JGNnMDVXWFI0Yk9XRDdRUEhEbkFXV0EkOXNsTVVmN1Ezek1ZbEJzRXo0TzQrNU9hT2I3b1YxZEo3QVNnTFJid3NtUSIsImlhdCI6MTcyODUyNTY4MywiZXhwIjoxNzI4NTI3NDgzfQ.hu5TTa0cXcVsy5kFE_QFFH-d0n2UMQgEBl4cDi2Ybp4';

const decoded = jwt_decode.jwtDecode(token);
if (decoded.exp) {
  const currentTime = Math.floor(Date.now() / 1000);

  const timeLeftInSeconds = decoded.exp - currentTime;

  if (timeLeftInSeconds > 0) {
    const daysLeft = Math.floor(timeLeftInSeconds / (24 * 3600));
    const hoursLeft = Math.floor((timeLeftInSeconds % (24 * 3600)) / 3600);
    const minutesLeft = Math.floor((timeLeftInSeconds % 3600) / 60);
    const secondsLeft = timeLeftInSeconds % 60;

    console.log(
      `Token còn lại ${daysLeft} ngày, ${hoursLeft} giờ, ${minutesLeft} phút, và ${secondsLeft} giây`
    );
  } else {
    console.log('Token đã hết hạn');
  }
} else {
  console.log('Token không có thời gian hết hạn (exp)');
}
