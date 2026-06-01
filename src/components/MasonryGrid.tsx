import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StickerImage } from "@/lib/cloudinary";

interface MasonryGridProps {
  images: StickerImage[];
  onSelect: (img: StickerImage) => void;
}

function distributeToColumns(images: StickerImage[], colCount: number): StickerImage[][] {
  const columns: StickerImage[][] = Array.from({ length: colCount }, () => []);
  images.forEach((img, i) => {
    columns[i % colCount].push(img);
  });
  return columns;
}

const MasonryGrid = ({ images, onSelect }: MasonryGridProps) => {
  const isMobile = useIsMobile();
  const colCount = isMobile ? 2 : window.innerWidth >= 1024 ? 4 : 3;
  const columns = useMemo(() => distributeToColumns(images, colCount), [images, colCount]);
  return (
    <div className="flex gap-4 md:gap-6">
      {columns.map((col, ci) => (
        <div key={ci} className="flex-1 flex flex-col gap-4 md:gap-6">
          {col.map((img) => (
            <StickerCard key={img.public_id} image={img} onClick={() => onSelect(img)} />
          ))}
        </div>
      ))}
    </div>
  );
};

function StickerCard({ image, onClick }: { image: StickerImage; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const stickerUrl = `https://sand-atelier-stickers.lovable.app?sticker=${encodeURIComponent(image.filename)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(stickerUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChat = () => {
    window.open("http://pf.kakao.com/_ZaNaxl/chat", "_blank");
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={image.thumbnail}
              alt="sand atelier custom lettering sticker design preview"
              className="w-full mb-4 object-cover"
            />
            <p className="text-sm text-gray-500 text-center mb-1">
              아래 버튼으로 <strong>스티커 링크를 복사</strong>한 후,
            </p>
            <p className="text-sm text-gray-500 text-center mb-4">
              카카오톡 상담창에 <strong>붙여넣기</strong>하시면 빠른 상담이 가능해요 😊
            </p>
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl font-semibold text-sm mb-3 transition-all"
              style={{
                backgroundColor: copied ? "#4ade80" : "#FEE500",
                color: copied ? "white" : "#3C1E1E",
              }}
            >
              {copied ? "✅ 복사 완료! 이제 카톡창에 붙여넣기 하세요" : "🔗 스티커 링크 복사하기"}
            </button>
            <button
              onClick={handleChat}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ backgroundColor: "#3C1E1E" }}
            >
              💬 카카오톡 상담하기
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 카드 */}
      <div
        className="cursor-pointer group"
        onClick={() => setShowModal(true)}
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
          borderRadius: "0px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.13)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.07)";
        }}
      >
        <div className="relative overflow-hidden" style={{ borderRadius: "0px" }}>
          {!loaded && !error && (
            <div className="aspect-square flex items-center justify-center bg-muted/30">
              <span className="text-2xl animate-sandwich-bounce">🥪</span>
            </div>
          )}
          {error && (
            <div className="aspect-square flex items-center justify-center text-muted-foreground">
              <span className="text-xs">이미지 로드 실패</span>
            </div>
          )}
          <img
            src={image.thumbnail}
            alt="sand atelier custom lettering sticker design"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full block transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0 absolute"
            } ${error ? "hidden" : ""}`}
          />
        </div>
      </div>
    </>
  );
}

export default MasonryGrid;
