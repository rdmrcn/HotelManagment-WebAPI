import {
  BedDouble,
  Building2,
  Check,
  Coffee,
  Armchair,
  DoorOpen,
  Flame,
  Moon,
  PenLine,
  ShowerHead,
  Shirt,
  Sofa,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react"

type Render = (className?: string) => React.ReactElement

const rules: [RegExp, Render][] = [
  [/bed/i, (c) => <BedDouble className={c} aria-hidden />],
  [/bosphorus|strait|water/i, (c) => <Waves className={c} aria-hidden />],
  [/city|street|rooftop|building/i, (c) => <Building2 className={c} aria-hidden />],
  [/shower/i, (c) => <ShowerHead className={c} aria-hidden />],
  [/internet|wi-?fi/i, (c) => <Wifi className={c} aria-hidden />],
  [/desk/i, (c) => <PenLine className={c} aria-hidden />],
  [/robe/i, (c) => <Shirt className={c} aria-hidden />],
  [/terrace|balcony|glass/i, (c) => <DoorOpen className={c} aria-hidden />],
  [/fireplace/i, (c) => <Flame className={c} aria-hidden />],
  [/tea|breakfast|coffee/i, (c) => <Coffee className={c} aria-hidden />],
  [/sofa|lounge|sitting|armchair|bench|seating/i, (c) => <Sofa className={c} aria-hidden />],
  [/dining|table/i, (c) => <Utensils className={c} aria-hidden />],
  [/turndown/i, (c) => <Moon className={c} aria-hidden />],
  [/corner/i, (c) => <Armchair className={c} aria-hidden />],
]

export function AmenityIcon({ label, className }: { label: string; className?: string }) {
  for (const [pattern, render] of rules) if (pattern.test(label)) return render(className)
  return <Check className={className} aria-hidden />
}
