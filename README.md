# Gemini Frontend Clone (Kuvaka Tech assignment)
This repository contains a Next.js 15 app that simulates a Gemini-style conversational AI chat experience. It implements OTP login, chatroom management, simulated AI messaging, image upload, and a number of modern UX features.

## Live demo
- If deployed, include your Vercel/Netlify URL here.
## Quick start
1. Install dependencies:
```powershell
npm install
```
- If the above command fails, then run this command : 
```powershell
npm install --legacy-peer-deps
```
2. Run the dev server:
```powershell
npm run dev
```
3. Open http://localhost:3000 in your browser.
## Features implemented
- OTP login flow (simulated): phone entry + OTP verification using `setTimeout`.
- Country code picker fetching data from REST Countries API (`restcountries.com`).
- OTP form validation: React Hook Form + Zod.
- Dashboard with chatroom list, create/delete functionality and toast confirmations.
- Chat UI with user and simulated AI messages, timestamps, typing indicator, and simulated AI replies with throttling.
- Auto-scroll to latest message. Latest messages appear at the bottom.
- Reverse infinite scroll: simulated pagination (20 messages per page) and ability to load older messages as you scroll up.
- Image upload with local preview (using Object URLs) and validation (type and size).
- Copy-to-clipboard on message hover with toast feedback.
- Mobile responsive and a dark mode toggle.
- Debounced search (sidebar) to filter chatrooms.
- Persistent state using `localStorage` for auth, chatRooms, and messages.
- Loading skeletons for chat area while messages load.
- Keyboard accessibility for chatroom selection (tab + Enter/Space), search input has `aria-label`.
- Toast notifications implemented using `react-hot-toast`.

## Implementation notes

### Throttling AI responses

`src/hooks/useChat.ts` uses a `throttleRef` with `setTimeout` and `clearTimeout`. When a user sends a message, previous scheduled AI responses are cleared and a new delayed response is scheduled (2-3s). This simulates AI "thinking" and avoids overlapping responses.

### Message pagination & reverse infinite scroll

Messages are stored in `localStorage` grouped by `chatRoomId` arrays. The app simulates pagination by slicing the stored array in `useChat.loadMessages` using page size 20. When scrolling near the top, the app requests the next page (older messages) and dispatches `addOlderMessages` which prepends older messages to the existing message list so chronology is preserved.

Message arrays are normalized to chronological order (oldest -> newest) on load to avoid reversed ordering issues.

### Form validation

All key forms use React Hook Form + Zod schemas defined in `src/lib/validation.ts` (phone validation, OTP, chatroom title, message content).

### Accessibility & keyboard

Chat room items are focusable (`tabIndex=0`) and selectable via Enter/Space. Search input uses `aria-label`. Messages container includes `role="log"` and `aria-live="polite"` for screen readers.

### LocalStorage & serializability

To keep Redux serializable, timestamps are stored as ISO strings (`new Date().toISOString()`). Types accept `string | Date` to be permissive; UI components convert strings to `Date` for formatting when necessary.

### Image upload

Image upload uses `URL.createObjectURL` for previews and validates file size (5MB) and MIME type. Previews are revoked on removal.

## Folder structure (key files)

```powershell
src/
├── app/
│   ├── chat/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── OTPVerification.tsx
│   ├── chat/
│   │   ├── ChatRoom.tsx
│   │   ├── Message.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── dashboard/
│   │   ├── ChatRoomList.tsx
│   │   ├── CreateChatRoom.tsx
│   │   └── SearchBar.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   └── ui/
│       ├── ConfirmModal.tsx
│       ├── LoadingSkeleton.tsx
│       ├── ThemeToggle.tsx
│       └── Toaster.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useToast.ts
├── lib/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── chatSlice.ts
│   ├── storage.ts
│   ├── store.ts
│   └── validation.ts
└── types/
    ├── index.ts
    └── next.d.ts
```

- `src/app/` - top-level app routes and layout
- `src/components/` - reusable components (chat, auth, layout, ui)
- `src/hooks/` - custom hooks (`useChat`, `useAuth`, `useDebounce`, `useLocalStorage`, `useToast`)
- `src/lib/` - store, slices, validation, utilities
- `src/types/` - TypeScript types

## Deployment

1. Push to GitHub and connect to Vercel (recommended) or Netlify.
2. On Vercel, import the repository and the default settings will work for Next.js App Router.

## Remaining / optional improvements

- Convert all timestamp types to strict `string` in types (simpler and more consistent). Currently types accept `string | Date` for gradual migration.
- Add automated tests for UI flows (React Testing Library) and unit tests for hooks.
- E2E tests via Playwright to validate keyboard flows and message behaviors.
- Cleaning up and compressing stored messages for a production-ready app.

## Notes

This project is intentionally client-side and simulates backend actions (OTP, AI replies) for assignment/demo purposes. No real OTP or AI services are integrated.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).