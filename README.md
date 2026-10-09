# Bosfor Hotels

A portfolio site for Bosfor Hotels, a fictional house hotel on the Bosphorus in Istanbul, on the Bebek waterfront. Bosfor is the strait: Bosphorus, Boğaz. Guests can browse eight room types, choose dates, see the stay price, register, and save a booking in the browser.

There is no database and no auth provider. Registrations and bookings stay in `localStorage` on this machine (`bosfor-hotels.*`). Confirmation codes start with `BOS-`.

Public site: [https://rdmrcn.github.io/HotelManagment-WebAPI/](https://rdmrcn.github.io/HotelManagment-WebAPI/)

Also on the portfolio: [https://reha-demircan-portfolio.vercel.app/](https://reha-demircan-portfolio.vercel.app/)

Ask is a concierge conversation, on its own page and from the button on every other page. It answers in English about the rooms, prices, views, dates, breakfast, check-in, and how to register, sign in, book, and find a saved stay. Each reply includes a link to the next page. It does not call an external service, and it does not take payment.

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

Rates are per room, per night, in euros, taxes included. Only Deluxe Room, Suite Room, and Bosfor Suite Room face the water.

| Room | View | Nightly |
| --- | --- | --- |
| Standard Room | City rooftops | €220 |
| Queen Double Room | Side street | €250 |
| Queen Room | Across the street | €295 |
| King Double Room | Rooftops | €340 |
| King Room | City buildings | €385 |
| Deluxe Room | Wide Bosphorus balcony | €510 |
| Suite Room | Strait, two rooms | €780 |
| Bosfor Suite Room | Private water terrace | €1,250 |
