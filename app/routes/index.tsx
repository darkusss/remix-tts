import {
  json,
  useActionData,
  useTransition,
  redirect,
} from "remix";
import type { MetaFunction, ActionFunction, LinksFunction } from "remix";
import { fetchToken, fetchAudio, saveFile } from "~/tts";
import { ttsToken } from "~/cookies";
import { IndexView } from "~/components/IndexView";
import globalStylesUrl from "~/styles/global.css";

export const meta: MetaFunction = () => {
  return {
    title: "Text-to-speech Azure Api",
    description: "Usage of Text-to-speech Azure Api",
  };
};

function validateTTS(tts: string) {
  if (tts.length < 1) {
    return 'Text must be at least 1 characters long';
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: { tts: string | undefined; };
  fields?: { tts: string; };
  fileId?: string;  
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const tts = await form.get('tts');
  const cookieHeader = await request.headers.get('Cookie');
  const cookie: { token?: string } = (await ttsToken.parse(cookieHeader)) || {};
  let returnValue = null;

  if (typeof tts !== "string") {
    return badRequest({ formError: 'Form not filled up correctly.' });
  }

  const fields = { tts };
  const fieldErrors = {
    tts: validateTTS(tts),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  let token = cookie.token;
  if (!token) {
    console.log('[Info]: revoking token...');
    token = await fetchToken();
    cookie.token = token;

    returnValue = redirect('/', {
      headers: {
        "Set-Cookie": await ttsToken.serialize(cookie),
      }
    });
  }
  
  const audioBuffer = await fetchAudio(tts, token);
  if (audioBuffer instanceof ArrayBuffer && audioBuffer.byteLength !== 0) {
    saveFile(audioBuffer);
  }

  return returnValue;
}


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  return <IndexView actionData={actionData} formState={transition} />;
}
