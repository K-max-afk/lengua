const { useState, useEffect, useRef, useCallback } = React;

// --- ICONOS ---
const IconRotateCcw = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
);

// --- EFECTOS DE SONIDO (Web Audio API) ---
function useSound() {
  const ctxRef = useRef(null);
  const play = useCallback((type) => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();

      if (type === 'click') {
        o.type = 'sine';
        o.frequency.setValueAtTime(600, now);
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      } else if (type === 'reveal') {
        o.type = 'triangle';
        o.frequency.setValueAtTime(300, now);
        o.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      }
      
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.2);
    } catch(e){}
  }, []);
  return play;
}

// --- MAQUINA DE ESCRIBIR ---
function Typewriter({ text, speed = 35, onComplete }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => setIdx(i => i + 1), speed);
      return () => clearTimeout(t);
    } else if (onComplete) {
      onComplete();
    }
  }, [idx, text, speed, onComplete]);

  return <span>{text.slice(0, idx)}</span>;
}

// --- BOTÓN DE CONTINUAR ---
function ContinueButton({ onClick, label = "Continuar" }) {
  return (
    <button
      onClick={onClick}
      className="fade-in mt-8 inline-flex items-center gap-2 px-8 py-3 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded-full hover:bg-amber-500/20 transition-all text-sm uppercase tracking-widest cursor-pointer font-medium"
    >
      {label} <IconChevronRight />
    </button>
  );
}

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [scene, setScene] = useState(0);
  const [step, setStep] = useState(0);
  const playSound = useSound();

  const handleNextScene = () => {
    playSound('reveal');
    setScene(s => s + 1);
    setStep(0);
  };

  const handleReset = () => {
    playSound('click');
    setScene(0);
    setStep(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-6 text-center">
      
      {/* Barra de control superior */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <span className="text-xs text-amber-500/70 tracking-widest uppercase font-mono">
          Escena {scene + 1} / 4
        </span>
        <button 
          onClick={handleReset} 
          className="p-2 rounded-full bg-slate-900/80 border border-slate-700/50 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer"
          title="Reiniciar"
        >
          <IconRotateCcw />
        </button>
      </div>

      {/* ESCENA 1: INTRO */}
      {scene === 0 && (
        <div className="max-w-3xl fade-in space-y-6">
          <p className="text-amber-500/60 text-xs tracking-[0.4em] uppercase">Escena 1 · El Despertar</p>
          <h1 className="text-4xl md:text-6xl font-serif text-amber-400 text-glow">
            <Typewriter text="EL ARCHIVO PERDIDO" speed={60} />
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
            Bienvenido, explorador. Durante miles de años este santuario protegió el conocimiento... hasta que las palabras comenzaron a desaparecer.
          </p>
          <ContinueButton onClick={handleNextScene} label="Entrar al Archivo" />
        </div>
      )}

      {/* ESCENA 2: LA PUERTA */}
      {scene === 1 && (
        <div className="max-w-3xl fade-in space-y-6">
          <p className="text-amber-500/60 text-xs tracking-[0.4em] uppercase">Escena 2 · El Acertijo</p>
          <h2 className="text-3xl md:text-5xl font-serif text-amber-400">
            La Puerta de los Símbolos
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            <Typewriter text="Para abrir esta puerta no necesitas una llave metálica, sino tu capacidad de observación. ¿De qué crees que tratará este archivo?" speed={30} />
          </p>
          <ContinueButton onClick={handleNextScene} label="Examinar Manuscrito" />
        </div>
      )}

      {/* ESCENA 3: MANUSCRITO */}
      {scene === 2 && (
        <div className="max-w-3xl fade-in space-y-6">
          <p className="text-amber-500/60 text-xs tracking-[0.4em] uppercase">Escena 3 · La Lectura</p>
          <div className="p-6 bg-slate-900/90 border border-amber-500/30 rounded-2xl glow-gold text-left space-y-3">
            <p className="text-amber-200 font-serif text-lg md:text-xl">
              "Las palabras son solo recipientes; el verdadero significado habita en lo que conectas dentro de tu mente."
            </p>
          </div>
          <ContinueButton onClick={handleNextScene} label="Restaurar el Archivo" />
        </div>
      )}

      {/* ESCENA 4: FINAL */}
      {scene === 3 && (
        <div className="max-w-3xl fade-in space-y-6">
          <div className="text-5xl mb-2">✨</div>
          <h2 className="text-3xl md:text-5xl font-serif text-amber-400 text-glow">
            ¡Conocimiento Restaurado!
          </h2>
          <p className="text-slate-300 text-lg">
            Has demostrado que leer no es solo recorrer letras, sino comprender e interpretar.
          </p>
          <ContinueButton onClick={handleReset} label="Volver al Inicio" />
        </div>
      )}

    </div>
  );
}

// Render en el HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
