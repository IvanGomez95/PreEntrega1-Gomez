import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/sessions");
const userRequest = supertest("http://localhost:8080/api/users");

describe("Sessions Integration Test", () => {
  let userTest;

  //User register

  it("[POST]/api/sessions/register - Must register a user", async () => {
    const newUser = {
      first_name: "Roberto",
      last_name: "Carlos",
      email: "robertito@gmail.com",
      password: "robertocarloscrack",
    };

    const { status, body } = await request.post("/register").send(newUser);
    userTest = body.payload;

    expect(status).to.equal(201);
    expect(body.status).to.equal("success");
    expect(body.payload).to.be.an("object");
    expect(body.payload.email).to.equal(newUser.email);
    expect(body.payload.first_name).to.equal(newUser.first_name);
    expect(body.payload.last_name).to.equal(newUser.last_name);
    expect(body.payload.password).to.not.equal(newUser.password);
  });

  //User login

  it("[POST] /api/sessions/login - Must log in a user", async () => {
    const data = {
      email: "robertito@gmail.com",
      password: "robertocarloscrack",
    };

    const { status, body } = await request.post("/login").send(data);
    
    expect(status).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.message).to.be.an("string");
  });


  //DB Cleanup
  
  after(async () => {
    await userRequest.delete(`/${userTest._id}`)
  });
});