import mongoose from 'mongoose';

const maintenanceScheduleSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled'
  }
});

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  description: String,
  images: [String],
  amenities: [String],
  maintenanceSchedule: [maintenanceScheduleSchema]
}, {
  timestamps: true
});

export const Court = mongoose.model('Court', courtSchema);