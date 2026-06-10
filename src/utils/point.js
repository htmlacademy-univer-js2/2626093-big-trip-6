export const getDestinationById = (destinations, destinationId) => destinations.find((destination) => destination.id === destinationId);

export const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type);
