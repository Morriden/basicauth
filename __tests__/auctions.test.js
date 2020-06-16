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

  it('creates a new auction via the post route', () => {
    return request(app)
      .post('/api/v1/auctions/create')
      .auth('test@test.com', 'password1234')
      .send({
        title: 'Auction 1',
        description: 'Auction of stuff',
        quantity: 5,
        Date: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: newUser.id,
          title: 'Auction 1',
          description: 'Auction of stuff',
          quantity: 5,
          Date: expect.anything()
        });
      });
  });
  it('finds an auction by id', () => {
    return request(app)
      .get(`/api/v1/auctions/${newAuction._id}`)
      .auth('test@test.com', 'password1234')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          bids: [{
            _id: expect.anything(),
            accepted: true,
            auction: newAuction.id,
            price: 1,
            quantity: 2,
            user: newUser.id
          }],
          user: newUser.id,
          title: 'title',
          description: 'description',
          quantity: 4,
          Date: expect.anything()
        });
      });
  });
  it('get all auctions', () => {
    return request(app)
      .get('/api/v1/auctions')
      .auth('test@test.com', 'password1234')
      .then(res => {
        expect(res.body).toEqual([{
          title: 'title',
          _id: expect.anything()
        }]);
      });
  });
});
