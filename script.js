/* ============================================================
   script.js  v3 — 빔프로젝터 최적화 버전
   ─────────────────────────────────────────────────────────
   1.  표지 배경 파티클 — 크고 선명하게
   2.  눈 주변 데이터 점 생성
   3.  차이점 섹션 데이터 흐름 화살표 생성
   4.  스크롤 진행 바
   5.  fade-up 스크롤 등장 애니메이션
   6.  네비게이션 점 활성화
   7.  ★ 차이점 피어 호버 (대응 행 동시 강조)
   8.  키보드 슬라이드 이동 (↑↓ / PgUp/PgDn)
   ============================================================ */


/* ── 1. 표지 배경 파티클 ─────────────────────────────────
   빔프로젝터: 크기·불투명도 크게, 컬러 선명하게
   ──────────────────────────────────────────────────────── */
(function createParticles() {
  const container = document.getElementById('particlesBg');
  if (!container) return;

  const COUNT  = 40;
  const COLORS = [
    '#8B3535', '#6B2D2D', '#F0E4C8',
    '#A04040', '#D8C7A1', '#C05050',
  ];

  for (let i = 0; i < COUNT; i++) {
    const el    = document.createElement('div');
    el.className = 'particle';

    const size    = 7 + Math.random() * 16;   // ★ 더 크게 (7~23px)
    const opacity = 0.4 + Math.random() * 0.55; // ★ 더 불투명 (0.4~0.95)
    const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const startX  = Math.random() * 100;       // %
    const startY  = Math.random() * 100;
    const tx      = (Math.random() - 0.5) * 420;
    const ty      = (Math.random() - 0.5) * 420;
    const dur     = 6 + Math.random() * 10;
    const delay   = Math.random() * 12;

    const glow = Math.random() > 0.6
      ? `box-shadow: 0 0 ${Math.round(size * 1.2)}px ${color};` : '';

    el.style.cssText = `
      left: ${startX}%;
      top:  ${startY}%;
      width:  ${size}px;
      height: ${size}px;
      background: ${color};
      --dur:   ${dur}s;
      --delay: ${delay}s;
      --op:    ${opacity};
      --tx:    ${tx}px;
      --ty:    ${ty}px;
      animation-duration: ${dur}s;
      animation-delay:    ${delay}s;
      ${glow}
    `;

    container.appendChild(el);
  }
})();


/* ── 2. 눈 주변 데이터 점 ─────────────────────────────────
   감시 눈 SVG 주변에 날아다니는 컬러 점
   ──────────────────────────────────────────────────────── */
(function createDataDots() {
  const wrap = document.getElementById('dataDots');
  if (!wrap) return;

  const COLORS = ['#8B3535', '#6B2D2D', '#D8C7A1', '#A04040', '#F0E4C8'];
  const COUNT  = 16;

  for (let i = 0; i < COUNT; i++) {
    const el    = document.createElement('div');
    el.className = 'dd-el';

    const size  = 7 + Math.random() * 10;
    const color = COLORS[i % COLORS.length];
    const sx    = 15 + Math.random() * 70;
    const sy    = 55 + Math.random() * 35;
    const dx    = (Math.random() - 0.5) * 100;
    const dy    = -(40 + Math.random() * 80);
    const dur   = 1.6 + Math.random() * 2.2;
    const del   = Math.random() * 3.5;

    el.style.cssText = `
      left:   ${sx}%;
      top:    ${sy}%;
      width:  ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${Math.round(size)}px ${color};
      --d2: ${dur}s;
      --dl: ${del}s;
      --dx: ${dx}px;
      --dy: ${dy}px;
      animation-duration: ${dur}s;
      animation-delay:    ${del}s;
    `;
    wrap.appendChild(el);
  }
})();


/* ── 3. 차이점 섹션 — 데이터 흐름 화살표 ────────────────
   스마트폰에서 기업 눈으로 날아가는 아이콘들
   ──────────────────────────────────────────────────────── */
(function createDataFlow() {
  const container = document.getElementById('dataFlowArrows');
  if (!container) return;

  const items = ['●', '▲', '◆', '★', '●'];
  items.forEach((ch, i) => {
    const el    = document.createElement('span');
    el.className = 'dfa-el';
    el.textContent = ch;
    const dur = 1.5 + Math.random() * 1.5;
    const del = i * 0.35;
    el.style.cssText = `
      --dd:  ${dur}s;
      --ddl: ${del}s;
      animation-duration: ${dur}s;
      animation-delay:    ${del}s;
      color: ${['#8B3535','#D8C7A1','#6B2D2D','#F0E4C8','#A04040'][i]};
      font-size: 1.3rem;
    `;
    container.appendChild(el);
  });
})();


/* ── 4. 스크롤 진행 바 ───────────────────────────────────
   문서 전체 대비 현재 위치를 상단 바 너비로 표시
   ──────────────────────────────────────────────────────── */
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docH      = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = docH > 0 ? (scrollTop / docH) * 100 : 0;
  progressBar.style.width = `${Math.min(pct, 100)}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });


/* ── 5. 페이드업 스크롤 등장 ─────────────────────────────
   .fade-up 요소가 화면에 진입하면 .visible 클래스 추가
   한 번 등장 후 관찰 중단 (성능)
   ──────────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
fadeEls.forEach((el) => fadeObs.observe(el));


/* ── 6. 네비게이션 점 활성화 ─────────────────────────────
   현재 화면의 50%를 차지하는 섹션을 기준으로 dot 활성화
   ──────────────────────────────────────────────────────── */
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');

const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        dots.forEach((d) => {
          d.classList.toggle('active', d.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.5 }
);
slides.forEach((s) => navObs.observe(s));

dots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(dot.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 7. ★ 차이점 섹션 — 피어 호버 ──────────────────────
   한쪽 행에 마우스를 올리면 data-row 번호가 같은
   반대편 행에도 .row-active 클래스를 동시에 추가
   (왼쪽·오른쪽 동시에 변환 효과 발생)
   ──────────────────────────────────────────────────────── */
(function setupPeerHover() {
  const allRows  = document.querySelectorAll('.dv-row');

  allRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const rowIdx = row.dataset.row;  // "0" "1" "2" "3"
      if (rowIdx === undefined) return;

      // 같은 data-row 번호를 가진 모든 행 활성화 (자기 자신 포함)
      document.querySelectorAll(`.dv-row[data-row="${rowIdx}"]`).forEach((peer) => {
        peer.classList.add('row-active');
      });
    });

    row.addEventListener('mouseleave', () => {
      const rowIdx = row.dataset.row;
      if (rowIdx === undefined) return;

      document.querySelectorAll(`.dv-row[data-row="${rowIdx}"]`).forEach((peer) => {
        peer.classList.remove('row-active');
      });
    });
  });
})();


/* ── 8. 키보드 슬라이드 이동 ─────────────────────────────
   발표 중 마우스 없이 ↑↓ / PgUp/PgDn 으로 이동 가능
   ──────────────────────────────────────────────────────── */
const slideIds = Array.from(slides).map((s) => s.id);

function getActiveIdx() {
  const href = document.querySelector('.dot.active')?.getAttribute('href') ?? '#cover';
  const idx  = slideIds.indexOf(href.replace('#', ''));
  return idx >= 0 ? idx : 0;
}

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  const cur = getActiveIdx();

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    document.getElementById(slideIds[Math.min(cur + 1, slideIds.length - 1)])
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    document.getElementById(slideIds[Math.max(cur - 1, 0)])
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
