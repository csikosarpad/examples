import {
  eventDispatcher,
  componentRegistry,
  virtualDOM,
  useState,
  useEffect,
  updateGlobalMonitor,
} from './reactLite-core.js';

// ==========================================
// === COUNTER APP - ALKALMAZÁS LOGIKA ===
// ==========================================
// Ez a fájl a Counter komponenst és az alkalmazás specifikus logikát tartalmazza

// ==========================================
// === KOMPONENS DEFINIÁLÁS ===
// ==========================================

// Reusable Counter komponens (Props-al paraméterezhető)
export function Counter(props = {}) {
  const { label = 'Számláló', step = 1, id = 'unknown' } = props;
  const [count, setCount] = useState(0);

  // Mount effect
  useEffect(() => {
    console.log(`📌 Counter #${id} felcsatolódott`);

    return () => {
      console.log(`📌 Counter #${id} eltávolítódott`);
    };
  }, []);

  // Update effect
  useEffect(() => {
    console.log(`📊 Counter #${id} számlálója: ${count}`);
  }, [count]);

  // Komponens-specifikus statisztikák
  const stats = virtualDOM.getStats(id);

  return `
<div style="border: 1px solid #ddd; padding: 10px; margin: 10px; border-radius: 5px;">
    <h2>${label} #${id}: <strong>${count}</strong></h2>
    <button data-event="counter.increment" data-component-id="${id}" data-payload="${step}">
      +${step}
    </button>
    <button data-event="counter.decrement" data-component-id="${id}" data-payload="${step}">
      -${step}
    </button>
    <p style="font-size: 12px;">💾 Komponens ID: ${id}</p>
    
    <div style="padding: 8px; border-radius: 3px; margin-top: 10px; font-size: 11px;">
      <strong>📊 Komponens Stats:</strong><br>
      📈 Renderelések: ${stats.renderCount}<br>
      🔄 DOM frissítések: ${stats.domUpdates}
    </div>
</div>`;
}

// ==========================================
// === EVENT HANDLEREK ===
// ==========================================

// Counter increment handler
eventDispatcher.on('counter.increment', ({ componentId, payload }) => {
  const comp = componentRegistry.components.get(componentId);
  if (comp) {
    const step = parseInt(payload) || 1;
    comp.state[0] += step;
    console.log(
      `➕ Counter #${componentId} inkrementálva: ${step} lépéscsővel`,
    );
    componentRegistry.renderOne(componentId);
    updateGlobalMonitor();
  }
});

// Counter decrement handler
eventDispatcher.on('counter.decrement', ({ componentId, payload }) => {
  const comp = componentRegistry.components.get(componentId);
  if (comp) {
    const step = parseInt(payload) || 1;
    comp.state[0] -= step;
    console.log(
      `➖ Counter #${componentId} dekrementálva: ${step} lépéscsővel`,
    );
    componentRegistry.renderOne(componentId);
    updateGlobalMonitor();
  }
});

// ==========================================
// === ALKALMAZÁS INICIALIZÁCIÓJA ===
// ==========================================

// Komponensek regisztrálása
componentRegistry.register('counter1', Counter, '#root1', {
  label: 'Alacsony szintű számláló',
  step: 1,
  id: 'counter1',
});

componentRegistry.register('counter2', Counter, '#root2', {
  label: 'Magas szintű számláló',
  step: 5,
  id: 'counter2',
});

componentRegistry.register('counter3', Counter, '#root3', {
  label: 'Nagy lépcsős számláló',
  step: 10,
  id: 'counter3',
});

console.log('✅ Counter App inicializálva');
