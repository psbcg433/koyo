import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import validator from "validator";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: [true, 'Video file URL is required'],
        validate: {
            validator: validator.isURL,
            message: 'Please provide a valid URL for the video file',
        }
    },
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
        validate: {
            validator: validator.isURL,
            message: 'Please provide a valid URL for the thumbnail',
        }
    },
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true,
        index: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        index: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 second'],
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Video must be associated with a user']
    }
}, {
    timestamps: true  
});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
