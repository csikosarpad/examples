// ==========================================
// === EVENT DELEGATION SYSTEM ===
// ==========================================

class EventDispatcher {
  constructor() {
    this.handlers = new Map();
    this.setup();
  }

  // Eseménykezelő regisztrálása
  on(eventKey, handler) {
    this.handlers.set(eventKey, handler);
  }

  // Eseménykezelő eltávolítása
  off(eventKey) {
    this.handlers.delete(eventKey);
  }

  // Globális event listener beállítása
  setup() {
    document.addEventListener('click', (event) => {
      const clickTarget = event.target.closest('[data-event]') || event.target;

      if (!clickTarget) return;

      const eventKey = clickTarget.dataset.event;
      const handler = this.handlers.get(eventKey);

      if (handler) {
        // Event objektum passing
        handler({
          event,
          clickTarget,
          payload: clickTarget.dataset.payload || null,
          componentId: clickTarget.dataset.componentId || null,
        });
      } else {
        console.warn(`⚠️ Event handler nem található: "${eventKey}"`);
      }
    });

    console.log('✅ Event delegation system inicializálva');
  }
}

const eventDispatcher = new EventDispatcher();

// ==========================================
// === VIRTUAL DOM SYSTEM ===
// ==========================================

class VirtualDOM {
  constructor() {
    this.componentCache = new Map(); // Komponensenként külön cache
    this.componentStats = new Map(); // Komponensenként külön statisztika
    this.globalStats = {
      renderCount: 0,
      domUpdates: 0,
      skippedUpdates: 0,
    };
  }

  domEqual(nodeA, nodeB) {
    if (nodeA.nodeType !== nodeB.nodeType) return false;

    if (nodeA.nodeType === Node.TEXT_NODE) {
      return nodeA.textContent.trim() === nodeB.textContent.trim();
    }

    if (nodeA.tagName !== nodeB.tagName) return false;

    // attribútumok összehasonlítása
    const attrsA = nodeA.attributes;
    const attrsB = nodeB.attributes;
    if (attrsA.length !== attrsB.length) return false;

    for (let i = 0; i < attrsA.length; i++) {
      const a = attrsA[i];
      const b = attrsB.getNamedItem(a.name);
      if (!b || a.value !== b.value) return false;
    }

    // gyerekek összehasonlítása
    if (nodeA.childNodes.length !== nodeB.childNodes.length) return false;

    for (let i = 0; i < nodeA.childNodes.length; i++) {
      if (!this.domEqual(nodeA.childNodes[i], nodeB.childNodes[i])) {
        return false;
      }
    }

    return true;
  }

  // HTML diffing - komponensenként külön tároljuk az HTML-t

  hasChanged(componentId, newHTML) {
    const oldHTML = this.componentCache.get(componentId);

    if (!oldHTML) {
      this.componentCache.set(componentId, newHTML);
      return true;
    }

    const oldDOM = new DOMParser().parseFromString(oldHTML, 'text/html').body;
    const newDOM = new DOMParser().parseFromString(newHTML, 'text/html').body;

    const changed = !this.domEqual(oldDOM, newDOM);

    if (changed) {
      this.componentCache.set(componentId, newHTML);
    }

    return changed;
  }

  // DOM frissítés - explicit rootSelector alapján
  updateDOM(componentId, newHTML, rootSelector) {
    // Komponens-specifikus statisztikák inicializálása
    if (!this.componentStats.has(componentId)) {
      this.componentStats.set(componentId, {
        renderCount: 0,
        domUpdates: 0,
        skippedUpdates: 0,
      });
    }

    const compStats = this.componentStats.get(componentId);
    compStats.renderCount++;
    this.globalStats.renderCount++;

    if (this.hasChanged(componentId, newHTML)) {
      // HTML megváltozott - DOM frissítés szükséges
      const root = document.querySelector(rootSelector);
      if (root) {
        root.innerHTML = newHTML;
        compStats.domUpdates++;
        this.globalStats.domUpdates++;
        console.log(`🔄 DOM frissítve: #${componentId} (${rootSelector})`);
      } else {
        console.warn(`⚠️ Root elem nem található: ${rootSelector}`);
      }
    } else {
      // HTML nem változott - optimizáció
      compStats.skippedUpdates++;
      this.globalStats.skippedUpdates++;
      console.log(
        `⏭️  DOM frissítés kihagyva: #${componentId} (HTML nem változott)`,
      );
    }
  }

  // Komponens-specifikus statisztikák lekérdezése
  getStats(componentId) {
    const compStats = this.componentStats.get(componentId) || {
      renderCount: 0,
      domUpdates: 0,
      skippedUpdates: 0,
    };
    return {
      ...compStats,
      efficiency:
        compStats.renderCount > 0
          ? ((compStats.skippedUpdates / compStats.renderCount) * 100).toFixed(
              1,
            ) + '%'
          : 'N/A',
    };
  }

