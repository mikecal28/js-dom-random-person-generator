class ParticipantWrapper {
  constructor(firstName) {
    this.firstName = titleCase(firstName);
    this.weight = 1;
    this.originalNode =
      document.querySelector(".left-body-wrapper").lastElementChild;
    this.participantNode = this.originalNode.cloneNode(true);
    this.participantNode.firstChild.nextSibling.innerHTML = this.firstName;
    this.participantNode.children[1].firstChild.data = this.weight;
    this.participantNode.id = "cloned-node";
    this.participantNode.style.display = "grid";
    this.originalNode.after(this.participantNode);
  }
}

const storageArray = [];
let fullParticipantArrayLength = 0;

const titleCase = (someName) => {
  console.log("someName: ", someName);
  const letterArray = Array.from(someName);
  let titledName =
    letterArray[0].toUpperCase() + letterArray.slice(1).join("") + ":";
  return titledName;
};

const delay = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });

async function streamNames() {
  const nameDisplay = document.querySelector(".random-person");
  let previousName = "";
  let counter = 0;
  if (fullParticipantArrayLength >= storageArray.length) {
    while (counter < fullParticipantArrayLength + 4 - storageArray.length) {
      for (let currentName of storageArray) {
        if (currentName !== previousName) {
          await delay();
          nameDisplay.innerHTML = currentName.slice(0, -1);
        }
        previousName = currentName;
      }
      counter++;
    }
  } else {
    while (counter < storageArray.length + 2 - fullParticipantArrayLength) {
      for (let currentName of storageArray) {
        if (currentName !== previousName) {
          await delay();
          nameDisplay.innerHTML = currentName.slice(0, -1);
        }
        previousName = currentName;
      }
      counter++;
    }
  }
}

let colorCounter = 0;
const flashText = (element, color) => {
  if (element.style.color === "rgb(20, 24, 58)") {
    element.style.color = color;
  } else {
    element.style.color = "rgb(20, 24, 58)";
  }
  colorCounter++;
  return colorCounter;
};

const main = async () => {
  const participantsArea = document.querySelector(".left-body-wrapper");
  participantsArea.firstElementChild.style.display = "none";

  // const participantsArray = await fetch(
  //   "https://devpipeline-mock-api.herokuapp.com/api/get-users"
  // )
  //   .then((response) => response.json())
  //   .then((data) => data.users);

  const participantsArray = [{ first_name: "" }];

  fullParticipantArrayLength = participantsArray.length;
  for (let obj of participantsArray) {
    storageArray.push(titleCase(obj.first_name));
    const firstParticipant = new ParticipantWrapper(obj.first_name);
  }

  const startGenerator = document.querySelector(".start-button");
  const addWeightButton = document.querySelectorAll(".up-icon-div");
  const subtractWeightButton = document.querySelectorAll(".down-icon-div");

  startGenerator.addEventListener("click", async (e) => {
    const nameDisplay = document.querySelector(".random-person");
    const chosenParticipant = storageArray.at(
      Math.floor(Math.random() * storageArray.length)
    );
    await streamNames();

    nameDisplay.innerHTML = chosenParticipant.slice(0, -1);
    nameDisplay.style.color = "skyblue";

    const beginFlashText = setInterval(() => {
      const handleFlashText = flashText(nameDisplay, "skyblue");
      if (handleFlashText > 15) {
        clearInterval(beginFlashText);
        nameDisplay.style.color = "rgb(20, 24, 58)";
        colorCounter = 0;
      }
    }, 300);

    const allParticipants = document.querySelectorAll(".participant-name");
    allParticipants.forEach((person) => {
      if (person.innerText === chosenParticipant) {
        const weightAmount =
          person.parentElement.firstElementChild.nextSibling.nextSibling
            .innerText;

        const nextWeight = Number(`${weightAmount}`) - 1;
        if (nextWeight >= 0) {
          person.parentElement.firstElementChild.nextSibling.nextSibling.innerHTML =
            nextWeight;
        }
        if (storageArray.includes(chosenParticipant)) {
          storageArray.splice(storageArray.indexOf(chosenParticipant), 1);
        }
      }
    });
  });

  addWeightButton.forEach((button) =>
    button.addEventListener("click", (e) => {
      const currentParticipant =
        e.target.parentElement.parentElement.parentElement.firstElementChild
          .innerHTML;

      const weightAmount =
        e.target.parentElement.parentElement.parentElement.firstElementChild
          .nextSibling.nextSibling.innerText;

      const nextWeight = Number(`${weightAmount}`) + 1;
      e.target.parentElement.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerHTML =
        nextWeight;

      storageArray.splice(
        storageArray.indexOf(currentParticipant),
        0,
        currentParticipant
      );
    })
  );

  subtractWeightButton.forEach((button) =>
    button.addEventListener("click", (e) => {
      let theTarget = e.target;

      function subtractWeight(theParticipant) {
        const currentParticipant =
          theTarget.parentElement.parentElement.parentElement.firstElementChild
            .innerHTML;

        const weightAmount =
          theTarget.parentElement.parentElement.parentElement.firstElementChild
            .nextSibling.nextSibling.innerText;

        const nextWeight = Number(`${weightAmount}`) - 1;
        if (nextWeight >= 0) {
          theTarget.parentElement.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerHTML =
            nextWeight;
        }

        if (storageArray.includes(currentParticipant)) {
          storageArray.splice(storageArray.indexOf(currentParticipant), 1);
        }
      }
      subtractWeight(theTarget);

      Math.floor(Math.random() * storageArray.length + 1);
    })
  );
};

main();
