//const ans = "APPLE";

let index = 0; //수정이 가능
let attempts = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료했습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position: absolute; top: 40vh; left: 30%; width: 200px; height: 100px;";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) {
      return gameover();
    }

    attempts++;
    index = 0; //초기화
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let ansCount = 0;
    //서버에서 정답을 받아오는 코드
    const reply = await fetch("/answer");
    const ans = await reply.json(); //javascript object notation

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const letter = block.innerText;
      const ansLetter = ans[i];

      if (letter === ansLetter) {
        ansCount++;
        block.style.background = "#6AAA64";
      } else if (ans.includes(letter)) {
        block.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
      }
      block.style.color = "white";
    }
    if (ansCount === 5) {
      gameover();
    } else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index--;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") {
        handleEnterKey();
      } else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++; // index += 1; // index = index + 1;
    }
  };

  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const presentTime = new Date();
      const pastTime = new Date(presentTime - startTime);
      const min = pastTime.getMinutes().toString().padStart(2, "0");
      const sec = pastTime.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");

      timeDiv.innerText = `${min}:${sec}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();

  window.addEventListener("keydown", handleKeydown);
}

appStart();
