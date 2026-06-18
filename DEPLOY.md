# מדריך פריסה — GitHub + Hostinger (דומיין זמני, ללא אינדוקס)

> כל הפקודות מורצות מתוך תיקיית `site`.

---

## חלק א' — העלאה ל-GitHub

### 1. צרו ריפו ריק ב-GitHub
- היכנסו ל-https://github.com/new
- שם: למשל `elad-shurati-site`
- בחרו **Private** (מומלץ — כל עוד זה בעבודה)
- אל תסמנו "Add README" / "Add .gitignore" (כבר יש לנו)
- לחצו **Create repository**

### 2. אתחלו git והעלו (פעם ראשונה)
מתוך תיקיית `site`:
```bash
git init
git add .
git commit -m "Initial migration: Astro site"
git branch -M main
git remote add origin https://github.com/USERNAME/elad-shurati-site.git
git push -u origin main
```
(החליפו `USERNAME` בשם המשתמש שלכם)

### 3. עדכונים בעתיד
```bash
git add .
git commit -m "תיאור השינוי"
git push
```

---

## חלק ב' — בניית הגרסה הזמנית (חסומה לאינדוקס) 🔒

```bash
npm install        # פעם אחת בלבד
npm run build:staging
```

זה יוצר תיקיית `dist/` שבה:
- כל עמוד כולל `<meta name="robots" content="noindex, nofollow">`
- קובץ `robots.txt` חוסם את כל הסורקים (`Disallow: /`)

> ⚠️ לדומיין הזמני השתמשו **תמיד** ב-`build:staging`, לא ב-`build`.

---

## חלק ג' — העלאה ל-Hostinger (דומיין זמני)

### דרך פשוטה (מומלצת) — העלאת קבצים דרך File Manager

1. **השיגו דומיין זמני:**
   - **אחסון משותף (hPanel):** בכניסה לאתר קיים יש "Temporary domain" / כתובת תצוגה. אפשר גם ליצור תת-דומיין: hPanel → **Subdomains** → צרו למשל `staging` (יתקבל `staging.הדומיין-שלכם`).
   - **VPS:** הפנו תת-דומיין (למשל `staging.elad-digital.co.il`) ל-IP של השרת, או השתמשו בכתובת ה-IP ישירות.

2. **דחסו את תוכן `dist`:** היכנסו לתיקיית `dist`, בחרו את **כל הקבצים שבתוכה** (לא את התיקייה עצמה) → צרו קובץ ZIP.

3. **העלו:** hPanel → **File Manager** → היכנסו לתיקיית השורש של הדומיין הזמני (למשל `public_html` או `domains/staging.../public_html`) → העלו את ה-ZIP → לחצו **Extract**.

4. **בדקו:** היכנסו לדומיין הזמני בדפדפן — האתר אמור לעלות.
   בדקו גם `https://הדומיין-הזמני/robots.txt` → צריך להופיע `Disallow: /`.

### חשוב לאחר ההעלאה
- ודאו שקובץ `.htaccess` (אם Apache) מפנה הכל ל-HTTPS.
- אם נכנסים לעמוד פנימי ומקבלים 404 — הקבצים הם directory-based (`/slug/index.html`), אז כתובת חייבת להסתיים ב-`/`. זה כבר מוגדר באתר.

---

## הגנה נוספת (אופציונלי) — סיסמה לדומיין הזמני
כדי שגם בני אדם לא יגיעו בטעות, אפשר להוסיף סיסמה:
- **hPanel:** Advanced → **Password Protect Directories** → בחרו את תיקיית הדומיין הזמני → הגדירו שם משתמש וסיסמה.

---

## מעבר לפרודקשן (כשהאתר מאושר) 🚀
על הדומיין הסופי `elad-digital.co.il`:
```bash
npm run build          # ללא staging — מאונדקס בגוגל
```
ואז להעלות את `dist` לתיקיית השורש של הדומיין הראשי.
**זה הרגע היחיד שבו האתר נפתח לאינדוקס.**
