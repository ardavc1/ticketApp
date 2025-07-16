# 🎫 Ticket Management System

Kurumsal taleplerin (ticket) yönetimini kolaylaştıran, modern görünümlü ve kullanıcı dostu bir destek sistemi.

|                   |               |
|-------------------|---------------|
| 👨‍💻 Geliştirici | 🤵 Arda Avcı  |
| ✨ Son Güncelleme  | 📅 16.07.2025 |

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


##  License

```
Copyright 2025 Arda Avcı

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
