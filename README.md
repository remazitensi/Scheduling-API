# Scheduling API Project

## 프로젝트 개요 (Project Overview)

이 프로젝트는 예약 시스템을 지원하기 위한 스케줄링 API를 구현합니다. 서버는 주어진 날짜와 시간대를 기준으로 유효한 타임슬롯을 제공하며, 이벤트 및 업무 시간과의 중첩을 고려하여 타임슬롯을 필터링합니다.

## 기능 (Features)

- **타임슬롯 생성**: 요청 날짜와 시간대에 따라 유효한 타임슬롯을 생성합니다.
- **이벤트와의 중첩 방지**: 이벤트와 겹치는 타임슬롯을 제외하여 생성합니다.
- **업무 시간과의 중첩 방지**: 근무 시간 외 타임슬롯은 제외하며, 전체 일정 조회 옵션을 제공합니다.
- **요청 유효성 검사**: 클라이언트 요청의 정확성을 검증하며, 오류를 반환합니다.

## 전체 구조 (Overall Structure)

![image](https://github.com/user-attachments/assets/ff774e7d-c969-4e93-8020-467710247392)


이 프로젝트는 주요 구성 요소인 컨트롤러, 서비스, 유틸리티, 모델, 테스트로 구성되어 있습니다.

### 구성 요소별 역할 (Roles of Each Component)

- **TimeSlotController**: 클라이언트 요청을 받아 서비스에 전달하고 결과를 반환합니다.
- **getDayTimetables (Service)**: 타임슬롯 생성 로직을 처리하며, 시간대와 중복 필터링을 수행합니다.
- **Utilities**: 시간 변환 및 요청 데이터 유효성 검사를 처리합니다.
- **모델 (DayTimetable, Timeslot, Event, Workhour)**: API의 데이터 구조를 정의합니다.
- **테스트 디렉토리**: 서비스와 유효성 검사 함수의 테스트를 포함하여 코드의 정확성을 보장합니다.

## 테스트 (Testing)

프로젝트의 각 기능은 **Jest**를 통해 테스트되었으며, 주요 테스트 내용은 다음과 같습니다:

- **유효한 요청에 대한 타임슬롯 반환**
- **잘못된 요청에 대한 오류 메시지 반환**
- **타임존 및 Unix 타임스탬프 변환 검증**
- **이벤트 및 업무 시간과의 중첩 필터링**
- **`is_ignore_schedule`이 `true`일 때 24시간 슬롯 생성 여부 확인**
- **`is_day_off`이 `true`일 때 휴일로 처리되는지 검증**


## 트러블슈팅 (Troubleshooting)

### 문제와 해결 방법

1. **UTC vs Local Timezone 처리 문제**
   - **문제**: 타임존에 따른 `start_of_day` 계산에서 UTC와 로컬 타임의 일관성 유지가 어려웠습니다.
   - **해결**: UTC 기준으로 타임스탬프를 처리하여 전역적으로 일관된 기준을 유지했습니다.
  
2. **입력 유효성 검사 문제**
   - **문제**: 요청 데이터의 유효성 검사 미흡으로 인해 오류 발생 가능성이 높았습니다.
   - **해결**: 유효성 검사 로직을 분리하고 모든 요청 필드를 정밀하게 검증했습니다.

3. **스케줄링 조건에 따른 중첩 필터링 문제**
   - **문제**: 이벤트와 업무 시간 중복을 처리할 때 조건에 따른 로직이 복잡해졌습니다.
   - **해결**: 필터링 로직을 모듈화하여 각 조건을 독립적으로 처리했습니다.

## 과제를 통해 배운 점 (What I Learned)

이 프로젝트를 통해 **API 설계의 중요성**을 깊이 이해하게 되었으며, 특히 **시간대 처리와 요청 유효성 검사의 복잡성**을 다루는 법을 배웠습니다. 데이터의 **확장성과 유지 보수성**을 고려한 설계가 API 개발의 핵심 요소임을 명확히 인식하게 되었습니다.

**유효성 검사 로직을 유틸리티로 분리함으로써 재사용성과 가독성을 향상시킬 수 있다는 점을 배웠습니다.** 이로 인해 **유지보수가 용이해지고 독립적인 테스트가 가능**해졌습니다. 그러나 **모듈 간의 의존성 증가와 오버엔지니어링의 위험성**도 있다는 것을 이해하게 되었습니다.

또한, **express-validator 라이브러리를 사용하지 않은 이유**는 프로젝트 요구사항에 맞춘 맞춤형 유효성 검사 로직을 구현하기 위해서였습니다. **외부 라이브러리에 대한 의존성을 최소화함으로써 코드의 이해도를 높이고**, 특정 비즈니스 로직에 더 적합한 방식으로 유효성 검사를 수행할 수 있음을 깨달았습니다.

## 참고 자료 (References)

- [타임존 처리](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
- [Jest를 이용한 TypeScript 애플리케이션 테스트](https://jestjs.io/docs/getting-started#typescript)
- [유효성 검사](https://nozzlegear.com/blog/build-a-simple-object-validation-utility-with-typescript)

