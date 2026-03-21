import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    size: { type: Number, required: true },
    authorId: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    preserve: { type: Boolean, default: false },
});

export default model('File', fileSchema);