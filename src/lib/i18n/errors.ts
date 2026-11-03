import type { Locale } from "@/lib/i18n/locale"

const exact: Record<string, string> = {
  "Choose a check-in and a check-out.": "Giriş ve çıkış tarihi seçin.",
  "Those dates could not be read. Use the date fields.": "Bu tarihler okunamadı. Tarih alanlarını kullanın.",
  "Check-in cannot be in the past.": "Giriş tarihi geçmişte olamaz.",
  "Check-out has to be at least one night after check-in.": "Çıkış, girişten en az bir gece sonra olmalı.",
  "Online booking stops at 28 nights. Choose a shorter stay.": "Online rezervasyon 28 gecede durur. Daha kısa bir konaklama seçin.",
  "That room is not at the hotel.": "Bu oda otelde yok.",
  "That room is not at the hotel. Choose one below.": "Bu oda otelde yok. Aşağıdan birini seçin.",
  "Choose a room.": "Bir oda seçin.",
  "Still checking this browser. Pay again in a moment.": "Bu tarayıcı hâlâ kontrol ediliyor. Birazdan yeniden ödeyin.",
  "Sign in again before confirming this stay.": "Bu konaklamayı onaylamadan önce yeniden giriş yapın.",
  "Sign in again before paying for this stay.": "Bu konaklamayı ödemeden önce yeniden giriş yapın.",
  "Sign in again to manage this stay.": "Bu konaklamayı yönetmek için yeniden giriş yapın.",
  "That stay could not be found on this account.": "Bu konaklama bu hesapta bulunamadı.",
  "Saved details in this browser could not be read. Allow site data for this page, then try again.":
    "Bu tarayıcıdaki kayıtlı bilgiler okunamadı. Bu sayfa için site verisine izin verip yeniden deneyin.",
  "This browser could not save your details. Allow site data for this page, then try again.":
    "Bu tarayıcı bilgilerinizi kaydedemedi. Bu sayfa için site verisine izin verip yeniden deneyin.",
  "That email already has an account here, and the password does not match it. Use the original password, or try another email.":
    "Bu e-postanın burada bir hesabı var ve şifre uymuyor. İlk şifreyi kullanın ya da başka bir e-posta deneyin.",
  "That password does not match this email. Use the password you first signed in with, or try a different email.":
    "Bu şifre bu e-postayla eşleşmiyor. İlk girişte kullandığınız şifreyi yazın ya da başka bir e-posta deneyin.",
  "Use at least 2 letters, or leave the name blank.": "En az 2 harf kullanın ya da adı boş bırakın.",
  "Use a name of 80 characters or fewer.": "Ad 80 karakteri geçmesin.",
  "Enter a valid email address.": "Geçerli bir e-posta yazın.",
  "That email is too long.": "Bu e-posta çok uzun.",
  "Use at least 6 characters.": "En az 6 karakter kullanın.",
  "Use 128 characters or fewer.": "128 karakteri geçmeyin.",
  "Enter your email.": "E-postanızı yazın.",
  "Enter your password.": "Şifrenizi yazın.",
  "Enter the expiry as MM/YY.": "Son kullanma tarihini AA/YY olarak yazın.",
  "The expiry month has to be between 01 and 12.": "Son kullanma ayı 01 ile 12 arasında olmalı.",
  "That card has expired. Use a future expiry.": "Bu kartın süresi geçmiş. İleride bir tarih kullanın.",
  "Enter the name on the card.": "Karttaki adı yazın.",
  "That name is too long.": "Bu ad çok uzun.",
  "Enter the card number.": "Kart numarasını yazın.",
  "A card number has 13 to 19 digits.": "Kart numarası 13 ile 19 hane olur.",
  "That card number is not valid. Check the digits.": "Bu kart numarası geçersiz. Haneleri kontrol edin.",
  "Your card was declined. No booking was made and nothing was charged. Try a different card.":
    "Kartınız reddedildi. Rezervasyon oluşmadı ve çekim yapılmadı. Başka bir kart deneyin.",
  "Only the demo card is accepted. Use 4242 4242 4242 4242 with any future expiry and any 3-digit CVC.":
    "Yalnızca demo kart kabul edilir. 4242 4242 4242 4242, ileride bir son kullanma tarihi ve 3 haneli herhangi bir CVC kullanın.",
}

const months: Record<string, string> = {
  January: "Ocak",
  February: "Şubat",
  March: "Mart",
  April: "Nisan",
  May: "Mayıs",
  June: "Haziran",
  July: "Temmuz",
  August: "Ağustos",
  September: "Eylül",
  October: "Ekim",
  November: "Kasım",
  December: "Aralık",
}

function translateDates(phrase: string) {
  return phrase.replace(/\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g, (_, day, month, year) => {
    return `${day} ${months[month] ?? month} ${year}`
  })
}

function one(message: string): string | null {
  if (exact[message]) return exact[message]
  let match = message.match(/^(.+) is sold out on (\d{1,2} [A-Za-z]+ \d{4})\.$/)
  if (match) return `${match[1]} ${translateDates(match[2] ?? "")} tarihinde dolu.`
  match = message.match(/^(.+) is sold out on (\d+) of these nights, starting (\d{1,2} [A-Za-z]+ \d{4})\.$/)
  if (match) return `${match[1]} bu gecelerin ${match[2]} tanesinde dolu, ilki ${translateDates(match[3] ?? "")}.`
  match = message.match(/^(.+) sleeps (\d+)\. Choose between 1 and (\d+) guests\.$/)
  if (match) return `${match[1]} en fazla ${match[2]} kişi alır. 1 ile ${match[3]} arası seçin.`
  match = message.match(/^Our calendar opens (\d+) days ahead, so the last night you can book is (.+)\. Pick dates before then\.$/)
  if (match) return `Takvim ${match[1]} gün ilerisini açıyor. Rezerve edebileceğiniz son gece ${translateDates(match[2] ?? "")}. Daha önceki tarihleri seçin.`
  match = message.match(/^The security code is (\d+) digits\.$/)
  if (match) return `Güvenlik kodu ${match[1]} hanedir.`
  match = message.match(/^Use at least (\d+) characters\.$/)
  if (match) return `En az ${match[1]} karakter kullanın.`
  return null
}

const charged = " Nothing was charged and no booking was made."

export function localizeMessage(message: string, locale: Locale): string {
  if (locale === "en" || !message) return message
  if (message.endsWith(charged)) {
    const head = message.slice(0, -charged.length)
    return `${localizeMessage(head, locale)} Herhangi bir çekim yapılmadı ve rezervasyon oluşmadı.`
  }
  return one(message) ?? message
}
