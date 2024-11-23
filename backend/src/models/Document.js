// // backend/src/models/Document.js
// import mongoose from 'mongoose';

// const DocumentSchema = new mongoose.Schema({
//   originalName: {
//     type: String,
//     required: [true, 'Original file name is required'],
//     trim: true
//   },
//   fileName: {
//     type: String,
//     required: [true, 'Generated file name is required'],
//     unique: true
//   },
//   fileType: {
//     type: String,
//     required: [true, 'File type is required'],
//     enum: [
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'application/pdf'
//     ]
//   },
//   size: {
//     type: Number,
//     required: [true, 'File size is required'],
//     max: [10 * 1024 * 1024, 'File size cannot exceed 10MB']
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   },
//   pdfPath: {
//     type: String,
//     default: null
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'converted', 'failed'],
//     default: 'pending'
//   },
//   metadata: {
//     type: mongoose.Schema.Types.Mixed,
//     default: {}
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual to get human-readable file size
// DocumentSchema.virtual('humanReadableSize').get(function() {
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   if (this.size === 0) return '0 Byte';
//   const i = parseInt(Math.floor(Math.log(this.size) / Math.log(1024)));
//   return Math.round(this.size / Math.pow(1024, i), 2) + ' ' + sizes[i];
// });

// // Pre-save hook to validate file size
// DocumentSchema.pre('save', function(next) {
//   if (this.size > 10 * 1024 * 1024) {
//     return next(new Error('File size cannot exceed 10MB'));
//   }
//   next();
// });

// // Static method to find recent documents
// DocumentSchema.statics.findRecent = function(limit = 10) {
//   return this.find()
//     .sort({ uploadDate: -1 })
//     .limit(limit);
// };

// const Document = mongoose.model('Document', DocumentSchema);

// export default Document;

import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  fileName: {
    type: String,
    required: [true, 'Generated file name is required'],
    unique: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf'
    ]
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    max: [10 * 1024 * 1024, 'File size cannot exceed 10MB']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  pdfPath: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'converted', 'failed'],
    default: 'pending'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  passwordProtected: { // New field for password protection
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get human-readable file size
DocumentSchema.virtual('humanReadableSize').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.size === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(this.size) / Math.log(1024)));
  return Math.round(this.size / Math.pow(1024, i), 2) + ' ' + sizes[i];
});

// Pre-save hook to validate file size
DocumentSchema.pre('save', function(next) {
  if (this.size > 10 * 1024 * 1024) {
    return next(new Error('File size cannot exceed 10MB'));
  }
  next();
});

// Static method to find recent documents
DocumentSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ uploadDate: -1 })
    .limit(limit);
};

const Document = mongoose.model('Document', DocumentSchema);

export default Document;
