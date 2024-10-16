# 인사, 노무 챗봇

이 프로젝트는 인사 및 노무 관련 질문을 처리하는 AI 기반 챗봇 애플리케이션입니다. 서버는 Flask로 구현되었으며, 프론트엔드는 React Native와 Expo를 사용하여 개발되었습니다.

## 기술 스택

- 백엔드: Flask (Python)
- 프론트엔드: React Native, Expo
- 데이터베이스: MongoDB
- AI 모델: OpenAI GPT

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- AI 기반 인사/노무 질문 응답
- 채팅 기록 저장 및 조회
- 사용자 프로필 관리

## 요구사항

- Node.js (LTS 버전)
- npm
- Git
- Expo CLI (`npm install -g expo-cli`)
- Expo Go 앱 (모바일 테스트용)
- Python 3.8+
- Java Development Kit (JDK) 17
- Android Studio (안드로이드 개발 시)
- MongoDB

## 설치 및 실행

### 백엔드 설정

1. 프로젝트 클론:
   ```
   git clone [repository-url]
   cd [project-directory]/flask-server
   ```

2. 가상 환경 생성 및 활성화:
   ```
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. 의존성 설치:
   ```
   pip install -r requirements.txt
   ```

4. 환경 변수 설정:
   - `config.py` 파일에 필요한 API 키와 데이터베이스 URI를 설정하세요.

5. 서버 실행:
   ```
   python app.py
   ```

### 프론트엔드 설정

1. 프로젝트 디렉토리로 이동:
   ```
   cd [project-directory]/chatbot_app
   ```

2. 의존성 설치:
   ```
   npm install
   ```

3. 앱 실행:
   ```
   npx expo start
   ```

## 사용 방법

1. Expo Go 앱을 통해 QR 코드를 스캔하거나, 에뮬레이터를 사용하여 앱을 실행합니다.
2. 회원가입 후 로그인합니다.
3. 채팅 화면에서 인사/노무 관련 질문을 입력합니다.
4. AI의 응답을 확인하고, 필요시 추가 질문을 할 수 있습니다.
