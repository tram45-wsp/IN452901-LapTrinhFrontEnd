// Các hàm TẠO phần tử DOM từ dữ liệu. Chỉ dùng textContent cho dữ liệu từ server:
// nếu ai đó đặt tên sự kiện là "<img src=x onerror=alert(1)>", textContent hiện
// nguyên chuỗi đó ra màn hình, còn innerHTML sẽ chạy mã độc (lỗi XSS).
// TODO(ch3-T3): khi viết card, import thêm:
import { getClubImage } from './club-images.js';
import { formatDateTime, formatSeats, getSeatStatus } from './utils/format.ts';

/** Tạo một phần tử: el('p', { className: 'tag', text: 'CLB Tin học' }) */
export function el(tag, { className, text, attrs = {} } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  node.append(...children);
  return node;
}

/** Nhãn tình trạng chỗ, hoặc null nếu còn nhiều chỗ */
export function createSeatBadge(event) {
  // TODO(ch3-T3): theo getSeatStatus(event):
  const status = getSeatStatus(event);
  //   'full'        → <span class="badge badge--full">Hết chỗ</span>
  if (status === 'full') {
    return el('span', { className: 'badge badge--full', text: 'Hết chỗ' });
  }
  //   'almost-full' → <span class="badge badge--hot">Sắp hết chỗ</span>
  if (status === 'almost-full') {
    return el('span', { className: 'badge badge--hot', text: 'Sắp hết chỗ' });
  }
  //   'available'   → null
  return null;
}

/** Dòng "CLB Tin học [Sắp hết chỗ]" dùng chung cho card và trang chi tiết */
export function createEventMeta(event, clubName) {
  // TODO(ch3-T3): <p class="card__meta"><span class="tag">{clubName}</span> {badge nếu có}</p>
  const badge = createSeatBadge(event);
  const children = [el('span', { className: 'tag', text: clubName })];
  if (badge) {
    children.push(badge);
  }
  return el('p', { className: 'card__meta', text: clubName });
}

export function createTime(iso) {
  // TODO(ch3-T3): <time datetime="{iso}">{formatDateTime(iso)}</time>
  return el('time', { text: formatDateTime(iso), attrs: { datetime: iso } });
}

/** Một card sự kiện — cùng cấu trúc HTML với card tĩnh ở Ch02 để dùng lại CSS */
export function createEventCard(event, clubName) {
  // TODO(ch3-T3): dựng card giống card tĩnh trong events.html của Ch02:
  const detailUrl = `event-detail.html?${new URLSearchParams({ id: event.id })}`;

  const img = el('img', {
    className: 'card_media',
    attrs: { src: getClubImage(event.clubId), alt: `Biểu tượng ${clubName}`, width: '640', height: '360', loading: 'lazy',},
  });

  const titleLink = el('a', { text: event.name, attrs: { href: detailUrl } });
  const title = el('h3', { className: 'card_title' }, [titleLink]);

  const infoTime = createTime(event.startDate);
  const infoText = document.createTextNode(` — ${event.location || ''}`);
  const eventInfo = el('p', { className: 'event-card_info' }, [infoTime, infoText]);

  const desc = el('p', { className: 'card_text', text: event.description || '' });
  const seats = el('p', { className: 'event-card_seats', text: formatSeats(event) });

  const body = el('div', { className: 'card_body' }, [createEventMeta(event, clubName), title, eventInfo, desc, seats,]);

  return el('article', { className: 'card event-card' }, [img, body]);
}

/**
 * Vẽ lại toàn bộ danh sách. replaceChildren() xoá card cũ và gắn card mới
 * trong một lần — trình duyệt chỉ vẽ lại một lần.
 */
export function renderEventList(container, events, clubNames) {
  // TODO(ch3-T3): map mỗi event thành createEventCard(event, tên CLB lấy từ clubNames (Map id → tên)),
  // rồi container.replaceChildren(...cards)
  const cards = events.map((event) => 
    createEventCard(event, clubNames.get(event.clubId) || 'Câu lạc bộ')
  );
  container.replaceChildren(...cards);
}

/**
 * Hộp trạng thái loading / empty / error.
 * action (tuỳ chọn): { label, onClick } — vd. nút "Thử lại" khi lỗi.
 */
export function renderStatus(container, kind, message, action) {
  const children = [el('p', { text: message })];
  if (action) {
    const button = el('button', { className: 'btn btn--ghost', text: action.label, attrs: { type: 'button' } });
    button.addEventListener('click', action.onClick);
    children.push(button);
  }
  const box = el('div', { className: `status status--${kind}`, attrs: { role: kind === 'error' ? 'alert' : 'status' } }, children);
  container.replaceChildren(box);
}
