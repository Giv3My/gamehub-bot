import * as https from 'https';

export default async () => {
  const req = https.get(process.env.SERVER_URL, () => {
    console.log('Server was pinged');
  });

  req.on('error', (error) => {
    return error;
  });

  req.end();
};
