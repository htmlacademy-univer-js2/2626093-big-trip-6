import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

function createSortItemTemplate(sortType, label, currentSortType, isDisabled = false) {
  const isChecked = sortType === currentSortType ? 'checked' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${isChecked} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}" style="user-select: none" draggable="false">${label}</label>
    </div>`
  );
}

function createSortTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get" autocomplete="off" novalidate>
      ${createSortItemTemplate(SortType.DAY, 'Day', currentSortType)}
      ${createSortItemTemplate(SortType.EVENT, 'Event', currentSortType, true)}
      ${createSortItemTemplate(SortType.TIME, 'Time', currentSortType)}
      ${createSortItemTemplate(SortType.PRICE, 'Price', currentSortType)}
      ${createSortItemTemplate(SortType.OFFER, 'Offers', currentSortType, true)}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
