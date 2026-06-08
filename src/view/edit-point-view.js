import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import {POINT_TYPES} from '../const.js';
import {humanizeFullDate} from '../utils/date.js';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createEditPointTemplate(point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, type, isSaving, isDeleting, id} = point;
  const isFormDisabled = isSaving || isDeleting;
  // unique suffix for IDs
  const pointId = id || 'new';

  const pointDestination = destinations.find((dest) => dest.id === point.destination);
  const pointTypeOffers = offers.find((offer) => offer.type === type);
  const currentPointOffers = pointTypeOffers ? pointTypeOffers.offers : [];

  const destinationName = pointDestination ? pointDestination.name : '';
  const destinationDescription = pointDestination ? pointDestination.description : '';
  const destinationPictures = pointDestination ? pointDestination.pictures : [];

  const typeList = POINT_TYPES.map((pointType) => `
    <div class="event__type-item">
      <input id="event-type-${pointType}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''} ${isFormDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${pointId}">${pointType.charAt(0).toUpperCase() + pointType.slice(1)}</label>
    </div>
  `).join('');

  const offersList = currentPointOffers.map((offer) => {
    const isChecked = point.offers.includes(offer.id) ? 'checked' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${pointId}" type="checkbox" name="event-offer-${offer.id}" ${isChecked} data-offer-id="${offer.id}" ${isFormDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}-${pointId}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');

  const destinationOptions = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');

  const picturesList = destinationPictures.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `).join('');

  let resetButtonLabel;
  if (point.id) {
    resetButtonLabel = isDeleting ? 'Deleting...' : 'Delete';
  } else {
    resetButtonLabel = 'Cancel';
  }

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post" autocomplete="off" novalidate>
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox" ${isFormDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeList}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${pointId}" autocomplete="off" autocapitalize="off" spellcheck="false" ${isFormDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-${pointId}">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizeFullDate(dateFrom)}" autocomplete="off" ${isFormDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizeFullDate(dateTo)}" autocomplete="off" ${isFormDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="number" name="event-price" value="${basePrice}" min="0" step="1" inputmode="numeric" autocomplete="off" ${isFormDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isFormDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="button" ${isDeleting ? 'disabled' : ''}>
            ${resetButtonLabel}
          </button>
          ${point.id ? `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          ` : ''}
        </header>
        <section class="event__details">
          ${currentPointOffers.length ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersList}
              </div>
            </section>
          ` : ''}

          ${(destinationDescription || destinationPictures.length) ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationDescription}</p>
              ${destinationPictures.length ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${picturesList}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleFormClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, pointDestinations, pointOffers, onFormSubmit, onFormClick, onDeleteClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClick = onFormClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#pointDestinations, this.#pointOffers);
  }

  removeElement() {
    const pointId = this._state.id || 'new';
    const fromInput = this.element?.querySelector(`#event-start-time-${pointId}`);
    const toInput = this.element?.querySelector(`#event-end-time-${pointId}`);

    if (fromInput) {
      fromInput.removeEventListener('focus', this.#initFromDatepicker);
      fromInput.removeEventListener('click', this.#initFromDatepicker);
    }

    if (toInput) {
      toInput.removeEventListener('focus', this.#initToDatepicker);
      toInput.removeEventListener('click', this.#initToDatepicker);
    }

    super.removeElement();

    this.#destroyDatepicker(this.#datepickerFrom);
    this.#datepickerFrom = null;
    this.#destroyDatepicker(this.#datepickerTo);
    this.#datepickerTo = null;
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#formClickHandler);
    }
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    const availableOffers = this.element.querySelector('.event__available-offers');
    if (availableOffers) {
      availableOffers.addEventListener('change', this.#offerChangeHandler);
    }

    this.#setDatepicker();
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#pointDestinations.find((dest) => dest.name === evt.target.value);

    if (!selectedDestination) {
      evt.target.value = '';
      this.updateElement({
        destination: null,
      });
      return;
    }

    this.updateElement({
      destination: selectedDestination.id,
    });
  };

  #offerChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedBoxes.map((element) => element.dataset.offerId)
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #destroyDatepicker(datepicker) {
    if (datepicker) {
      datepicker.destroy();
    }
  }

  #initFromDatepicker = () => {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.open();
      return;
    }

    const pointId = this._state.id || 'new';
    const fromInput = this.element.querySelector(`#event-start-time-${pointId}`);

    this.#destroyDatepicker(this.#datepickerTo);
    this.#datepickerTo = null;

    this.#datepickerFrom = flatpickr(
      fromInput,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        closeOnSelect: false,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #initToDatepicker = () => {
    if (this.#datepickerTo) {
      this.#datepickerTo.open();
      return;
    }

    const pointId = this._state.id || 'new';
    const toInput = this.element.querySelector(`#event-end-time-${pointId}`);

    this.#destroyDatepicker(this.#datepickerFrom);
    this.#datepickerFrom = null;

    this.#datepickerTo = flatpickr(
      toInput,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        closeOnSelect: false,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );

    this.#datepickerTo.open();
  };

  #setDatepicker() {
    const pointId = this._state.id || 'new';
    const fromInput = this.element.querySelector(`#event-start-time-${pointId}`);
    const toInput = this.element.querySelector(`#event-end-time-${pointId}`);

    this.#initFromDatepicker();

    fromInput.addEventListener('focus', this.#initFromDatepicker);
    fromInput.addEventListener('click', this.#initFromDatepicker);
    toInput.addEventListener('focus', this.#initToDatepicker);
    toInput.addEventListener('click', this.#initToDatepicker);
  }

  static parsePointToState(point) {
    return {...point,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
