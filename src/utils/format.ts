// Tệp TypeScript duy nhất của Ch03: các hàm định dạng dữ liệu để hiển thị.
// Kiểu giúp tsc báo lỗi TRƯỚC khi chạy, ví dụ gọi formatSeats(event) mà event thiếu capacity.
// Kiểm tra: npm run typecheck

/** Phần dữ liệu sự kiện cần để tính số chỗ — chỉ 2 trường, không cần cả EventDto. */
export interface SeatInfo {
  capacity: number;
  registeredCount: number;
}

/** Union type: tình trạng chỗ chỉ có thể là một trong ba chuỗi này. */
export type SeatStatus = 'available' | 'almost-full' | 'full';

const ALMOST_FULL_RATIO = 0.2;

/** "2026-10-17T00:30:00.000Z" → "07:30 Thứ Bảy, 17/10/2026" */
export function formatDateTime(iso: string): string {
  // TODO(ch3-T1): dùng Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday, day, month, year, hour, minute })
  // Server lưu giờ UTC — phải hiển thị theo giờ Việt Nam.
    if (!iso) return '';
  const date = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
}

export function getSeatsLeft(seat: SeatInfo): number {
  // TODO(ch3-T1): số chỗ còn lại = capacity - registeredCount, không âm (Math.max)
  return Math.max(0, seat.capacity - seat.registeredCount);
  return seat.capacity;
}

export function getSeatStatus(seat: SeatInfo): SeatStatus {
  // TODO(ch3-T1): hết chỗ → 'full'; còn dưới 20% capacity → 'almost-full'; còn lại → 'available'
  const left = getSeatsLeft(seat);
  if (left === 0) return 'full';
  if (left < seat.capacity * ALMOST_FULL_RATIO) return 'almost-full';
  return 'available';
}

/** { capacity: 60, registeredCount: 48 } → "Còn 12/60 chỗ" */
export function formatSeats(seat: SeatInfo): string {
  // TODO(ch3-T1): hết chỗ → "Đã đủ 60 chỗ"; còn chỗ → "Còn 12/60 chỗ"
  const left = getSeatsLeft(seat);
  if (left === 0) {
    return `Đã đủ ${seat.capacity} chỗ`;
  }
  return `Còn ${left}/${seat.capacity} chỗ`;
}
