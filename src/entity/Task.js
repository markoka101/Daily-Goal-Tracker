class Task {
  constructor(name, username, description, status, dateCreated, dueDate) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.dateCreated = dateCreated;
    this.dueDate = dueDate;
    this.usernamme = username;
  }

  editDescription(description) {
    this.description = description;
  }

  editStatus(status) {
    this.status = status;
  }

  editDueDate(dueDate) {
    this.dueDate = dueDate;
  }
}

module.exports = Task;
