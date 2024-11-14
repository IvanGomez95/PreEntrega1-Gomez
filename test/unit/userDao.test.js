import Users from "../../src/dao/Users.dao.js";
import mongoose from "mongoose";
import { expect } from "chai";

mongoose.connect("mongodb://localhost:27017/Adoptions");

describe("Test UserDao", () => {
  const userDao = new Users();
  let userTest;

  before(() => {
    console.log("Beggining of the tests");
  });

  beforeEach(() => {
    console.log("Executing an individual test");
  });

  it("Must return all users", async () => {
    const users = await userDao.get();
    expect(users).to.be.an("array");
    expect(users).to.be.not.an("object");
  });

  it("Must create and return a user", async () => {
    const newUser = {
      first_name: "Ronaldo",
      last_name: "Nazario",
      email: "elgorditoroni@gmail.com",
      password: "gordoroni2002",
      age: 180,
      birthDate: "18/09/1976",
    };

    const user = await userDao.save(newUser);
    userTest = user;
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.equal(newUser.first_name);
    expect(user.last_name).to.equal(newUser.last_name);
    expect(user.email).to.equal(newUser.email);
    expect(user.password).to.equal(newUser.password);
    expect(user.role).to.equal("user");

    expect(user).to.not.have.property("age");
    expect(user).to.not.have.property("birthDate");
    expect(user).to.not.be.null;
    expect(user).to.not.be.an("array");
  });

  it("Must return a user by ID", async () => {
    const user = await userDao.getBy(userTest._id);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.equal(userTest.first_name);
    expect(user.last_name).to.equal(userTest.last_name);
    expect(user.email).to.equal(userTest.email);
    expect(user.password).to.equal(userTest.password);
  });

  it("Must update a user", async () => {
    const updateData = {
      first_name: "Carlangas",
      password: "Carlangas470",
    };

    const user = await userDao.update(userTest._id, updateData);
    expect(user).to.be.an("object");
    expect(user).to.have.property("_id");
    expect(user.first_name).to.equal("Carlangas");
    expect(user.last_name).to.equal(userTest.last_name);
    expect(user.email).to.equal(userTest.email);
    expect(user.password).to.equal("Carlangas470");
  });

  it("Must delete the user", async () => {
    await userDao.delete(userTest._id);
    const user = await userDao.getBy(userTest._id);
    expect(user).to.be.null;
  })

  afterEach(() => {
    console.log("Individual test ended");
  });

  after(async () => {
    console.log("Testing ended");
    mongoose.disconnect();
  });
});