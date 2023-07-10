window.onload = () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      function generateUniqueList(count, max) {
        const uniqueList = [];
        const numSet = new Set();

        while (uniqueList.length < count) {
          const num = Math.floor(Math.random() * max);

          if (!numSet.has(num)) {
            uniqueList.push(num);
            numSet.add(num);
          }
        }

        return uniqueList;
      }

      function getQueryParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams;
      }

      let abilitiesIndex = generateUniqueList(24, data.length);

      const queryParams = getQueryParams();
      if (queryParams.has("data")) {
        const dataValue = queryParams.get("data");
        const dataArray = dataValue.split(",");
        abilitiesIndex = dataArray;
      }

      const url = `${location.origin}${
        location.pathname
      }?data=${abilitiesIndex.join(",")}`;
      history.replaceState(null, "", url);

      for (let i = 0; i < 24; i++) {
        let ability = data[abilitiesIndex[i]];

        if (i == 12) {
          const container = document.getElementById("container");
          const div = document.createElement("div");
          div.classList.add("cell", "yubi");
          container.appendChild(div);
        }

        const container = document.getElementById("container");
        const div = document.createElement("div");
        div.textContent = ability["name"];
        div.classList.add("cell", ability["type"]);

        let dataIndex = container.children.length;
        div.setAttribute("data-index-x", dataIndex % 5);
        div.setAttribute("data-index-y", Math.floor(dataIndex / 5));
        if (dataIndex % 5 == Math.floor(dataIndex / 5)) {
          div.setAttribute("data-index-z", "0");
        }
        if (dataIndex % 5 == 4 - Math.floor(dataIndex / 5)) {
          div.setAttribute("data-index-z", "1");
        }

        div.addEventListener("click", () => {
          div.classList.toggle("checked");

          const bingo = document.querySelectorAll(".bingo");

          bingo.forEach((element) => {
            element.classList.remove("bingo");
          });

          for (let direction of ["x", "y", "z"]) {
            for (let index = 0; index < 5; index++) {
              const elements = document.querySelectorAll(
                `div[data-index-${direction}="${index}"]`
              );

              let isAllChecked = true;
              elements.forEach((element) => {
                if (!element.classList.contains("checked")) {
                  isAllChecked = false;
                }
              });
              if (isAllChecked) {
                elements.forEach((element) => {
                  element.classList.add("bingo");
                });
              }
            }
          }
        });
        container.appendChild(div);
      }
    });
};
