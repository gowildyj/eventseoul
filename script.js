const apiUrl = "http://openapi.seoul.go.kr:8088/";
const serviceKey = "795367464b676f7738394459797242";
const endPoint = "json/culturalEventInfo/1/1000/";
const eventList = document.getElementById("event-list");

// 이벤트 목록 필터
const eventTypeFilter = document.getElementById("event-type");
const eventLocationFilter = document.getElementById("event-location");

// 데이터 불러오기
fetch(apiUrl + serviceKey + "/" + endPoint)
  .then((response) => response.json())
  .then((data) => {
    const events = data.culturalEventInfo.row;

    // 오름차순으로 END_DATE 끝나는 날짜정렬
    events.sort((a, b) => new Date(a.END_DATE) - new Date(b.END_DATE));

    //셀렉트박스 value
    const filterEvents = () => {
      const eventType = eventTypeFilter.value;
      const eventLocation = eventLocationFilter.value;

      // 오늘 날짜 구하기
      const today = new Date();

      // type, location 둘 다 셀렉트박스 선택되지 않으면 전체목록 보여주기
      if (!eventType && !eventLocation) {
        return events.filter((event) => {
          // END_DATE를 Date 객체로 생성
          const endDate = new Date(event.END_DATE);

          // END_DATE가 오늘 날짜보다 큰 값 리턴
          return endDate >= today;
        });
      }

      // event type 이 필터링 되었을 때
      if (eventType && !eventLocation) {
        return events.filter((event) => {
          // END_DATE를 Date 객체로 생성
          const endDate = new Date(event.END_DATE);

          // END_DATE가 오늘 날짜보다 큰 값을 가지면서 CODENAME 이 필터링한 이벤트 타입과 같은 값 리턴
          return endDate >= today && event.CODENAME === eventType;
        });
      }

      // event location 이 필터링 되었을 때
      if (!eventType && eventLocation) {
        return events.filter((event) => {
          // END_DATE를 Date 객체로 생성
          const endDate = new Date(event.END_DATE);

          // END_DATE가 오늘 날짜보다 큰 값을 가지면서 GUNAME 이 필터링한 이벤트 타입과 같은 값 리턴
          return endDate >= today && event.GUNAME === eventLocation;
        });
      }

      // 선택된 이벤트 값 리턴
      return events.filter((event) => {
        // END_DATE를 Date 객체로 생성
        const endDate = new Date(event.END_DATE);

        // endDate가 오늘 날짜보다 미래이면서, CODENAME, GUNAME 이 선택된 이벤트 리턴
        return (
          endDate >= today &&
          event.CODENAME === eventType &&
          event.GUNAME === eventLocation
        );
      });
    };

    const updateEventList = () => {
      const filteredEvents = filterEvents();

      // 이벤트 리스트 초기화
      eventList.innerHTML = "";
      // 각각의 이벤트마다 div 생성하고 event__item 클래스추가
      filteredEvents.forEach((event) => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event__item");

        // Add title
        const titleElement = document.createElement("h2");
        titleElement.classList.add("event__title");
        titleElement.textContent = event.TITLE;
        eventItem.appendChild(titleElement);

        // Add image
        const imageElement = document.createElement("img");
        imageElement.src = event.MAIN_IMG;
        eventItem.appendChild(imageElement);

        // Add properties
        const properties = [
          { key: "CODENAME", label: "종류" },
          { key: "GUNAME", label: "지역" },
          { key: "DATE", label: "날짜" },
          { key: "PLACE", label: "장소" },
          { key: "ORG_LINK", label: "바로가기" },
        ];

        properties.forEach((property) => {
          const propertyElement = document.createElement("p");
          propertyElement.classList.add("event__property");
          if (property.key === "ORG_LINK") {
            const orgLink = event[property.key];
            if (orgLink.length > 20) {
              // 일정 길이 이상인 경우 일부분만 보여주도록 함
              const shortenedLink = orgLink.substring(0, 20) + " ...";

              propertyElement.innerHTML = `<strong>${property.label}:</strong> <a href="${orgLink}" target="_blank">${shortenedLink}</a>`;
            } else {
              propertyElement.innerHTML = `<strong>${property.label}:</strong> <a href="${orgLink}" target="_blank">${orgLink}</a>`;
            }
          } else {
            propertyElement.innerHTML = `<strong>${property.label}:</strong> ${
              event[property.key]
            }`;
          }
          eventItem.appendChild(propertyElement);
        });

        eventList.appendChild(eventItem);
      });
    };

    // updateEventList 함수호출
    updateEventList();

    // eventTypeFilter, eventLocationFilter 값이 변경되면 updateEventList 함수 호출
    eventTypeFilter.addEventListener("change", updateEventList);
    eventLocationFilter.addEventListener("change", updateEventList);
  })
  .catch((error) => console.error(error));

/* 맨 위로 버튼 */
var scrollToTopBtn = document.getElementById("scroll-to-top");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

function scrollToTop() {
  const header = document.getElementById("title");
  const heroSection = document.querySelector(".hero");

  if (window.scrollY < heroSection.offsetHeight) {
    // 화면이 hero 에 있으면 top으로 스크롤
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    // 화면이 hero 에 있으면  header로 스크롤
    header.scrollIntoView({
      behavior: "smooth",
    });
  }
}
