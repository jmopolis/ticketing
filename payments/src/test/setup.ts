import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
  var mongoId: () => string;
}

let mongo: any;

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51Jq3PYDiQ5HwMbwPuiQQM6S5OBlyHfca0eBiRY0skU1DJXK7VmHTXUW7SKeFp4dIulc2sNeumlzShh6THAPSzmbE00S7eziUeW';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.mongoId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

global.signin = (id?: string) => {
  // build a JWT payload { id, emeail }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'fake@email.com',
  };

  // create the jwt!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object
  const session = { jwt: token };

  // turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string  with the encoded data
  return [`express:sess=${base64}`];
};
