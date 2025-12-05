src/
├── core/                   # Utilitas umum (HttpClient, Constants)
│   └── api.client.ts       # Setup Axios/Fetch
├── domain/                 # (PENTING) Aturan bisnis murni
│   ├── entities/           # Definisi bentuk data
│   │   └── user.entity.ts  # Tipe data User (id, email, role, status)
│   └── repositories/       # Kontrak/Interface fungsi
│       ├── auth.repository.ts
│       └── admin.repository.ts
├── data/                   # Implementasi teknis (API)
│   └── repositories/       # Kodingan aslinya di sini
│       ├── auth.repository.impl.ts
│       └── admin.repository.impl.ts
├── presentation/           # UI React
│   ├── components/         # Tombol, Input, Alert
│   ├── pages/              # Halaman Login, Dashboard Admin
│   │   ├── login/
│   │   └── admin-approval/
│   └── hooks/              # Logika penghubung (UseCases sederhana)
│       ├── useAuth.ts
│       └── useAdminApproval.ts
└── App.tsx                 # Routing