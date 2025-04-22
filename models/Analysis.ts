import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  calculatorType: {
    type: String,
    enum: ['mortgage', 'rental', 'airbnb', 'wholesale'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  version: {
    type: Number,
    default: 1,
  },
  pdfUrl: {
    type: String,
  },
  csvUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying
analysisSchema.index({ userId: 1, calculatorType: 1 });
analysisSchema.index({ tags: 1 });

// Update the updatedAt timestamp on save
analysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema); 