import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gift, Plus, Trash2, Play, Settings, X, ChevronLeft, ChevronRight, Upload, Maximize, Minimize, Download } from "lucide-react";
import christmasBackground from "@/assets/christmas-background.jpg";
// Build the jingle list dynamically from the sounds folder
// This prevents build errors if individual files are added/removed.
const soundModules = import.meta.glob("@/assets/sounds/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Disable in-app pop-up notifications (toast no-op)
const toast = (..._args: unknown[]) => {};

const JINGLE_SOUNDS: string[] = Object.values(soundModules);

const Snowflake = ({ delay }: { delay: number }) => (
  <div
    className="absolute text-white/80 animate-fall pointer-events-none"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      fontSize: `${Math.random() * 10 + 10}px`,
    }}
  >
    ❄
  </div>
);

export const ChristmasGiftGenerator = () => {
  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [spinningName, setSpinningName] = useState("");
  const [audio] = useState(() => new Audio());
  const [showSetup, setShowSetup] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const NAMES_STORAGE_KEY = "christmas_gift_generator_names_v1";

  useEffect(() => {
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audio]);

  // Load saved names on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NAMES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((s: unknown) => String(s).trim()).filter(Boolean);
          setNames(Array.from(new Set(normalized)));
        }
      }
    } catch (e) {
      console.log("Failed to load saved names", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist names whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(names));
    } catch (e) {
      console.log("Failed to persist names", e);
    }
  }, [names]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const playRandomJingle = () => {
    const randomJingle = JINGLE_SOUNDS[Math.floor(Math.random() * JINGLE_SOUNDS.length)];
    audio.src = randomJingle;
    audio.play().catch(err => console.log("Audio play failed:", err));
  };

  const addName = () => {
    if (currentName.trim() && !names.includes(currentName.trim())) {
      setNames([...names, currentName.trim()]);
      setCurrentName("");
      toast({
        title: "Name hinzugefügt!",
        description: `${currentName.trim()} wurde zur Liste hinzugefügt.`,
      });
    }
  };

  const removeName = (nameToRemove: string) => {
    setNames(names.filter(name => name !== nameToRemove));
    toast({
      title: "Name entfernt",
      description: `${nameToRemove} wurde aus der Liste entfernt.`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast({
        title: "Bilder hinzugefügt!",
        description: `${files.length} Bild(er) zur Diashow hinzugefügt.`,
      });
    }
  };

  const exportNames = () => {
    try {
      const blob = new Blob([JSON.stringify(names, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "names.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.log("Failed to export names", e);
    }
  };

  const importNamesFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            const normalized = data.map((s) => String(s).trim()).filter(Boolean);
            const merged = Array.from(new Set([...names, ...normalized]));
            setNames(merged);
          }
        } catch (err) {
          console.log("Invalid names file", err);
        }
      })
      .finally(() => {
        // reset input to allow re-importing same file
        e.target.value = "";
      });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const startSelection = () => {
    if (names.length === 0) {
      toast({
        title: "Keine Namen vorhanden",
        description: "Bitte füge mindestens einen Namen hinzu.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setSelectedName("");
    playRandomJingle();

    let iterations = 0;
    const SPIN_STEP_MS = 120; // time between name swaps
    const SPIN_TOTAL_MS = 6000; // total spin duration
    const maxIterations = Math.ceil(SPIN_TOTAL_MS / SPIN_STEP_MS);
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setSpinningName(randomName);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalName = names[Math.floor(Math.random() * names.length)];
        setSelectedName(finalName);
        setIsSpinning(false);
        audio.pause();
        setNames((prev) => prev.filter((n) => n !== finalName));
        
        toast({
          title: "🎁 Gewinner ausgewählt!",
          description: `${finalName} verteilt die Geschenke!`,
        });
      }
    }, SPIN_STEP_MS);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const togglePresentationMode = () => {
    if (!isPresentationMode) {
      // Enter presentation mode
      setIsPresentationMode(true);
      setShowSetup(false);
      // Try to enter fullscreen
      document.documentElement.requestFullscreen?.().catch(err => {
        console.log("Fullscreen not supported:", err);
      });
    } else {
      // Exit presentation mode
      setIsPresentationMode(false);
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${christmasBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Snowflakes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Snowflake key={i} delay={i * 0.5} />
      ))}

      <div className={`relative z-10 mx-auto py-8 px-4 ${isPresentationMode ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Header */}
        {!isPresentationMode && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Gift className="w-16 h-16 text-accent animate-bounce-subtle drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
              <h1 className="text-6xl md:text-7xl font-bold font-christmas text-white drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]">
                Weihnachts-Geschenke-Generator
              </h1>
              <Gift className="w-16 h-16 text-accent animate-bounce-subtle drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
            </div>
            <p className="text-white/90 text-2xl font-elegant drop-shadow-lg">
              Wer verteilt die Geschenke? 🎅
            </p>
          </div>
        )}

        {/* Control Buttons */}
        {!isPresentationMode && (
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setShowSetup(!showSetup)}
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-2 border-white/30 shadow-xl"
            >
              {showSetup ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Setup ausblenden
                </>
              ) : (
                <>
                  <Settings className="w-5 h-5 mr-2" />
                  Setup anzeigen
                </>
              )}
            </Button>
            <Button
              onClick={togglePresentationMode}
              variant="secondary"
              size="lg"
              className="bg-accent/80 hover:bg-accent text-foreground backdrop-blur-md border-2 border-accent shadow-xl font-semibold"
            >
              <Maximize className="w-5 h-5 mr-2" />
              Präsentationsmodus
            </Button>
          </div>
        )}

        {/* Exit Presentation Mode Button */}
        {isPresentationMode && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={togglePresentationMode}
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-2 border-white/30 shadow-xl"
            >
              <Minimize className="w-5 h-5 mr-2" />
              Beenden
            </Button>
          </div>
        )}

        {/* Setup Section (Collapsible) */}
        {showSetup && (
          <div className="space-y-6 mb-8 animate-scale-in">
            {/* Name Input */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-accent/50">
              <h2 className="text-2xl font-elegant text-primary mb-4 font-bold">Namen hinzufügen</h2>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Name eingeben..."
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addName()}
                  className="text-lg border-2 border-primary/50 focus:border-primary bg-white text-card-foreground font-body placeholder:text-muted-foreground"
                />
                <Button
                  onClick={addName}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-festive transition-all text-white font-semibold"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Hinzufügen
                </Button>
              </div>

              {/* Import/Export controls for names */}
              <div className="flex gap-3 mt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={exportNames}
                  className="bg-white/80 text-primary border-2 border-primary/30 hover:bg-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportieren
                </Button>
                <label>
                  <input
                    id="names-import-input"
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={importNamesFromFile}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-white/80 text-primary border-2 border-primary/30 hover:bg-white"
                    onClick={() => (document.getElementById('names-import-input') as HTMLInputElement | null)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importieren
                  </Button>
                </label>
              </div>

              {names.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-primary mb-3 font-elegant text-lg">
                    Santas and Ms Claus ({names.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {names.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/80 hover:bg-white transition-all animate-scale-in border-2 border-primary/30 shadow-sm"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="font-medium text-card-foreground font-body text-base">{name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeName(name)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Image Upload */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-accent/50">
              <h2 className="text-2xl font-elegant text-primary mb-4 font-bold">Bilder für Diashow</h2>
              <div className="flex gap-3 mb-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-input"
                  />
                  <Button
                    type="button"
                    onClick={() => (document.getElementById('image-upload-input') as HTMLInputElement | null)?.click()}
                    className="w-full bg-gradient-to-r from-secondary to-secondary/80"
                    size="lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Bilder hochladen
                  </Button>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-20 object-cover rounded border-2 border-primary/30"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Start Button */}
        <div className={`text-center mb-8 ${isPresentationMode ? 'mt-8' : ''}`}>
          <Button
            onClick={startSelection}
            disabled={isSpinning || names.length === 0}
            size="lg"
            className={`bg-gradient-to-r from-accent to-accent/80 hover:shadow-gold text-foreground transition-all font-christmas shadow-2xl ${
              isPresentationMode ? 'text-3xl px-20 py-10' : 'text-2xl px-16 py-8'
            } animate-glow`}
          >
            <Play className={`mr-3 ${isPresentationMode ? 'w-10 h-10' : 'w-8 h-8'}`} />
            {isSpinning ? "Wird ausgewählt..." : "Auswahl starten"}
          </Button>
        </div>

        {/* Main Display with Picture Frame */}
        <div className="relative animate-scale-in">
          {/* Ornate Picture Frame */}
          <div className={`relative mx-auto ${isPresentationMode ? 'max-w-7xl' : 'max-w-4xl'}`}>
            {/* Frame Border - Multiple Layers for Ornate Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 rounded-lg shadow-2xl transform -rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-700 rounded-lg shadow-2xl transform rotate-1" />
            
            {/* Main Frame */}
            <div className="relative bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 p-8 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              {/* Inner Frame Detail */}
              <div className="absolute inset-6 border-4 border-amber-900/50 rounded pointer-events-none" />
              <div className="absolute inset-8 border-2 border-amber-400/30 rounded pointer-events-none" />
              
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-accent rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-accent rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-accent rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-accent rounded-br-lg" />

              {/* Content Area */}
              <Card className={`relative flex items-center justify-center bg-gradient-to-br from-white via-amber-50 to-white shadow-inner overflow-hidden ${
                isPresentationMode ? 'min-h-[85vh]' : 'min-h-[500px]'
              }`}>
                {/* Background Image Slideshow - Always visible when images exist */}
                {images.length > 0 && (
                  <div className="absolute inset-0">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ))}
                    
                    {/* Slideshow Controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-white scale-125'
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Overlay for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}

                {/* Winner Display */}
                <div className="relative z-10 text-center p-12">
                  {isSpinning ? (
                    <div className="animate-pulse">
                      <div className="text-8xl font-bold text-primary mb-6 animate-bounce-subtle font-christmas drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
                        {spinningName}
                      </div>
                      <div className="text-3xl text-primary/80 font-elegant font-semibold">
                        Wird ausgewählt...
                      </div>
                    </div>
                  ) : selectedName ? (
                    <div className="animate-scale-in">
                      <div className="text-9xl mb-8 animate-spin-slow drop-shadow-2xl">🎁</div>
                      <div className="text-7xl font-bold text-primary mb-6 font-christmas drop-shadow-[0_4px_20px_rgba(220,38,38,0.6)]">
                        {selectedName}
                      </div>
                      <div className="text-4xl text-primary font-semibold font-elegant drop-shadow-lg">
                        verteilt die Geschenke! 🎅
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center ${images.length > 0 ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]' : 'text-muted-foreground'}`}>
                      <Gift className="w-32 h-32 mx-auto mb-8 opacity-80" />
                      <p className="text-3xl font-elegant">
                        {images.length > 0 
                          ? "Klicke auf 'Auswahl starten' um zu beginnen"
                          : "Füge Namen und Bilder hinzu, dann starte die Auswahl"}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!isPresentationMode && (
          <div className="text-center mt-8 text-white/90 animate-fade-in font-elegant text-xl drop-shadow-lg">
            <p>✨ Frohe Weihnachten! 🎄✨</p>
          </div>
        )}
      </div>

      {/* CSS for snowflake animation */}
      <style>{`
        @keyframes fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            top: 100%;
            transform: translateX(100px) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
          animation-duration: ${Math.random() * 3 + 5}s;
        }
      `}</style>
    </div>
  );
};
