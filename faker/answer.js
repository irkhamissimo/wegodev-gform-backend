import Answer from '../models/Answer.js';
import { faker } from '@faker-js/faker';

const run = async () => {
  try {
    let data = [];

    for (let i = 0; i < 100; i++) {
      data.push({
        '63b13ff36068c2e4aa8cce63': faker.name.fullName(),
        '63b5590974de1df130820748': faker.helpers.arrayElement([
          '40',
          '41',
          '42',
        ]),
        '63b5597574de1df13082074d': faker.helpers.arrayElements([
          'nasi goreng',
          'masakan padang',
          'mie goreng',
        ]),
        formId: '63b00059c00149903bcf0663',
        userId: '63a06d297e23f93e31667b40',
      });
    }
    Answer.insertMany(data);
  } catch (error) {
    console.log(error)
  }
};

export {run}
