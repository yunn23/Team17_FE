## 홈트라이
**그룹원들과 홈트 시간을 공유하며 쉽고 꾸준한 운동 습관을 길러주는 홈트 플랫폼**

<img src='https://github.com/user-attachments/assets/0c894787-d6da-440b-8519-a1205a411d89' alt='홈트라이 소개 이미지' />

<br />

### 목차
- [팀 내 배포 링크](#팀-내-배포-링크)
- [개발 동기 및 목적](#개발-동기-및-목적)
- [서비스 소개](#서비스-소개)
- [팀원 소개](#팀원-소개)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [개발 주안점](#개발-주안점)
- [페이지별 화면 소개](#페이지별-화면-소개)
- [페이지별 기능 소개](#페이지별-기능-소개)
- [폴더 구조](#폴더-구조)

<br />

### 팀 내 배포 링크
[FE] https://hometry.vercel.app/

[BE] https://home-try.13.125.102.156.sslip.io

<br />

### 개발 동기 및 목적
홈트라이는 혼자 운동하기 어려운 이들을 위해, 함께 운동하는 느낌과 동기를 제공하는 홈트 플랫폼입니다. 코로나 이후 홈트 붐이 일어났지만 집에서 혼자 운동하다 보니 동기부여가 어렵고, 쉽게 포기할 수 있습니다. 홈트라이는 이러한 문제점을 해결하고자 시작되었습니다.

- **꾸준한 운동 습관 형성**
  - 운동 시간을 시각화하고 기록하여 매일 운동을 실천하도록 돕고, 그룹 내 랭킹 시스템과 채팅 기능을 통해 그룹원들과 소통하며 운동의 재미를 더합니다. 👏
- **건강한 커뮤니티 형성**
  - 그룹을 통해 운동 지식을 공유하고, 서로의 운동 성과를 인증하며 응원함으로써 건강한 커뮤니티 문화를 만들어갑니다. 💬
- **쉬운 접근성**
  - 모바일로 간편하게 운동 기록과 통계를 확인하고 실시간으로 운동에 참여할 수 있어 언제 어디서든 운동 습관을 기를 수 있습니다. 🌟


<br />

### 서비스 소개
그룹원들과 홈트 시간을 공유하며 쉽고 꾸준한 운동 습관을 길러주는 홈트 플랫폼, **홈트라이**
- 실시간으로 운동 시간을 측정하여 시각화를 통해, 혼자 집에서도 꾸준히 홈트를 진행하도록 동기 부여 🔥
- 매일 반복되는 운동 사이클 속 재미와 운동 습관 형성 ✨
- 그룹 내 랭킹 및 채팅 기능을 통해 그룹원들과 커뮤니케이션이 가능하며, 새로운 운동 지식과 오운완 인증까지! 💪🏻

<br />


### 팀원 소개
**FE**
| [정서윤(FE 테크리더)](https://github.com/yunn23) | [이도현](https://github.com/leedyun) |
|----------|----------|
| 로그인, 메인, 랭킹, 마켓, 마이페이지   | 로그인, 나의 그룹, 그룹 탐색, 채팅페이지 |

**BE**
| [정우재(팀장)](https://github.com/Woojae-Jeong) | [김수랑(BE 테크리더)](https://github.com/rdme0) | [박준형](https://github.com/cliant) | [조현서](https://github.com/hxunsc) |
|----------|----------|----------|----------|
| 나의 그룹, 그룹탐색 | 로그인, 채팅 | 메인  | 운동, 마켓  |

<br />

### 개발 기간
2024년 9월 ~ 11월


<br />

### 기술 스택
**프레임워크**
- React
- TypeScript
- Emotion Styled

<br/>

**개발 환경 세팅**
- eslint
- prettier


<br />

### 개발 문서
- [API 명세서](https://home-try.13.125.102.156.sslip.io/docs)
- [와이어 프레임](https://www.figma.com/design/TsCneAgt5ONEKWAiArCA6u/%EC%B9%B4%ED%85%8C%EC%BA%A0-%ED%99%88%ED%8A%B8%EB%9D%BC%EC%9D%B4-%EC%99%80%EC%9D%B4%EC%96%B4%ED%94%84%EB%A0%88%EC%9E%84_%EC%BF%A0%ED%82%A4zip?node-id=130-2033&t=idsBFD1mOYhPFPFk-1)
- ERD
  <img width="1082" alt="hometry_erd" src="https://github.com/user-attachments/assets/305e8114-5eb8-4ec1-b9c1-b80af45f9d92">
- [노션 위클리보드 - 공동 문서](https://quickest-asterisk-75d.notion.site/7b8ead85e5bc495a949fafeb01846587?v=aae07c49cc774787981f9752728a99fd)

<br />

### 주요 기능
- 총 운동 및 개별 운동 시간 측정
- 운동 일기 작성
- 그룹에 가입하여 그룹원들과 운동 랭킹을 확인하고 채팅 가능

<br />


### 개발 주안점
- 메인 페이지

  날짜별로 총 운동시간과 개별 운동 시간을 확인할 수 있습니다. 좌우 화살표를 누르거나, 날짜 클릭시 뜨는 달력 모달창으로 날짜를 선택할 수 있습니다. 새벽 홈트를 즐기는 사용자들도 고려하여 날짜 및 통계는 매일 오전 3시에 초기화됩니다.
  
  운동 시간 측정은 상세운동내역의 각 운동을 클릭하여 시작할 수 있으며, 운동 종료 버튼을 눌러 종료할 수 있습니다. 각 운동은 오른쪽의 메뉴 버튼을 눌러 삭제할 수도 있습니다. 총 운동 시간은 각 운동 시간의 합산입니다.

  하단에서는 운동 일기를 작성 및 삭제할 수 있으며, 일기 내용은 무한스크롤로 구현하였습니다.

  > 스톱워치 구현시 운동을 종료하지 않고 화면에서 이탈하면 다시 메인페이지에 접속했을시 이전 값이 불러와져 시간이 초기화 되어 보이는 문제가 있었습니다. 이에 응답 데이터에 운동을 시작한 시간은 startTime 값을 추가하여 운동이 진행중일시 '기존 운동시간 + (현재시간 - startTime) + 1초..' 로직으로 변경하여 페이지 이탈시에도 시간 값을 정상적으로 맞추었습니다.

<br />

- 그룹 탐색 페이지

  자신이 가입한 그룹 외의 모든 그룹을 탐색하고 가입할 수 있는 페이지입니다. 검색바와 태그 필터를 통해 원하는 그룹을 필터링하여 확인할 수 있습니다.

  각 그룹 컴포넌트를 누르면 그룹 설명이 담긴 가입 모달이 뜹니다.

  비밀번호가 있는 그룹은 비밀번호를 입력하고, 비밀번호가 없는 그룹은 그룹참여 버튼을 눌러 바로 가입 하실 수 있습니다.

  하단의 + 모양의 플로팅 버튼을 클릭하면 **그룹 생성 페이지**로 이동하여 그룹을 생성할 수 있습니다.

<br />

  
- 나의 그룹 페이지

  자신이 가입한 그룹을 확인할 수 있습니다. 전체 그룹, 가입한 그룹, 내가 만든 그룹을 각각 확인이 가능하며, 그룹을 삭제하거나 탈퇴할 수 있습니다.

  각 그룹 컴포넌트를 누르면 **랭킹 페이지**로 이동합니다.

<br />

- 랭킹 페이지

  해당 그룹원들의 날짜별 랭킹을 확인하실 수 있습니다. 좌우 클릭시 날짜가 이동하며 날짜 클릭시 뜨는 달력 모달로도 날짜를 선택할 수 있습니다.

  1, 2, 3등의 상위권 집계를 통해 그룹원들에게 동기부여를 주며, 시간이 0일시 순위권 집계에서 제외하도록 구현하였습니다.

  하단의 💬 모양의 플로팅 버튼을 클릭하면 **채팅 페이지**로 이동하게 됩니다. 

<br />

- 채팅 페이지

  해당 그룹원들과 소통을 할 수 있는 단체 채팅방입니다. STOMP 프로토콜을 사용하여 서버와 웹소켓 연결을 설정했으며 사용자가 메시지를 입력하고 전송 버튼을 클릭하면, STOMP 클라이언트를 통해 서버로 메시지를 전송합니다. 새로운 메시지가 도착하면, 화면은 자동으로 최신 메시지를 표시하도록 스크롤을 조정합니다. 사용자는 무한 스크롤을 통해 이전 메시지도 조회할 수 있습니다.

<br />

- 마켓 페이지

  홈트에 도움이 되는 운동기구나 식품의 온라인 구매처로 연결해주는 마켓 페이지입니다. 각 상품의 이미지, 이름, 온라인몰, 가격 정보를 알 수 있으며, 무한스크롤로 구현하였습니다. 페이지 상단에서는 태그를 통해 상품을 필터링 할 수 있습니다. 사용자가 상품을 클릭시 해당 사이트로 리다이렉트 되며, 각 사이트에서 수수료를 받을 수 있는 비즈니스 모델로서의 역할을 하는 페이지입니다.

<br />

- 마이 페이지

  사용자 정보와 출석 일수, 주간 및 월간 통계, 도움말을 확인할 수 있는 페이지입니다. 초기 가입시 랜덤으로 닉네임이 제공되며, 프로필 사진 옆 연필 모양을 눌러 닉네임을 변경할 수 있습니다. 회원탈퇴하기 버튼을 눌러 탈퇴할 수도 있습니다.

<br />

### 페이지별 화면 소개
- 아래 화면은 모바일에서 실제 웹을 캡쳐한 사진입니다.

|  메인 페이지  |  나의그룹 페이지  |  그룹탐색 페이지  |  마켓 페이지  |  마이 페이지  |
|----|----|----|----|----|
| ![hometry1_main1](https://github.com/user-attachments/assets/9fc74cd4-ab70-4327-b08f-82acc68e64fd)  |  ![hometry3_mygroup](https://github.com/user-attachments/assets/7bdaa928-2969-4d58-92fb-8d03930e30ac)  |  ![hometry6_searchgroup](https://github.com/user-attachments/assets/fa757def-2a30-4c73-b15b-ec3afd1e9d62)  |  ![hometry8_market](https://github.com/user-attachments/assets/b14ea3df-707c-47f8-a943-d4dac841e34f)  |  ![hometry9_mypage](https://github.com/user-attachments/assets/72ac9119-dcbc-4355-a8fd-61af96ca4a6a)  |
| ![hometry2_main2](https://github.com/user-attachments/assets/bafb30f9-6414-4ccf-bdea-7e9de334a7a1)  |  ![hometry4_ranking](https://github.com/user-attachments/assets/882128a9-a960-40c7-8c91-e71811327c96)  |  ![hometry7_addgroup](https://github.com/user-attachments/assets/3239c918-3b1c-4180-b654-42fd9a155254)  |    |    |
|    |  ![hometry5_chat](https://github.com/user-attachments/assets/956d16fc-6fc7-4977-85b7-c5c0820cc05b)  |    |    |    |



<br />

### 페이지별 기능 소개
| 분류              | 기능1                                  | 기능2                                 | 기능3                          | 기능4                         | 기능5      |
| ----------------- | --------------------------------------- | ------------------------------------- | ------------------------------ | ----------------------------- | ---------- |
| 로그인 페이지     | 카카오 소셜 로그인                     |                                       |                                |                               |            |
| 메인 페이지       | 날짜별 총 운동시간, 상세운동기록, 일기 조회 | 운동 추가, 삭제                      | 운동 시작, 종료               | 일기 작성, 삭제               |            |
| 나의 그룹 페이지  | 사용자가 가입하거나 만든 전체 그룹 조회 | 사용자가 가입한 그룹과 만든 그룹에 대한 필터링 | 그룹원들의 날짜별 운동시간에 대한 랭킹 조회 | 그룹 탈퇴                     |            |
| 그룹 탐색 페이지  | 전체 그룹 조회                         | 그룹 이름에 기반한 검색              | 그룹 태그를 이용한 필터링      | 비밀번호가 있으면 입력 후 그룹 가입, 없으면 바로 가입 | 그룹 생성 |
| 마켓 페이지       | 마켓 상품 조회                         | 상품 태그를 이용한 필터링            |                                |                               |            |
| 마이 페이지       | 닉네임 변경                            | 출석 일수, 운동 통계 조회            | 회원 탈퇴                      |                               |            |
| 관리자 로그인페이지 | 카카오 소셜 로그인                     |                                       |                                |                               |            |
| 관리자 상품 관리 페이지 | 상품 추가, 수정, 삭제                 |                                       |                                |                               |            |
| 관리자 상품 태그 관리 페이지 | 상품 태그 추가, 삭제                 |                                       |                                |                               |            |
| 관리자 팀 그룹 태그 관리 페이지 | 그룹 태그 추가, 삭제                 |                                       |                                |                               |            |


<br />

### 폴더 구조
```
src
 ┣ api
 ┃ ┣ hooks
 ┃ ┃ ┗ useIntersectionObserver.ts
 ┃ ┣ axiosInstance.ts
 ┃ ┣ deleteDiaryApi.ts
 ┃ ┣ deleteExerciseApi.ts
 ┃ ┣ deleteMember.ts
 ┃ ┣ getChatting.ts
 ┃ ┣ getGroup.ts
 ┃ ┣ getMain.ts
 ┃ ┣ getMarket.ts
 ┃ ┣ getMarketView.ts
 ┃ ┣ getMypage.ts
 ┃ ┣ getRanking.ts
 ┃ ┣ getTags.ts
 ┃ ┣ postExercise.ts
 ┃ ┣ postGroup.ts
 ┃ ┣ postStartExercise.ts
 ┃ ┣ putNickname.ts
 ┃ ┗ putStopExercise.ts
 ┣ assets
 ┃ ┣ chatbubble.svg
 ┃ ┣ kakao.png
 ┃ ┣ logo.png
 ┃ ┣ personal.png
 ┃ ┗ sneaker.png
 ┣ components
 ┃ ┣ DateSelect.tsx
 ┃ ┣ DiaryCreate.tsx
 ┃ ┣ Error.tsx
 ┃ ┣ ExerciseList.tsx
 ┃ ┣ Footer.tsx
 ┃ ┣ Group.tsx
 ┃ ┣ GroupList.tsx
 ┃ ┣ GroupListContainer.tsx
 ┃ ┣ GroupModal.tsx
 ┃ ┣ Loading.tsx
 ┃ ┣ MarketTagFilter.tsx
 ┃ ┣ Modal.tsx
 ┃ ┣ SearchBar.tsx
 ┃ ┣ TagFilter.tsx
 ┃ ┣ Timer.tsx
 ┃ ┗ TodayDiary.tsx
 ┣ mocks
 ┃ ┣ GroupMock.ts
 ┃ ┣ MainMock.ts
 ┃ ┣ ProductMock.ts
 ┃ ┣ RankingMock.ts
 ┃ ┣ TagMock.ts
 ┃ ┗ marketTag.ts
 ┣ pages
 ┃ ┣ AddGroup.tsx
 ┃ ┣ Chatting.tsx
 ┃ ┣ KakaoRedirect.tsx
 ┃ ┣ Login.tsx
 ┃ ┣ Main.tsx
 ┃ ┣ Market.tsx
 ┃ ┣ MyGroup.tsx
 ┃ ┣ MyPage.tsx
 ┃ ┣ Ranking.tsx
 ┃ ┗ SearchGroup.tsx
 ┣ routes
 ┃ ┗ AppRoutes.tsx
 ┣ App.css
 ┣ App.test.tsx
 ┣ App.tsx
 ┣ index.css
 ┣ index.tsx
 ┣ logo.svg
 ┣ react-app-env.d.ts
 ┣ reportWebVitals.ts
 ┗ setupTests.ts
```
