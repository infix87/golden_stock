# 주식 투자 도우미 (Stock Investment Helper)

네이버 금융의 골든크로스 종목을 자동으로 수집하고, 관련 뉴스를 보여주는 웹사이트입니다.

## 주요 기능
- **골든크로스 탐지**: 네이버 금융 페이지를 실시간으로 스크래핑하여 골든크로스 발생 종목을 수집합니다.
- **뉴스 수집**: 선택한 종목의 최신 뉴스를 네이버 금융에서 가져와 제공합니다.
- **즐겨찾기**: 관심 있는 종목에 별(★)을 표시하여 'Favorites' 탭에서 따로 관리할 수 있습니다.
- **반응형 대시보드**: React와 TailwindCSS로 제작된 깔끔한 카드 UI를 제공합니다.

## 실행 방법

### 백엔드 (Python/FastAPI)
```bash
cd backend
# 가상환경 권장 (선택)
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 프론트엔드 (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속하세요.

## 파일 구조
- `/backend`: FastAPI 서버, DB 모델, 스크래퍼 (`stock_collector.py`, `news_scraper.py`)
- `/frontend`: React 앱, UI 컴포넌트 (`StockCard.tsx`, `App.tsx`)

## 서버 배포 및 실행 가이드

서버(Linux/Ubuntu 등)에서 이 프로젝트를 실행하는 방법입니다.

### 1. 코드 다운로드 (Clone)
먼저 GitHub에 올린 코드를 서버로 내려받습니다.
```bash
# git 설치 (없을 경우)
sudo apt update
sudo apt install git

# 코드 클론
git clone <GitHub_리포지토리_URL>
cd stock-investment-helper
```

### 2. 백엔드 설정 (Python)
Python 3.8 이상이 필요합니다.
```bash
cd backend

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 백엔드 서버 실행 (백그라운드 실행 시 nohup 사용 권장)
# --host 0.0.0.0 옵션은 외부 접속 허용
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. 프론트엔드 설정 (Node.js)
Node.js 18 이상이 필요합니다.
```bash
# 새 터미널에서 실행
cd frontend

# 의존성 설치
npm install

# 개발용 서버 실행 (외부 접속 허용 시 --host)
npm run dev -- --host

# 또는 프로덕션 빌드 후 실행 (권장)
npm run build
npm run preview -- --host
```

> **참고**: 프로덕션 환경에서는 `nginx` 등을 사용하여 프론트엔드 빌드 파일(`dist/`)을 정적 호스팅하고, `/api` 요청만 백엔드 포트(8000)로 프록시하는 것이 좋습니다.

### 4. 최신 코드 업데이트 (Pull)
이미 코드를 다운로드 받은 상태에서 최신 변경사항만 가져오려면:
```bash
cd stock-investment-helper

# 최신 코드 가져오기
git pull

# 필요 시 패키지 업데이트 및 재시작
# (requirements.txt나 package.json이 변경되었을 경우)
# 백엔드
cd backend
pip install -r requirements.txt
# 서버 재시작 필요 (Ctrl+C 후 다시 실행 또는 서비스 재시작)

# 프론트엔드 (변경사항 반영을 위해 다시 빌드)
cd ../frontend
npm install
npm run build
```
