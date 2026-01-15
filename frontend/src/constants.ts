// API 기본 URL 설정
// 로컬 개발 시: http://localhost:8100
// 서버 배포 시: http://devgiraffe.cafe24.com:8100
// 환경 변수(VITE_API_URL)가 있으면 그것을 우선 사용하고, 없으면 서버 주소를 기본값으로 사용합니다.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://devgiraffe.cafe24.com:8100';
