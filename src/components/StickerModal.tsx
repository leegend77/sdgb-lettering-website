import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { StickerImage } from "@/lib/cloudinary";
import { getFullUrl } from "@/lib/cloudinary";
import { shareDesign } from "@/lib/kakao";

interface StickerModalProps {
  sticker: StickerImage | null;
  open: boolean;
  onClose: () => void;
}

const StickerModal = ({ sticker, open, onClose }: StickerModalProps) => {
  if (!sticker) return null;

  const handleConsult = () => {
    const imageUrl = getFullUrl(sticker.public_id);
    shareDesign(imageUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] p-0 overflow-hidden rounded-2xl border-none bg-card shadow-2xl">
        <div className="relative">
          <div className="max-h-[65vh] overflow-auto p-4 flex items-center justify-center bg-muted/30">
            <img
              src={getFullUrl(sticker.public_id)}
              alt="sand atelier custom lettering sticker design — full preview"
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>
          <div className="p-4">
            <Button
              onClick={handleConsult}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              이 디자인으로 카톡상담하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StickerModal;
