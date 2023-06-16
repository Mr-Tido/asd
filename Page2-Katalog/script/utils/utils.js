import {
   cardGrid,
} from "../index.js";
import Card from "../class/card.js";
import { initialCards } from "../arrays/ArraysCard.js";

export {
   creatingCards,
};

function createCard(item) {
   const card = new Card(item, "#place-card");
   const cardElement = card.generateCard();
   return cardElement;
}

function creatingCards() {
   initialCards.forEach((item) => cardGrid.append(createCard(item)));
}



