// Trang chi tiết: đọc id từ URL (event-detail.html?id=…), tải sự kiện và điền vào khung HTML có sẵn.
import { getEvent, getClub } from './api.js';
import { renderStatus, createEventMeta, createTime, el } from './render.js';
// TODO(ch3-T5): import thêm getClub (api.js), getClubImage (club-images.js),
import {getClubImage} from './club-images.js';
// createEventMeta + createTime (render.js), getSeatsLeft + getSeatStatus (utils/format.ts) khi cần.
//import { getSeatsLeft, getSeatStatus, formatSeats } from './utils/format.ts';

const statusBox = document.querySelector('#detail-status');
const article = document.querySelector('#event-detail');

/** Phần tử có data-field="…" trong khung chi tiết */
function field(name) {
  return article.querySelector(`[data-field="${name}"]`);
}

function getEventIdFromUrl() {
  // TODO(ch3-T5): trả về giá trị tham số id trên URL (new URLSearchParams(window.location.search))
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function fillDetail(event, clubName) {
  // TODO(ch3-T5): điền dữ liệu vào các phần tử data-field trong event-detail.html:
  document.title = `${event.name} — EduHub Web`;
  //   meta (thay bằng createEventMeta), name, club, time (createTime), location,
  const nameField = field('name');
  if (nameField) nameField.textContent = event.name;

  const clubField = field('club');
  if (clubField) clubField.textContent = clubName;

  const metaField = field('meta');
  if (metaField) {
    metaField.replaceChildren(createEventMeta(event, clubName));
  }

  const timeField = field('time');
  if (timeField) {
    timeField.replaceChildren(createTime(event.startDate));
  }

  const locationField = field('location');
  if (locationField) {
    locationField.textContent = event.location || '';
  }
  //   seats "{capacity} (còn {số chỗ còn} chỗ)", description, cta, image (src + alt)
  const seatsField = field('seats');
  if (seatsField) {
    const left = event.capacity - event.registeredCount;
    seatsField.textContent = `${event.capacity} (còn ${Math.max(0, left)} chỗ)`;
  }

  const descField = field('description');
  if (descField) {
    descField.textContent = event.description || '';
  }

  const imageField = field('image');
  if (imageField) {
    imageField.setAttribute('src', getClubImage(event.clubId));
    imageField.setAttribute('alt', `Biểu tượng ${clubName}`);
  }

  const ctaField = field('cta');
  if (ctaField) {
    ctaField.replaceChildren();
    const left = event.capacity - event.registeredCount;
    if (left <= 0) {
      const fullText = el('span', { className: 'text--muted', text: 'Sự kiện đã hết chỗ' });
      ctaField.append(fullText);
    } else {
      const registerBtn = el('a', {
        className: 'btn btn--primary',
        text: 'Đăng ký tham gia',
        attrs: { href: `register.html?eventId=${event.id}` }
      });
      ctaField.append(registerBtn);
    }
    // Chỉ dùng textContent / thuộc tính — không innerHTML.
    field('name').textContent = event.name;
    field('club').textContent = clubName;

    statusBox.replaceChildren();
    article.hidden = false;
  }
}

async function loadDetail() {
  const id = getEventIdFromUrl();
  if (!id) {
    renderStatus(statusBox, 'empty', 'TODO(ch3-T5): đọc ?id= trên URL rồi tải sự kiện.');
    return;
  }

  renderStatus(statusBox, 'loading', 'Đang tải sự kiện…');
  article.hidden = true;
  try {
    const event = await getEvent(id);
    // TODO(ch3-T5): lấy tên CLB bằng getClub(event.clubId); lỗi thì dùng chữ 'Câu lạc bộ'
    let resolvedClubName = 'Câu lạc bộ';
    try {
      const club = await getClub(event.clubId);
      if (club && club.name) {
        resolvedClubName = club.name;
      }
    } catch {
      // Nếu lỗi tải CLB thì giữ mặc định 'Câu lạc bộ'
    }
    fillDetail(event, resolvedClubName);
  } catch (error) {
    // TODO(ch3-T5): error.status === 404 → renderStatus 'empty' "Không tìm thấy sự kiện này…";
    // lỗi khác → renderStatus 'error' kèm nút { label: 'Thử lại', onClick: loadDetail }
    if (error.status === 404) {
      renderStatus(statusBox, 'empty', 'Không tìm thấy sự kiện này.');
    } else {
      renderStatus(statusBox, 'error', error.message, {
        label: 'Thử lại',
        onClick: loadDetail,
      });
    }
  }
}

loadDetail();
