# Aurelia

A portfolio site for Aurelia, a fictional boutique hotel above the harbor at Cala Vespera. Guests can browse six room types, choose dates, see the stay price, register, and save a booking in the browser.

There is no database and no auth provider. Registrations and bookings stay in `localStorage` on this machine.

Public site: [https://rdmrcn.github.io/HotelManagment-WebAPI/](https://rdmrcn.github.io/HotelManagment-WebAPI/)

The Ask page answers a short list of commands: the six nightly prices, how a stay total is calculated, how to register and confirm a booking, and the fact that accounts and bookings stay in this browser. It does not call an external service.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123/HotelManagment-WebAPI/](http://127.0.0.1:43123/HotelManagment-WebAPI/). The app is published from this repository, so local and GitHub Pages both use the `/HotelManagment-WebAPI` base path.

## Scripts

- `npm run dev` — development server on port 43123
- `npm run build` — static export to `out/` (used by GitHub Pages)
- `npm run lint` — ESLint

## Rooms

Standard, Queen, King, Deluxe, Suite, and Presidential Suite. Rates are per room, per night, in euros, taxes included.
