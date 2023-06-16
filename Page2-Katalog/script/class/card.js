class Card {
   constructor(card, templateSelector) {
      this._name = card.name;
      this._image = card.image;
      this._templateSelector =templateSelector
   }

   _getTemplate() {
      return document
      .querySelector(this._templateSelector)
      .content
      .querySelector(".card")
      .cloneNode(true);
   }

   _findElementsCard() {
      this._cardImg = this._cardImage.querySelector('.card__image')
      this._cardName = this._cardImage.querySelector('.card__name')
      this._cardTitle = this._cardImage.querySelector('.card__title_title')
   }

   generateCard() {
      this._cardImage = this._getTemplate();
      this._findElementsCard();
      this._cardImg.src = `${this._image}`;
      this._cardName.textContent = `${this._name}`;
      this._cardTitle.textContent = `${this._cardTitle}`

      return this._cardImage;
   }
}

export default Card;