  // Globális statisztikák lekérdezése
  getGlobalStats() {
    return {
      ...this.globalStats,
      efficiency:
        this.globalStats.renderCount > 0
          ? (
              (this.globalStats.skippedUpdates / this.globalStats.renderCount) *
              100
            ).toFixed(1) + '%'
          : 'N/A',
    };
  }

  // Statisztikák alaphelyzetbe állítása
  resetStats() {
    this.componentStats.clear();
    this.globalStats = {
      renderCount: 0,
      domUpdates: 0,
      skippedUpdates: 0,
    };
  }

  // Debug: Cache tartalmának megtekintése
  getCache() {
    return Object.fromEntries(this.componentCache);
  }
}

const virtualDOM = new VirtualDOM();

// Globális monitor frissítése
function updateGlobalMonitor() {
  const globalStats = virtualDOM.getGlobalStats();
  const monitor = document.getElementById('global-monitor');

  if (monitor) {
    monitor.innerHTML = `
<div style="border: 1px solid #333; padding: 15px; margin: 10px; border-radius: 5px; background-color: #005500;">
  <h3 style="margin-top: 0;">⚙️ Globális Virtual DOM Statisztikák</h3>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 12px;">
    <div><strong>📈 Össz. Renderelések:</strong> ${globalStats.renderCount}</div>
    <div><strong>🔄 Össz. DOM Frissítések:</strong> ${globalStats.domUpdates}</div>
    <div><strong>⏭️  Kihagyott Frissítések:</strong> ${globalStats.skippedUpdates}</div>
    <div><strong>💾 Hatékonyság:</strong> ${globalStats.efficiency}</div>
  </div>
</div>`;
  }
}

// Komponens registry - több komponens kezelése
class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.currentComponentId = null;
  }

  register(id, component, rootSelector, props = {}) {
    this.components.set(id, {
      component,
      rootSelector,
      props,
      state: [],
      stateIndex: 0,
      effects: [],
      effectIndex: 0,
    });
  }

  setActive(id) {
    this.currentComponentId = id;
  }

  getActive() {
    return this.components.get(this.currentComponentId);
  }

  renderOne(id) {
    const comp = this.components.get(id);
    if (!comp) return;

    this.setActive(id);
    comp.stateIndex = 0;
    comp.effectIndex = 0;

    // Komponens renderelése
    const newHTML = comp.component(comp.props);

    // Virtual DOM diffing - csak ha szükséges frissít
    virtualDOM.updateDOM(id, newHTML, comp.rootSelector);
  }

  renderAll() {
    this.components.forEach((comp, id) => {
      this.renderOne(id);
    });
  }
}

const componentRegistry = new ComponentRegistry();

// Egyszerű állapotkezelés (Hook)
function useState(initial) {
  const comp = componentRegistry.getActive();
  const currentIndex = comp.stateIndex;
  comp.state[currentIndex] = comp.state[currentIndex] ?? initial;

  function setState(newValue) {
    comp.state[currentIndex] = newValue;
    componentRegistry.renderAll(); // újrarenderelés
  }

  comp.stateIndex++;
  return [comp.state[currentIndex], setState];
}

// useEffect hook implementáció
function useEffect(callback, dependencies = null) {
  const comp = componentRegistry.getActive();
  const currentEffectIndex = comp.effectIndex;

  // Az effect még nem létezik vagy az függőségek megváltoztak
  const shouldRun =
    !comp.effects[currentEffectIndex] ||
    hasDependenciesChanged(comp.effects[currentEffectIndex].deps, dependencies);

  if (shouldRun) {
    // Cleanup callback hívása, ha már volt hatás
    if (
      comp.effects[currentEffectIndex] &&
      comp.effects[currentEffectIndex].cleanup
    ) {
      comp.effects[currentEffectIndex].cleanup();
    }

    // Új effect futtatása
    const cleanup = callback();
    comp.effects[currentEffectIndex] = {
      cleanup: typeof cleanup === 'function' ? cleanup : null,
      deps: dependencies,
    };
  }

  comp.effectIndex++;
}

// Dependenciák összehasonlítása
function hasDependenciesChanged(oldDeps, newDeps) {
  if (oldDeps === null || newDeps === null) return true;
  if (oldDeps.length !== newDeps.length) return true;

  return oldDeps.some((dep, i) => dep !== newDeps[i]);
}

// ==========================================
// === KOMPONENS DEFINIÁLÁS ===
// ==========================================

// Reusable Counter komponens (Props-al paraméterezhető)
function Counter(props = {}) {
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
// === INICIALIZÁCIÓS KÓDOK ===
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

// Összes komponens inicialis renderelése
componentRegistry.renderAll();

// Globális monitor inicializálása
updateGlobalMonitor();
