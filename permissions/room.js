const { ROLE } = require("../data");

function canViewRoom(user, room) {
  return user.role === ROLE.ADMIN || room.userId === user.id;
}

function canAddRoom(user, room) {
  return user.role === ROLE.ADMIN || room.userId === user.id;
}

function canEditRoom(user, room) {
  return user.role === ROLE.ADMIN || room.userId === user.id;
}

function canDeleteRoom(user, room) {
  return user.role === ROLE.ADMIN || room.userId === user.id;
}

function scopedRooms(user, rooms) {
  if (user.role === ROLE.ADMIN) return rooms;
  return rooms.filter((room) => room.userId === user.id);
}

module.exports = {
  canViewRoom,
  scopedRooms,
  canDeleteRoom,
  canAddRoom,
  canEditRoom,
};
