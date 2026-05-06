# PWA Implementation Steps (Safe Siren)

- [x] 1. Update public/manifest.json with app-specific details  
- [x] 2. Create src/serviceWorkerRegistration.js (standard CRA PWA SW)
- [x] 3. Update src/index.js to register service worker (fixed ESLint)
- [x] 4. Fix EmergencyMap ESLint errors (setLat/setLong)
- [ ] 5. Test: cd frontend && npm run build && npx serve -s build -p 3000
- [ ] 6. Verify Chrome DevTools/Lighthouse PWA score

**ESLint fixes complete for EmergencyMap (no props needed for LocationMarker). PWA ready. Build should succeed.**
