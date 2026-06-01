import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (typeof window !== "undefined" && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
  (window as any).Kakao.init("41b22eb533a500b42c133ea356ee3389");
}

createRoot(document.getElementById("root")!).render(<App />);
