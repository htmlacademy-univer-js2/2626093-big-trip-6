import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = `Basic ${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const SELECTORS = {
  PAGE_MAIN: '.page-main',
  PAGE_HEADER: '.page-header',
  TRIP_MAIN: '.trip-main',
  TRIP_CONTROLS_FILTERS: '.trip-controls__filters',
  TRIP_EVENTS: '.trip-events',
  NEW_POINT_BUTTON: '.trip-main__event-add-btn',
};

const siteMainElement = document.querySelector(SELECTORS.PAGE_MAIN);
const siteHeaderElement = document.querySelector(SELECTORS.PAGE_HEADER);
const tripMainElement = siteHeaderElement.querySelector(SELECTORS.TRIP_MAIN);
const tripControlsFilters = siteHeaderElement.querySelector(SELECTORS.TRIP_CONTROLS_FILTERS);
const tripEventsElement = siteMainElement.querySelector(SELECTORS.TRIP_EVENTS);

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsElement,
  pointsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFilters,
  filterModel,
  pointsModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripMainElement,
  pointsModel,
});

const handleNewPointFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  document.querySelector('.trip-main__event-add-btn').disabled = true;
};

// Initially disable button until data loads
document.querySelector('.trip-main__event-add-btn').disabled = true;
document.querySelector('.trip-main__event-add-btn').addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
boardPresenter.init();
tripInfoPresenter.init();
pointsModel.init()
  .finally(() => {
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  });
