import { useState, useEffect, useCallback, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MasonryGrid from "@/components/MasonryGrid";
import StickerModal from "@/components/StickerModal";
import SandwichLoader from "@/components/SandwichLoader";
import SearchBar from "@/components/SearchBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phone, MessageCircle, MapPin, Instagram, Mail } from "lucide-react";
import logoImg from "@/assets/logo.png";
import {
  fetchStickers,
  searchStickers,
  CATEGORIES,
  type CategoryId,
  type StickerImage,
} from "@/lib/cloudinary";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_ZaNaxl/chat";
const NAVER_PLACE_URL = "https://naver.me/xUw8XbZi";

const Index = () => {
  const isMobile = useIsMobile();
  const [category, setCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<StickerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [selectedSticker, setSelectedSticker] = useState<StickerImage | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const tag = CATEGORIES.find((c) => c.id === category)?.tag ?? "";

  const loadImages = useCallback(
    async (cursor?: string) => {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setImages([]);
      }
      const result = await fetchStickers(tag, cursor);
      if (cursor) {
        setImages((prev) => [...prev, ...result.images]);
      } else {
        setImages(result.images);
      }
      setNextCursor(result.nextCursor);
      setLoading(false);
      setLoadingMore(false);
    },
    [tag]
  );

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (images.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const stickerName = params.get("sticker");
    if (stickerName) {
      const found = images.find((img) => img.filename === stickerName);
      if (found) setSelectedSticker(found);
    }
  }, [images]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          loadImages(nextCursor);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, [nextCursor, loadingMore, loadImages]);

  const displayImages = searchQuery ? searchStickers(images, searchQuery) : images;

  const handleCategoryChange = (id: CategoryId) => {
    setCategory(id);
    setSearchQuery("");
  };

  const handleLogoClick = () => {
    setCategory("all");
    setSearchQuery("");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">

        {/* ── 헤더 ── */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          {isMobile ? (
            <div className="px-4 pt-3 pb-2">
              {/* 모바일: 로고 + 검색바 한 줄 */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleLogoClick}
                  className="shrink-0 hover:opacity-75 transition-opacity"
                >
                  <img src={logoImg} alt="sand atelier custom lettering logo" className="h-9" />
                </button>
                <div className="flex-1 max-w-[200px]">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
              </div>
              {/* 모바일: 타이틀 */}
              <button
                onClick={handleLogoClick}
                className="block w-full text-center mt-3 hover:opacity-75 transition-opacity"
              >
                <p className="text-[10px] tracking-widest text-primary">
                  이루카가 정성스레 담은
                </p>
                <h1 className="text-base font-bold text-foreground">
                  샌드공방 레터링 스티커 저장소
                </h1>
              </button>
            </div>
          ) : (
            <div className="relative flex items-center px-10 h-24">
              {/* PC: 좌측 로고 */}
              <button
                onClick={handleLogoClick}
                className="shrink-0 hover:opacity-75 transition-opacity"
              >
                <img src={logoImg} alt="sand atelier custom lettering logo" className="h-12" />
              </button>

              {/* PC: 중앙 타이틀 */}
              <button
                onClick={handleLogoClick}
                className="absolute left-1/2 -translate-x-1/2 text-center hover:opacity-75 transition-opacity"
              >
                <p className="text-[11px] tracking-widest text-primary">
                  이루카가 정성스레 담은
                </p>
                <h1 className="text-2xl font-bold text-foreground">
                  샌드공방 레터링 스티커 저장소
                </h1>
              </button>

              {/* PC: 우측 검색 */}
              <div className="absolute right-10 w-52">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
          )}

          {/* 모바일 카테고리 탭 */}
          {isMobile && (
            <div className="flex gap-0 overflow-x-auto border-t border-border px-4 py-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="shrink-0 px-3 py-1.5 text-xs transition-colors whitespace-nowrap"
                  style={{
                    color: category === cat.id ? "var(--foreground)" : "var(--muted-foreground)",
                    fontWeight: category === cat.id ? "700" : "400",
                    borderBottom: category === cat.id ? "2px solid var(--foreground)" : "2px solid transparent",
                  }}
                >
                  {cat.label ?? cat.id}
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="flex flex-1 min-h-0">

          {/* PC 사이드바 카테고리 */}
          {!isMobile && (
            <aside className="w-44 shrink-0 border-r border-border pt-8 px-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4 px-2">
                카테고리
              </p>
              <nav className="flex flex-col gap-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className="text-left px-2 py-2 text-sm transition-colors rounded-sm"
                    style={{
                      color: category === cat.id ? "var(--foreground)" : "var(--muted-foreground)",
                      fontWeight: category === cat.id ? "700" : "400",
                    }}
                  >
                    {cat.label ?? cat.id}
                  </button>
                ))}
              </nav>
            </aside>
          )}

          {/* 메인 콘텐츠 */}
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
              {loading ? (
                <SandwichLoader />
              ) : displayImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm mt-1">다른 키워드로 검색해보세요</p>
                </div>
              ) : (
                <>
                  <MasonryGrid images={displayImages} onSelect={setSelectedSticker} />
                  {loadingMore && <SandwichLoader />}
                  <div ref={sentinelRef} className="h-4" />
                </>
              )}
            </main>

            {/* About */}
            <section className="bg-accent/30 border-t border-border">
              <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-3">
                <h2 className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
                  about sand atelier
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  welcome to sand atelier archive. since 2017, we've been crafting
                  custom lettering stickers for your most precious moments —
                  birthdays, weddings, corporate events, fandom celebrations,
                  and everything in between. every design carries our sincerity.
                  based in incheon, south korea.
                </p>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card">
              <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">
                      contact
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      <a
                        href="tel:010-2826-8402"
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        010-2826-8402
                      </a>
                      <a
                        href={KAKAO_CHAT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        kakao talk 상담
                      </a>
                      <a
                        href="https://www.instagram.com/sand_atelier_sandwich/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        sand atelier
                      </a>
                      <a
                        href="https://www.instagram.com/maisondelaitue/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        maison de laitue
                      </a>
                      <a
                        href="https://laitue.stibee.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        뉴스레터 레뛰
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.15em] text-primary font-semibold">
                      location
                    </h3>
                    <p className="text-sm text-foreground/80">
                      인천 서구 고산후로95번길 20, 힘찬프라자 304호
                    </p>
                    <a
                      href={NAVER_PLACE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      네이버 지도에서 보기
                    </a>
                  </div>
                </div>
                <div className="mt-8 pt-5 border-t border-border text-center">
                  <p className="text-[10px] text-muted-foreground">
                    © since 2017 sand atelier. all rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <div
        className="fixed flex flex-col"
        style={{ bottom: "24px", right: "20px", gap: "10px", zIndex: 50 }}
      >
        <a
          href="https://www.instagram.com/sand_atelier_sandwich/"
          target="_blank"
          rel="noopener noreferrer"
          title="sand atelier 인스타그램"
          aria-label="sand atelier 인스타그램 열기"
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.13)" }}
        >
          <Instagram className="w-5 h-5" style={{ color: "#3d7a3d" }} />
        </a>
        <a
          href="https://www.instagram.com/maisondelaitue/"
          target="_blank"
          rel="noopener noreferrer"
          title="maison de laitue 인스타그램"
          aria-label="maison de laitue 인스타그램 열기"
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.13)" }}
        >
          <Instagram className="w-5 h-5" style={{ color: "#B8924A" }} />
        </a>
        <a
          href="https://laitue.stibee.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="뉴스레터 레뛰"
          aria-label="뉴스레터 레뛰 구독 페이지 열기"
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.13)" }}
        >
          <Mail className="w-5 h-5" style={{ color: "#3d7a3d" }} />
        </a>
      </div>

      <StickerModal
        sticker={selectedSticker}
        open={!!selectedSticker}
        onClose={() => setSelectedSticker(null)}
      />
    </SidebarProvider>
  );
};

export default Index;