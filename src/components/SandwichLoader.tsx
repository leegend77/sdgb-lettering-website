const SandwichLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="animate-sandwich-spin text-4xl">🥪</div>
      <p className="text-sm text-muted-foreground animate-sandwich-bounce">
        스티커를 불러오는 중...
      </p>
    </div>
  );
};

export default SandwichLoader;
