import React from "react";
import AddCourse from "../AddCourse/AddCourse"

export default function EditCourse() {
  return (
    <div className="w-full">
      <AddCourse isEdit={true} />
    </div>
  );
}
