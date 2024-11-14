import { expect } from "chai";
import supertest from "supertest";

const request = supertest("http://localhost:8080/api/pets");

describe("Pets Integration Test", () => {
    let testPet;

    //Getting Pets array

    it("[GET]/api/pets - Must return a pets array", async () => {
        const { status, body } = await request.get("/");
        expect(status).to.equal(200);
        expect(body.payload).to.be.an("array");
    });

    // Creating a pet

    it("[POST]/api/pets - Must create a pet", async () => {
        const newPet = {
            name: "Carlos",
            specie: "Palomo",
            birthDate: "11/03/2024",
            image: "CarlosBauteElPalomo",
        };
        const { status, body } = await request.post("/").send(newPet);
        testPet = body.payload;
        expect(status).to.equal(201);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.equal ("Carlos");
        expect(body.payload.specie).to.equal("Palomo");
        expect(body.payload.adopted).to.equal(false);
    });

    // Pet update

    it("[PUT]/api/pets/:pid - Must update a pet", async () => {
        const newPet = {
            name: "Patricio",
            specie: "Estrella",
        };
        const { status, body } = await request.put(`/${testPet._id}`).send(newPet);
        expect(status).to.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload.name).to.equal ("Patricio");
        expect(body.payload.specie).to.equal("Estrella");
        expect(body.payload.adopted).to.equal(false);
    });

    // DB Cleanup
    it("[DELETE]/api/pets/:pid - Must delete a pet", async () => {

        const { status, body } = await request.delete(`/${testPet._id}`);

        expect(status).to.equal(200);
        expect(body.message).to.equal("pet deleted");
    });
});
