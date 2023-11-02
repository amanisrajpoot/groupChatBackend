const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const expect = chai.expect;
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

const testUser = {
  id: "65377dd972825a988e8957f0",
  name: "Test User",
  role: "admin",
};

const userId = "65377dd972825a988e8957f0";

const roomId = "65440302e0b5d7add577cf13";
const memberName = "Aman";
const messageId = "65440302e0b5d7add577cf19";

const accessTokenSecret =
  "510bb99eb137fec4003c5c3f631599fcaa1826df7c57d205138d2c19bb7b7616e5f4fd603b62e84f8e6f4b303201527ccfaa10e748f3be0e6d40ecf54a51ebed";

const token = jwt.sign(testUser, accessTokenSecret);

describe("Room Routes", () => {
  it("should get all rooms", (done) => {
    chai
      .request(app)
      .get("/api/rooms")
      .set("Authorization", `Bearer ${token}`) // Include the JWT token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should create a room", (done) => {
    chai
      .request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Room",
        members: ["Member1", "Member2"],
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Room created successfully");
        done();
      });
  });

  it("should update a room", (done) => {
    chai
      .request(app)
      .put(`/api/rooms/${roomId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Room Name",
        members: ["Updated Member1", "Updated Member2"],
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Room updated successfully");
        done();
      });
  });

  it("should delete a room", (done) => {
    chai
      .request(app)
      .delete(`/api/rooms/${roomId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Room deleted successfully");
        done();
      });
  });

  it("should get users of a room", (done) => {
    chai
      .request(app)
      .get(`/api/rooms/${roomId}/users`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        // Add more assertions as needed
        done();
      });
  });

  it("should update a member in a room", (done) => {
    chai
      .request(app)
      .put(`/api/rooms/:${roomId}/members/:${memberName}`) // Replace :roomId and :memberName with actual values
      .send({ newMemberName: "NewMemberName" }) // Replace with the updated data
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal(
          "Member details updated successfully"
        );
        done();
      });
  });

  it("should add a user to a room", (done) => {
    chai
      .request(app)
      .post(`/api/rooms/${roomId}/users`) // Replace with a valid room ID
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "newUserId", // Replace with a valid user ID
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("User added to room successfully");
        done();
      });
  });

  it("should get a member by name in a room", (done) => {
    chai
      .request(app)
      .get(`/api/rooms/${roomId}/members/${memberName}`) // Replace with a valid room ID and member name
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.member).to.equal("MemberName");
        done();
      });
  });

  it("should remove a user from a room", (done) => {
    chai
      .request(app)
      .delete(`/api/rooms/${roomId}/users/${userId}`) // Replace with a valid room ID and user ID
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "User removed from room successfully"
        );
        done();
      });
  });

  it("should get messages in a room", (done) => {
    chai
      .request(app)
      .get(`/api/rooms/${roomId}/messages`) // Replace with a valid room ID
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // Add more assertions based on the response data structure
        done();
      });
  });

  it("should send a message in a room", (done) => {
    chai
      .request(app)
      .post(`/api/rooms/${roomId}/messages`) // Replace with a valid room ID
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: "Test Message",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Message sent successfully");
        done();
      });
  });

  it("should add a like to a message in a room", (done) => {
    chai
      .request(app)
      .post(`/api/rooms/${roomId}/messages/${messageId}/like`) // Replace with valid room and message IDs
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Like added successfully");
        done();
      });
  });
});
