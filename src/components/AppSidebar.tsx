import { Globe } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppSidebarProps {
  activeCategory: CategoryId;
  onCategoryChange: (id: CategoryId) => void;
}

export function AppSidebar({
  activeCategory,
  onCategoryChange,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarContent className="pt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground px-3">
              카테고리
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {CATEGORIES.map((cat) => (
                  <SidebarMenuItem key={cat.id}>
                    <SidebarMenuButton
                      onClick={() => onCategoryChange(cat.id)}
                      isActive={activeCategory === cat.id}
                      className={cn(
                        "flex flex-col items-start gap-0 py-2.5 px-3 rounded-lg transition-colors h-auto",
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-sidebar-accent"
                      )}
                    >
                      <span className="text-xs font-medium leading-tight">
                        {cat.label}
                      </span>
                      {!collapsed && (
                        <span
                          className={cn(
                            "text-[10px] leading-tight mt-0.5",
                            activeCategory === cat.id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {cat.labelEn}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span className="text-xs">english guide</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* English Guide Modal */}
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-primary">
              global ordering guide
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              welcome to sand atelier! we craft custom lettering stickers 
              for every occasion — birthdays, weddings, corporate events, 
              fandom support, and more.
            </p>
            <p>
              ordering from overseas? feel free to contact us via kakao talk
              for customized lettering and catering services. we deliver
              sincerity in every bite and every word.
            </p>
            <p>
              based in incheon, south korea. since 2017.
            </p>
            <a
              href="https://pf.kakao.com/_ZaNaxl/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              contact via kakao talk
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
