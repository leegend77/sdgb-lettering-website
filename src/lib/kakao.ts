declare global {
  interface Window {
    Kakao: any;
  }
}

export const KAKAO_JS_KEY = "PRDBD5F3C93AC1792F50166F638FC6D3BD753E86";
const KAKAO_CHANNEL_CHAT_URL = "https://pf.kakao.com/_ZaNaxl/chat";

export function initKakao() {
  if (!window.Kakao) return false;

  try {
    if (window.Kakao.isInitialized()) {
      return true;
    }
    window.Kakao.init(KAKAO_JS_KEY);
    return window.Kakao.isInitialized();
  } catch (e) {
    console.error("Kakao init failed:", e);
    return false;
  }
}

export function shareDesign(_imageUrl?: string) {
  // 카카오 채널 1:1 채팅으로 바로 이동 (가장 안정적인 방식)
  window.open(KAKAO_CHANNEL_CHAT_URL, "_blank", "noopener,noreferrer");
}
