import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: { type: String },
    description: { type: String },
    questions: {
      type: Array,
    },
    invites: {
      type: Array,
    },
    public: {
      type: Boolean,
    },
    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);

Schema.plugin(mongoosePaginate);

Schema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'formId',
});

Schema.set('toJSON', { virtuals: true });
export default mongoose.model('Form', Schema);
