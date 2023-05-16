const apiUrl = "http://openapi.seoul.go.kr:8088/";
const serviceKey = "795367464b676f7738394459797242";
const endPoint = "json/culturalEventInfo/1/1000/";
const eventList = document.getElementById("event-list");

// Get event type filter element
const eventTypeFilter = document.getElementById("event-type");
const eventLocationFilter = document.getElementById("event-location");

// Fetch data and create event items
fetch(apiUrl + serviceKey + "/" + endPoint)
  .then((response) => response.json())
  .then((data) => {
    const events = data.culturalEventInfo.row;

    // Sort events by END_DATE in ascending order
    events.sort((a, b) => new Date(a.END_DATE) - new Date(b.END_DATE));

    const filterEvents = () => {
      const eventType = eventTypeFilter.value;
      const eventLocation = eventLocationFilter.value;

      // Get today's date
      const today = new Date();

      // If no filters are selected, show all events
      if (!eventType && !eventLocation) {
        return events.filter((event) => {
          // Convert END_DATE to a Date object
          const endDate = new Date(event.END_DATE);

          // Filter out events with an END_DATE before today
          return endDate >= today;
        });
      }

      // If only event type filter is selected, show events with selected event type
      if (eventType && !eventLocation) {
        return events.filter((event) => {
          // Convert END_DATE to a Date object
          const endDate = new Date(event.END_DATE);

          // Filter out events with an END_DATE before today and with a different event type
          return endDate >= today && event.CODENAME === eventType;
        });
      }

      // If only event location filter is selected, show events with selected event location
      if (!eventType && eventLocation) {
        return events.filter((event) => {
          // Convert END_DATE to a Date object
          const endDate = new Date(event.END_DATE);

          // Filter out events with an END_DATE before today and in a different location
          return endDate >= today && event.GUNAME === eventLocation;
        });
      }

      // Otherwise, show events with selected event type and location
      return events.filter((event) => {
        // Convert END_DATE to a Date object
        const endDate = new Date(event.END_DATE);

        // Filter out events with an END_DATE before today, in a different location, or with a different event type
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
          if (property.key === "ORG_LINK") {
            const orgLink = event[property.key];
            if (orgLink.length > 20) {
              // 일정 길이 이상인 경우
              const shortenedLink = orgLink.substring(0, 20) + " ..."; // 일부분만 보여주도록 함
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

    // Initial event list update
    updateEventList();

    // Add event type filter change listener
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
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
