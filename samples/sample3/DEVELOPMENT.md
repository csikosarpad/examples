# ReactLite - Fejlesztési Roadmap

Egy egyszerű, React-szerű JavaScript library létrehozása a React működésének megértéséhez.

## TODO Lista

- [x] **1. Props támogatás**
  - [x] Props paraméter hozzáadása a komponensekhez
  - [x] Props átadása a rendereléskor
  - [x] Alapértelmezett értékek (default props)
  - [x] Teszt: Counter komponens propertyivel

- [x] **2. useEffect hook**
  - [x] useEffect függvény implementálása
  - [x] Dependency array támogatása
  - [x] Cleanup callback támogatása
  - [x] Lifecycle: mount, update, unmount
  - [x] Teszt: Mount és update effectek működésében

- [x] **3. Többféle komponens egy oldalon**
  - [x] Komponens registry rendszer
  - [x] Komponensek saját state-je
  - [x] Komponensek közötti izolációja
  - [x] Teszt: Három Counter komponens egyszerre

- [x] **4. Event delegation**
  - [x] Event dispatcher rendszer
  - [x] Data attributes alapú event kezelés
  - [x] Centralizált event routing
  - [x] Event objektum passing (payload, componentId)
  - [x] Nincsenek inline onclick handlers

- [x] **5. Virtual DOM koncepció (alapszintű)**
  - [x] HTML diffing megvalósítása
  - [x] Felesleges DOM frissítések elkerülése
  - [x] Performance monitoring
  - [x] Stats display az egyes komponensekben

---

## Haladás

### Jelenlegi státusz

- ✅ Alapvető useState hook
- ✅ Globális state management
- ✅ Script betöltési sorrend javítása
- ✅ Props támogatás (label, step, id)
- ✅ useEffect hook (Mount, Update, Cleanup)
- ✅ Dependency array kezelés
- ✅ **ComponentRegistry** - több komponens kezelése
- ✅ **3 független Counter komponens** - saját state-tel
- ✅ Komponensek közötti izolációja
- ✅ **Event Dispatcher** - centralizált eseménykezelés
- ✅ **Data attributes** - event routing
- ✅ **Event payload passing** - step érték átadása
- ✅ **Virtual DOM system** - HTML diffing
- ✅ **Performance monitoring** - renderelés statisztikák

---

## 🎉 REACTLITE LIBRARY - KÉSZ!

Mostmár egy teljes, React-szerű libraryvel rendelkezel, amely a React működésének alapjait demonstrálja:

### Tanult Koncepcók:

1. **State Management** (useState)
2. **Side Effects** (useEffect)
3. **Component Registry** (több komponens kezelése)
4. **Event Delegation** (centralizált eseménykezelés)
5. **Virtual DOM** (performance optimizáció)

### Következő lépések (opcionális fejlesztések):

- 🔹 **useContext** - globális state megosztás
- 🔹 **useReducer** - komplexebb state logika
- 🔹 **Komponens Composability** - komponensek egymásban
- 🔹 **Teleportation** - HTML renderelés más helyre
- 🔹 **Suspense** - aszinkron komponensek

👉 **useEffect hook**
