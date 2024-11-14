import Users from "../dao/Users.dao.js";
import { customError } from "../errors/custom.error.js";


export class UserServices {
  constructor() {
    this.userDao = new Users();
  }

  async getAll() {
    const users = await this.userDao.get();
    return users;
  }

  async getById(id) {
    const user = await this.userDao.getBy(id);
    if (!user) throw customError.notFoundError(`User with ID ${id} not found`);
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.userDao.getByEmail(email);
    return user;
  }

  async create(data) {
    const user = await this.userDao.save(data);
    return user;
  }

  async createMany(data) {
    const users = await this.userDao.saveMany(data);
    return users;
  }

  async update(id, data) {
    const user = await this.userDao.update(id, data);
    return user;
  }

  async remove(id) {
    await this.userDao.delete(id);
    return "ok";
  }
}