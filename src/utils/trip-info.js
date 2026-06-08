import dayjs from 'dayjs';
import {sortPointDay} from './sort.js';

const DESTINATION_NAMES_MAX_COUNT = 3;

export const getTripTitle = (points, destinations) => {
  const sortedPoints = [...points].sort(sortPointDay);

  const destinationNames = sortedPoints.map((point) => {
    const destination = destinations.find((dest) => dest.id === point.destination);
    return destination ? destination.name : (point.destination && point.destination.name) || point.destination || '';
  });


  if (destinationNames.length <= DESTINATION_NAMES_MAX_COUNT) {
    return destinationNames.join('&nbsp;&mdash;&nbsp;');
  }

  return `${destinationNames[0]}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames[destinationNames.length - 1]}`;
};

export const getTripDates = (points) => {
  const sortedPoints = [...points].sort(sortPointDay);

  if (sortedPoints.length === 0) {
    return '';
  }

  const startDate = sortedPoints[0].dateFrom;
  const endDate = sortedPoints[sortedPoints.length - 1].dateTo;

  const startDayjs = dayjs(startDate);
  const endDayjs = dayjs(endDate);

  if (startDayjs.month() === endDayjs.month()) {
    return `${startDayjs.format('D MMM')}&nbsp;&mdash;&nbsp;${endDayjs.format('D MMM')}`;
  }

  return `${startDayjs.format('D MMM')}&nbsp;&mdash;&nbsp;${endDayjs.format('D MMM')}`;
};

export const getTripCost = (points, offers) => points.reduce((total, point) => {
  let cost = point.basePrice;
  const pointOffers = offers.find((offer) => offer.type === point.type);

  if (pointOffers && point.offers.length > 0) {
    point.offers.forEach((offerId) => {
      const offer = pointOffers.offers.find((o) => o.id === offerId);
      if (offer) {
        cost += offer.price;
      }
    });
  }

  return total + cost;
}, 0);
