const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/user');
const Auction = require('../lib/models/auction');
const Bid = require('../lib/models/bid');

describe('auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let newUser;
  let newAuction;
  let newBid;

  beforeEach(async() => {
    newUser = await User.create({
      email: 'test@test.com',
      password: 'password1234'
    });
    newAuction = await Auction.create({
      user: newUser.id,
      title: 'title',
      description: 'description',
      quantity: 4,
      Date: Date.now()
    });
    newBid = await Bid.create({
      auction: newAuction.id,
      user: newUser.id,
      price: 1,
      quantity: 2,
      accepted: true
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('post route to create a new bid or update it', () => {
    return request(app)
      .post('/api/v1/bids')
      .auth('test@test.com', 'password1234')
      .send({
        auction: newAuction.id,
        user: newUser.id,
        price: 10,
        quantity: 3,
        accepted: false 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: newAuction.id,
          user: newUser.id,
          price: 10,
          quantity: 3,
          accepted: false
        });
      });
  });

  it('gets a bid by id with details', () => {
    return request(app)
      .get(`/api/v1/bids/${newBid._id}`)
      .auth('test@test.com', 'password1234')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: newAuction.id,
          user: newUser.id,
          price: 1,
          quantity: 2,
          accepted: true
        });
      });
  });

  it('deletes a bid', () => {
    return request(app)
      .delete(`/api/v1/bids/${newBid._id}`)
      .auth('test@test.com', 'password1234')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: newAuction.id,
          user: newUser.id,
          price: 1,
          quantity: 2,
          accepted: true  
        });
      });
  });
});
