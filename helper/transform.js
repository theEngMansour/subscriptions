export const transformEvent = (event) => ({
  ...event,
  date: new Date(event.date).toDateString(),
});

export const transformBooking = (booking) => ({
  ...booking,
  createdAt: new Date(booking.createdAt).toDateString(),
  updatedAt: new Date(booking.updatedAt).toDateString(),
});