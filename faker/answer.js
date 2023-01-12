import Answer from '../models/Answer.js';
import { faker } from '@faker-js/faker';

const run = async (limit) => {
  try {
    let data = [];

    for (let i = 0; i < limit; i++) {
      data.push({
        '63bf8abc56d85c66111e5a02': faker.name.fullName(),
        '63bf8abfae546b30fd4d1a89': faker.helpers.arrayElement([
          'Pria',
          'Wanita',
        ]),
        '63bf8ac2ae546b30fd4d1a8b': faker.helpers.arrayElements([
          'Ayam goreng',
          'Mie',
          'Nasi goreng',
        ]),
        formId: '63bf860026c641c309f390a9',
        userId: '63bf84e6c350b5fc40d4fd66',
      });
    }

    const fakeData = await Answer.insertMany(data);
    if (fakeData) {
      console.log('Data berhasil diinsert');
      process.exit()
    }
  } catch (error) {
    console.log(error);
    process.exit()
  }
};

export { run };
