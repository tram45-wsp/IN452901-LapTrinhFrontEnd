# EduHub Web — Ch03 (starter)
Đã hoàn thành bài tập
## Thứ tự làm gợi ý

1. `ch3-T1` — `src/utils/format.ts` (TypeScript). Kiểm bằng `npm run typecheck`.
2. `ch3-T2` — `src/api.js`: hàm `request()` và `toQueryString()`. Sau bước này trang sự kiện đã hiện chữ TODO của T3 thay vì lỗi.
3. `ch3-T3` — `src/render.js`: tạo card sự kiện bằng DOM.
4. `ch3-T4` — `src/events-page.js`: lọc CLB, tìm kiếm có debounce, URL, loading/empty/error, `AbortController`.
5. `ch3-T5` — `src/event-detail-page.js`: trang chi tiết theo `?id=`.
6. `ch3-T6` — `src/register-page.js`: kiểm form và gửi `POST /api/auth/register`.
7. (Challenge) `ch3-T7` — `src/register-draft.js`: lưu nháp form vào `localStorage`.

Tìm nhanh mọi việc cần làm: VS Code → Ctrl+Shift+F → `TODO(ch3-`.

## Kiểm tra

```bash
npm run lint        # ESLint: không in lỗi
npm run typecheck   # tsc kiểm kiểu format.ts: không in lỗi
npm run build       # đóng gói 4 trang vào dist/
npm run preview     # xem bản dist/ ở http://localhost:5173 (tắt npm run dev trước)
```
Đã kiểm tra và đã sửa lại xanh hoàn toàn
- Thử email đã có (`sv1@dthu.edu.vn`) ở trang đăng ký → phải thấy lỗi "Email đã được dùng…".
- DevTools → **Network**: gõ tìm kiếm nhanh chỉ sinh 1 request sau khi ngừng gõ.
- DevTools → **Console**: không có lỗi đỏ (trừ 404/409 em cố ý thử).

## Địa chỉ API

`src/config.js` đọc biến `VITE_API_URL`, mặc định `http://localhost:4000`. Muốn đổi (vd. khi deploy GitHub Pages trỏ tới mock API công khai của giảng viên): chép `.env.example` thành `.env.local`, sửa giá trị, chạy lại `npm run dev` / `npm run build`.

## Cấu trúc

```
starter/
├── index.html, events.html, event-detail.html, register.html   # đã xong, không cần sửa
├── css/                    # đã xong (CSS Ch02 + phần Ch03 cuối components.css)
├── assets/                 # Ảnh SVG
├── public/assets/          # Ảnh Open Graph, chép nguyên vào dist/
├── src/
│   ├── config.js           # có sẵn: API_URL
│   ├── api.js              # ch3-T2
│   ├── render.js           # ch3-T3 (el() và renderStatus() có sẵn)
│   ├── club-images.js      # có sẵn: id CLB → ảnh
│   ├── events-page.js      # ch3-T4
│   ├── event-detail-page.js# ch3-T5
│   ├── register-page.js    # ch3-T6
│   ├── register-draft.js   # ch3-T7 (challenge)
│   └── utils/
│       ├── format.ts       # ch3-T1 (TypeScript)
│       └── debounce.js     # có sẵn
├── mock-api/               # Mock API EduHub — không sửa
├── vite.config.js          # Vite multi-page (4 trang)
├── eslint.config.js        # ESLint 10 flat config
├── tsconfig.json
└── package.json
```
## Nộp bài
Đã repo lại, commit 3 lần 

