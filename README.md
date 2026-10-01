# Aurelia

A portfolio site for Aurelia, a fictional boutique hotel above the harbor at Cala Vespera. Guests can browse six rooms, choose dates, see the stay price, register, and save a booking in the browser.

There is no database and no auth provider. Registrations and bookings stay in `localStorage` on this machine.

A basic-command assistant is the next phase.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Scripts

- `npm run dev` — development server on port 43123
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Rooms

Standard, Queen, King, Deluxe, Suite, and Presidential Suite. Rates are per room, per night, in euros, taxes included.
