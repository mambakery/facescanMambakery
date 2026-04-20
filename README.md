# 🫐 ร้านแหม่มเบอรี่ — ระบบบันทึกเวลาเข้างาน

> ระบบบันทึกเวลาเข้างานด้วยการสแกนใบหน้า + GPS Geofencing
> Frontend บน Netlify · ข้อมูลเก็บใน Google Sheets · ไม่ต้องการ Server

---

## ✨ คุณสมบัติ

| Feature | รายละเอียด |
|---------|-----------|
| 📷 **Face Recognition** | จดจำใบหน้าด้วย face-api.js (threshold 0.45) |
| 📍 **GPS Geofencing** | ตรวจสอบตำแหน่งด้วย Haversine Formula |
| 🔒 **Admin Auth** | ระบบ Login สำหรับ Admin ด้วย SHA-256 + token |
| 📊 **Google Sheets** | เก็บข้อมูลพนักงาน / ประวัติ / Config ใน Sheets |
| 📱 **Mobile-First** | Dark Glassmorphism UI รองรับทุกขนาดจอ |

---

## 📁 โครงสร้างไฟล์

```
maemberry-attendance/
├── index.html        ← หน้าเมนูหลัก (Public)
├── login.html        ← Admin Login (NEW)
├── scan.html         ← สแกนใบหน้าเข้างาน (Public)
├── register.html     ← ลงทะเบียนพนักงาน (🔒 Admin)
├── config.html       ← ตั้งค่า GPS + API (🔒 Admin)
├── js/
│   ├── api-config.js ← ใส่ GAS Web App URL ที่นี่
│   └── auth.js       ← Admin session helper
├── code.gs           ← Google Apps Script backend
├── netlify.toml      ← Netlify config
└── README.md
```

---

## 🚀 วิธีติดตั้ง

### Step 1 — ตั้งค่า Google Sheets & Apps Script

1. สร้าง **Google Sheets** ใหม่
2. ไปที่ **Extensions → Apps Script**
3. ลบโค้ดเดิมออก วาง **code.gs** ทั้งหมด
4. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. คัดลอก **Web App URL**

---

### Step 2 — แก้ไข `js/api-config.js`

```javascript
const GAS_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

---

### Step 3 — Deploy บน Netlify

**วิธีที่ 1 — Drag & Drop**
1. ไปที่ [app.netlify.com/drop](https://app.netlify.com/drop)
2. ลาก folder `maemberry-attendance` ไปวาง

**วิธีที่ 2 — GitHub Auto Deploy**
1. Push โค้ดขึ้น GitHub
2. ไปที่ [app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub
3. เลือก repo → Deploy

---

### Step 4 — ตั้งรหัสผ่าน Admin (ครั้งแรก)

1. เปิดหน้า `login.html`
2. ใส่รหัสผ่านที่ต้องการ
3. กด **"ตั้งรหัสผ่านครั้งแรก"** (จะแสดงอัตโนมัติถ้ายังไม่มี)

> ⚠️ ทำขั้นตอนนี้ทันทีหลัง Deploy เพื่อความปลอดภัย

---

### Step 5 — ตั้งค่า GPS

1. Login ด้วยรหัสผ่าน Admin
2. ไป **ตั้งค่าระบบ** → กด **"ดึงตำแหน่งปัจจุบัน"**
3. ใส่รัศมีที่ยอมรับ (เช่น `0.1` = 100 เมตร)
4. กด **"บันทึก"**

---

## 🔒 ระบบ Admin Auth

| หน้า | สิทธิ์ |
|------|-------|
| `index.html` | Public |
| `scan.html` | Public |
| `login.html` | Public |
| `register.html` | 🔒 Admin เท่านั้น |
| `config.html` | 🔒 Admin เท่านั้น |

**วิธีทำงาน:**
- รหัสผ่านถูก Hash ด้วย SHA-256 เก็บใน Google Sheets (Config sheet B5)
- Token มีอายุ ~80 นาที (session-based ใน sessionStorage)
- ถ้า session หมดอายุ redirect ไป login อัตโนมัติ

---

## 📖 การใช้งาน

### 👤 ลงทะเบียนพนักงาน

1. Login Admin → ไป `register.html`
2. กรอกชื่อ-นามสกุล
3. บันทึก 3 มุม: **หน้าตรง → หันซ้าย → หันขวา**
4. ระบบแสดงรายชื่อพนักงานที่ลงทะเบียนแล้ว พร้อมปุ่มลบ

### 📷 สแกนเข้างาน

1. เปิด `scan.html` → ระบบตรวจสอบ GPS
2. กด **"แตะเพื่อเริ่มสแกน"**
3. มองกล้องตรงๆ → ระบบสแกนทุก 500ms
4. พบใบหน้า → Modal ยืนยัน → กด **"ยืนยันเข้างาน"**
5. บันทึกใน Google Sheets (Attendance sheet)

---

## 🗄️ Google Sheets Structure

| Sheet | ข้อมูล |
|-------|-------|
| **Users** | ชื่อ, Face Descriptor (128D), วันที่ลงทะเบียน |
| **Attendance** | ชื่อ, เวลา, วันที่, Lat, Lng, Google Map Link |
| **Config** | GPS Target, Radius, Admin Password Hash |

---

## ❓ Troubleshooting

| ปัญหา | วิธีแก้ |
|-------|--------|
| Login ไม่ผ่าน | ตรวจสอบ API URL ใน `api-config.js` |
| กล้องไม่เปิด | ต้องเข้า HTTPS + ให้สิทธิ์ Camera |
| GPS ไม่ทำงาน | เปิด Location ใน Browser |
| CORS Error | ตรวจสอบ GAS Deploy เป็น "Anyone" |
| ใบหน้าไม่ผ่าน | ลงทะเบียนเพิ่มมุมมอง / ปรับ threshold |

---

## ⚙️ ปรับแต่ง

```javascript
// scan.html — ปรับความเข้มงวดการจดจำใบหน้า
const MATCH_THRESHOLD = 0.45;
// 0.35 = เข้มงวดมาก | 0.45 = default | 0.55 = หลวม
```

---

<div align="center">
  <sub>🫐 ร้านแหม่มเบอรี่ · Built with face-api.js + Google Apps Script + Netlify</sub>
</div>
