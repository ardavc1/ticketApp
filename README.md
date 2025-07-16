# 🎫 Ticket Management System

Kurumsal taleplerin (ticket) yönetimini kolaylaştıran, modern görünümlü ve kullanıcı dostu bir destek sistemi.

## 🔧 Kullanılan Teknolojiler

### Backend – Spring Boot
- Spring Boot 3
- Spring Security + JWT Authentication
- Spring Data JPA (Hibernate)
- PostgreSQL
- Lombok
- Multipart File Upload
- Role-based Access Control (USER, ADMIN)

### Frontend – React.js
- React 18
- Material UI (MUI)
- Axios
- React Router DOM
- Context API (Auth, Role vs.)

## 🔐 Roller

| Rol    | Yetkiler                                       |
|--------|------------------------------------------------|
| USER   | Talep oluşturma, kendi taleplerini görme       |
| ADMIN  | Tüm talepleri görme, atama ve durum değiştirme |

## 🎯 Özellikler

- 🔒 JWT tabanlı güvenli giriş
- 📝 Başlık, açıklama, kategori, öncelik bilgisiyle ticket oluşturma
- 📎 Dosya yükleme ve indirme desteği
- 📂 Talep durumlarını güncelleme (OPEN / CLOSED)
- 👤 Kullanıcılara görev atama
- 💬 Ticket’a cevap (reply) yazabilme
- 🧾 Aktivite geçmişi (oluşturulma, durum değişikliği, atama vs.)
- 📊 Dashboard üzerinden öncelik ve kategoriye göre grafikler
- 🌐 Role bazlı erişim kontrolleri ve dinamik yönlendirme
- 🎨 Responsive, modern ve kullanıcı dostu UI (Material UI ile)

## 👨‍💻 Geliştirici

**Arda AVCI**  
📧 [LinkedIn](https://www.linkedin.com/in/avciarda)  
💻 [GitHub](https://github.com/ardavc1)