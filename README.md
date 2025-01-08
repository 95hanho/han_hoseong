# 사용설명서

## 기본 세팅 

> nodejs 설치

> 패키지 파일들 설치
> - cd ./프로젝트명
>
> - npm install
>
> - UI템플릿 파일
> - /public 디렉토리에 intra서버/wintra.exc.co.kr/template 디렉토리 넣기
> - /public/template 이렇게 있어야함

## 실행

npm run dev
* API쪽 CORS 확인필요없음

## 빌드

page.svelte파일의 iframe태그 주석해제, vite.config.js의 publicDir 부분 주석해제 후   
npm run build

후에 '/dist'의 파일들 'wintra.exc.co.kr'에 복사/덮어쓰기    
주석해제부분 원상복귀
