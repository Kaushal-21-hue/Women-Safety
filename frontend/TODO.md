# Netlify Build Fix TODO

## Approved Plan Steps (Progress tracked here)

### Priority 1: Core Components (Sidebar, Footer, Navbar - most anchor errors)

- [x] 1. Fix Sidebar.jsx: Remove invalid href="#", replace nested a with Link/button
- [x] 2. Fix Footer.jsx: Fix email/address links to spans, add img alt, remove unused setAuth
- [x] 3. Fix Navbar.jsx: Replace nested a with Link, remove unused imports/vars

### Priority 2: Context & Key Pages

- [ ] 4. Fix auth.js: useEffect functional update for exhaustive-deps
- [ ] 5. Fix About.jsx: Add alt to imgs, remove unused imports
- [ ] 6. Fix Register.jsx: == to ===, add img alt
- [ ] 7. Fix Dashboard.jsx: Add rel to target=\_blank, remove unused vars

### Priority 3: Remaining Pages

- [ ] 8. Fix AboutUs2.jsx: Add alt to imgs
- [ ] 9. Fix Login.jsx: Add alt to img
- [ ] 10. Fix Features.jsx: Add alt to all feature imgs
- [ ] 11. Fix Emergency.jsx: Remove unused vars, fix useEffect deps, remove redundant role
- [ ] 12. Fix Profile.jsx: Remove unused setAuth
- [ ] 13. Fix Report.jsx: Remove unused useAuth, add alt to img

### Final Steps

- [ ] 14. Test: cd WomenSafetyWebApp/frontend && npm run build
- [ ] 15. Complete: attempt_completion

Updated after each step completion.

Current status: Starting Priority 1.
