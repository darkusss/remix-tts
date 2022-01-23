import { createCookie } from "remix";

export const ttsToken = createCookie("tts-token", {
  maxAge: 600 // 10 mins
});