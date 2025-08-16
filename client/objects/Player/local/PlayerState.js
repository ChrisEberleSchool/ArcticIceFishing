export default class PlayerState {
  constructor(username) {
    this.username = username;
    this.target = null;
    this.speed = 130;
    this.facing = "down";
    this.isMoving = false;
    this.distToTarget = 3;
    this.fishing = false;
  }
}
