export default class Interactable {
  constructor(x, y, type = "generic") {
    this.isOccupied = false; // Can an entity use it right now
    this.GridPos = { x, y }; // Grid coordinates
    this.type = type; // Optional: type of interactable
    this.data = {}; // Optional: store custom data
  }
}
