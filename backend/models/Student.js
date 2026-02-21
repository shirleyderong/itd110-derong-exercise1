const mongoose = require("mongoose");

const ALLOWED_GPA = [
  1.0, 1.25, 1.5, 1.75,
  2.0, 2.25, 2.5, 2.75,
  3.0, 3.25, 3.5, 3.75,
  4.0, 5.0
];

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    course: { type: String, required: true, trim: true },

    age: { type: Number, min: 16, max: 100 },
    gpa: {
      type: Number,
      enum: ALLOWED_GPA,
      required: false
    },

    inc: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentSchema.pre("save", function () {
  if (this.inc) return;
  if (this.gpa !== undefined && this.gpa !== null) {
    this.gpa = Number(Number(this.gpa).toFixed(2));
  }
});

studentSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() || {};
  const $set = update.$set || update;

  if ($set.inc !== true && $set.gpa !== undefined && $set.gpa !== null) {
    $set.gpa = Number(Number($set.gpa).toFixed(2));
  }

  this.setUpdate(update.$set ? { ...update, $set } : $set);
});

studentSchema.virtual("gradeDisplay").get(function () {
  if (this.inc) return "INC";
  if (this.gpa === undefined || this.gpa === null) return "N/A";

  const g = this.gpa;

  if (g >= 1.0 && g < 1.25) return "Excellent";
  if (g >= 1.25 && g < 1.5) return "Superior";
  if (g >= 1.5 && g < 1.75) return "Very Good";
  if (g >= 1.75 && g < 2.0) return "Good";
  if (g >= 2.0 && g < 2.25) return "Very Satisfactory";
  if (g >= 2.25 && g < 2.5) return "High Average";
  if (g >= 2.5 && g < 2.75) return "Average";
  if (g >= 2.75 && g < 3.0) return "Fair";
  if (g >= 3.0 && g < 4.0) return "Pass";
  if (g >= 4.0 && g < 5.0) return "Conditional";
  return "Failing";
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);