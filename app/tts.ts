import fs from 'fs';
import path from 'path';

const audioPath = path.join(__dirname, "..", "public", "audios");

export const fetchToken = async () => {
  const headerForToken: HeadersInit = new Headers();
  headerForToken.set('Ocp-Apim-Subscription-Key', process.env.SUBSCRIPTION_URL || '');

  return fetch('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken', {
    method: 'POST',
    headers: headerForToken
  }).then((response) => {
    if (response.status === 200) {
        return response.text();
    } else {
        console.log(`[Error][fetchToken]: ${response.status}, ${response.statusText}`);
        return '';
    }
  });
}

export const fetchAudio = async (tts: string, token: string) => {
    const headersForAudio: HeadersInit = new Headers();
    headersForAudio.set('Authorization', `Bearer ${token}`);
    headersForAudio.set('Content-Type', 'application/ssml+xml');
    headersForAudio.set('X-Microsoft-OutputFormat', 'audio-16khz-64kbitrate-mono-mp3');
  
    return fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
      method: 'POST',
      headers: headersForAudio,
      body: `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Male' name='en-US-ChristopherNeural'>
          ${tts.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </voice>
      </speak>
      `
    }).then((response) => {
        if (response.status === 200) {
            return response.arrayBuffer();
        } else {
            console.log(`[Error][fetchAudio]: ${response.status}, ${response.statusText}`);
            return Promise.resolve(new ArrayBuffer(0));
        }
    }).catch((error) => console.log(`[Error][fetchAudio]: ${error}`));
};



export const saveFile = (buffer: ArrayBuffer) => {
    fs.writeFile(
        path.join(audioPath, 'tts_1.mp3'),
        Buffer.from(buffer),
        (err: NodeJS.ErrnoException | null) => console.log(err)
    );
}
