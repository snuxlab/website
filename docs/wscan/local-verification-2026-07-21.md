# WSCAN 조치 로컬 검증 기록

- 대상: `ux.snu.ac.kr` Jekyll 소스
- 검증 일시: 2026-07-21 13:09 KST
- 검증 범위: 배포 전 로컬 빌드 및 브라우저 동작
- 주의: 이 기록은 실제 GitHub Pages 배포, WSCAN 항목별 재점검 및 정보보안파트의 조치 불가 승인을 대신하지 않는다.

## 1. 임시 Jekyll 빌드

- Jekyll 3.9.5와 현재 설정의 플러그인을 임시 Ruby gem 경로에 설치했다.
- 저장소의 `_site/`는 수정하지 않고 `/tmp/ux-snu-wscan-build.JhNuaY`에 빌드했다.
- 빌드 결과: 성공(종료 코드 0), 생성 HTML 92개.
- 비공개 증빙 경로인 `docs/`와 `scripts/`가 생성 사이트에 포함되지 않음을 확인했다.

실행 명령:

```text
jekyll build --destination /tmp/ux-snu-wscan-build.JhNuaY --trace
./scripts/verify-wscan.sh /tmp/ux-snu-wscan-build.JhNuaY
```

## 2. 자동 정적 검사

다음 검사가 모두 `PASS`였고 최종 종료 코드는 0이었다.

- 레거시 호환 페이지 2개 생성
- 두 페이지의 canonical 및 meta refresh 목적지 일치
- 외부 또는 프로토콜 상대 `<script src>` 0건
- 외부 또는 프로토콜 상대 stylesheet 0건
- 활성 HTTP script, stylesheet, image, iframe 0건
- `snuxlab@gmail.com` 원문 0건
- Bot Framework `s=` 임베드 토큰 0건
- GitHub 기본 `Page not found` 문자열 0건
- 대표 페이지의 `strict-origin-when-cross-origin` 메타 정책 적용
- 대표 페이지의 로컬 `assets/vendor/` 참조 및 참조 파일 실재 확인

## 3. 브라우저 확인

로컬 HTTP 서버에서 홈, About, People, Project, Blog, 대표 게시물을 실제 브라우저로 열어 확인했다.

| 확인 항목 | 결과 |
|---|---|
| 공통 메뉴 | 대표 페이지마다 6개 메뉴 링크 정상 렌더링 |
| 스크립트·스타일 | 대표 페이지 모두 동일 출처 URL만 사용 |
| 이미지 | 로드 실패 이미지 0건 |
| Nanum Gothic | `document.fonts.check()` 성공, 본문 계산 스타일 적용 확인 |
| Font Awesome | 체크·링크 아이콘의 글꼴 및 pseudo-element 콘텐츠 렌더링 확인 |
| Bootstrap 모달 | 책 발간 모달 표시, 닫기 후 공지 모달 전환, 최종 닫기 정상 |
| Masonry | 홈 7개, Blog 56개 항목이 절대 위치 레이아웃으로 배치됨 |
| 브라우저 콘솔 | 대표 페이지 및 레거시 이동에서 warning/error 0건 |

## 4. 레거시 URL 및 MIME

| URL/자산 | 상태 | 확인 결과 |
|---|---:|---|
| `/2020/01/08/zerodepth.html` | 200 | `/blog/2020/01/08/zerodepth.html`로 이동 |
| `/2021/02/28/whoami.html` | 200 | `/blog/2021/02/28/whoami.html`로 이동 |
| Bootstrap CSS | 200 | `text/css` |
| Bootstrap JavaScript | 200 | `text/javascript` |
| Nanum Gothic TTF | 200 | `font/ttf` |
| Font Awesome WOFF2 | 200 | `font/woff2` |
| 로컬 책 표지 JPEG | 200 | `image/jpeg` |

## 5. 배포 후 남은 필수 확인

- GitHub Pages 배포 완료 시각과 배포 커밋을 기록한다.
- 라이브 레거시 URL 2개의 200 응답과 이동 목적지를 다시 확인한다.
- 라이브 `Server`, `Cache-Control`, 누락 보안 헤더 및 대표 자산 `Content-Type`을 다시 수집한다.
- WSCAN의 `[이슈 처리하기] → [재점검하기]`로 직접 조치 7개 규칙을 각각 재점검한다.
- 응답 헤더 6개 규칙은 규칙명별 조치 불가 사유서를 제출하고 승인 결과를 기록한다.
- `[전수 분석]`은 실행하지 않으며, 최종 `[미지정]` 항목이 0건인지 확인한다.
