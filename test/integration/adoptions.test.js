import { expect } from "chai";
import supertest from "supertest";

const adoptionRequest = supertest("http://localhost:8080/api/adoptions");
const userRequest = supertest("http://localhost:8080/api/users");
const petRequest = supertest("http://localhost:8080/api/pets");
const sessionRequest = supertest("http://localhost:8080/api/sessions");

describe("Adoptions Integration Test", () => {
    let userTest;
    let testPet;
    let adoptionTest;

    //User register

    it("[POST]/api/sessions/register - Must register a user", async () => {
      const newUser = {
        first_name: "Roberto",
        last_name: "Carlos",
        email: "robertito@gmail.com",
        password: "robertocarloscrack",
      };
  
      const { status, body } = await sessionRequest.post("/register").send(newUser);
      userTest = body.payload;
  
      expect(status).to.equal(201);
      expect(body.status).to.equal("success");
      expect(body.payload).to.be.an("object");
      expect(body.payload.email).to.equal(newUser.email);
      expect(body.payload.first_name).to.equal(newUser.first_name);
      expect(body.payload.last_name).to.equal(newUser.last_name);
      expect(body.payload.password).to.not.equal(newUser.password);
    });

    // User login

    it("[POST] /api/sessions/login - Must log in a user", async () => {
        const data = {
          email: "robertito@gmail.com",
          password: "robertocarloscrack",
        };
    
        const { status, body } = await sessionRequest.post("/login").send(data);
        
        expect(status).to.equal(200);
        expect(body.status).to.equal("success");
        expect(body.message).to.be.an("string");
      });

  //Pet creation

  it("[POST] /api/pets - Must create a pet", async () => {
    const newPet = {
        name: "Carlos",
        specie: "Palomo",
        birthDate: "11/03/2024",
        image: "CarlosBauteElPalomo",
    };
    const { status, body } = await petRequest.post("/").send(newPet);
    testPet = body.payload;
    expect(status).to.equal(201);
    expect(body.payload).to.be.an("object");
    expect(body.payload.name).to.equal ("Carlos");
    expect(body.payload.specie).to.equal("Palomo");
    expect(body.payload.adopted).to.equal(false);
});

  // Adopt a pet - Valid adoption

  it("[POST] /api/adoptions/:uid/:pid - Must adopt a pet", async () => {
    const { status, body } = await adoptionRequest.post(`/${userTest._id}/${testPet._id}`).send();

    expect(status).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.message).to.equal("Pet adopted");

    adoptionTest = body.payload;
  });

  

  // Attempt to adopt a pet that's already adopted 

  it("[POST] /api/adoptions/:uid/:pid - Must fail if pet is already adopted", async () => {
    const { status, body } = await adoptionRequest.post(`/${userTest._id}/${testPet._id}`).send();

    expect(status).to.equal(400);
    expect(body.status).to.equal("error");
    expect(body.error).to.equal("Pet is already adopted");
  });

  // Get all adoptions - Validate response

  it("[GET] /api/adoptions - Must return all adoptions", async () => {
    const { status, body } = await adoptionRequest.get("/");

    expect(status).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.be.an("array");
    expect(body.payload.length).to.be.greaterThan(0);
  });

  // Search adoption by ID
  it("[GET] /api/adoptions/:aid - Must return a specific adoption", async () => {
    const { status, body } = await adoptionRequest.get(`/${adoptionTest._id}`);

    expect(status).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.have.property("owner", userTest._id.toString());
    expect(body.payload).to.have.property("pet", testPet._id.toString());
  });


// When not finding adoption by ID - Must return error
it("[GET] /api/adoptions/:aid - Must return 400 if adoption is not found", async () => {
    const invalidAdoptionId = "invalidAdoptionId";
    
    const { status, body } = await adoptionRequest.get(`/${invalidAdoptionId}`);
  
    expect(status).to.equal(400);
    expect(body.status).to.equal("error");
    expect(body.error).to.equal("Invalid Adoption ID");
  });
  
//DB Cleanup

after(async () => {
    if (adoptionTest && adoptionTest._id) {
      await adoptionRequest.delete(`/${adoptionTest._id}`);
    }
    await userRequest.delete(`/${userTest._id}`);
    await petRequest.delete(`/${testPet._id}`);
  });
});

