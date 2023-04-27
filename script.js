const apiUrl = "http://openapi.seoul.go.kr:8088/";
      const serviceKey = "795367464b676f7738394459797242";
      const endPoint = "json/culturalEventInfo/1/5/";
      const titleList = document.querySelector(".here");

      fetch(apiUrl + serviceKey + "/" + endPoint)
        .then((response) => response.json())
        .then((data) => {
          const events = data.culturalEventInfo.row;

          //데이터 목록에서 제목 불러오기
          events.forEach((event) => {
            const title = event.TITLE;
            const titleElement = document.createElement("p");
            titleElement.textContent = title;
            titleList.appendChild(titleElement);
          });
        })
        .catch((error) => console.error(error));