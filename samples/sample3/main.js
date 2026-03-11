import { componentRegistry, updateGlobalMonitor } from './reactLite-core.js';
import { Counter } from './counter-app.js';

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

// Render
componentRegistry.renderAll();
updateGlobalMonitor();
