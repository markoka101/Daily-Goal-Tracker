class User {
  constructor(name, settings) {
    this.name = name;
    this.settings = settings;
  }

  getSetting() {
    return this.settings;
  }

  setSetting(setting) {
    this.settings = setting;
  }

  getName() {
    return this.name;
  }

  setNane(name) {
    this.name = name;
  }
}

module.exports = User;
