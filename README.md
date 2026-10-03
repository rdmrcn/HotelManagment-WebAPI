# Bosfor Hotels

A portfolio site for Bosfor Hotels, a fictional house hotel on the Bosphorus in Istanbul, on the Bebek waterfront. Bosfor is the strait: Bosphorus, Boğaz. Guests can browse eight room types, choose dates, see the stay price, register, and save a booking in the browser.

There is no database and no auth provider. Registrations and bookings stay in `localStorage` on this machine (`bosfor-hotels.*`). Confirmation codes start with `BOS-`.

Public site: [https://rdmrcn.github.io/HotelManagment-WebAPI/](https://rdmrcn.github.io/HotelManagment-WebAPI/)

Also on the portfolio: [https://reha-demircan-portfolio.vercel.app/](https://reha-demircan-portfolio.vercel.app/)

The Ask page answers a short list of commands: the eight nightly prices, how a stay total is calculated, how to register and confirm a booking, and the fact that accounts and bookings stay in this browser. It does not call an external service.

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

Rates are per room, per night, in euros, taxes included. Queen Double and King Double face the street and cost less than the rooms on the water. The other six rooms are unchanged.

| Room | View | Nightly |
| --- | --- | --- |
| Standard | Garden | €220 |
| Queen Double | Side street | €250 |
| Queen | Bebek bay | €295 |
| King Double | Rooftops | €340 |
| King | Bosphorus balcony | €385 |
| Deluxe | Wide Bosphorus balcony | €510 |
| Suite | Strait, two rooms | €780 |
| Bosfor Suite | Private water terrace | €1,250 |
