const diaries = [];
export default class Diary {
  constructor({ title, body, author }) {
    const now = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    this.title = title;
    this.body = body;
    this.author = author;
    this.id = Number(now.toString().concat(random));
  }

  static save(diary) {
    return new Promise((resolve, reject) => {
      try {
        if (diary instanceof this) {
          diaries.push(diary);
          resolve(diary);
        } else {
          throw new Error(`${diary} is not a diary`);
        }
      } catch (e) {
        reject(new Error(e));
      }
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const diary = diaries.find(entry => entry.id === Number(id));
      if (diary) {
        resolve(diary);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndUpdate(id, update) {
    return new Promise((resolve, reject) => {
      const index = diaries.findIndex(entry => entry.id === Number(id));
      if (index >= 0) {
        resolve(diaries[index].modify(update));
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
      const index = diaries.findIndex(entry => entry.id === Number(id));
      const diary = diaries.find(entry => entry.id === Number(id));
      if (index >= 0) {
        diaries.splice(index, 1);
        resolve(diary);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static find(condition = true) {
    return new Promise((resolve) => {
      const entries = diaries.filter(entry => condition);
      resolve(entries);
    });
  }

  modify({ title, body }) {
    this.title = title;
    this.body = body;
    return this;
  }
}
export { diaries };
