# React Compilation Fixes TODO

## Plan Steps (Approved)

- [x] 1. Add "@babel/plugin-proposal-private-property-in-object" to frontend/package.json devDependencies
- [x] 2. Edit frontend/src/pages/Dashboard.jsx: Move hooks to top, add isAdmin state, remove unused chats/getChats/setChats, fix target="_blank" rel="noreferrer", fix header typo
- [ ] 3. Edit frontend/src/context/auth.js: Add 'auth' to useEffect deps or functional update
- [x] 4. Edit frontend/src/pages/AdminPanel.jsx: Add rel="noreferrer" to map links
- [ ] 5. Run `cd frontend && npm install` to install new dep
- [ ] 6. Restart dev server (`npm start`) and verify no errors/warnings
- [ ] 7. Test Dashboard for admin/non-admin users

Current progress: Starting step 1
