import { redirect } from "next/navigation";

export default function SupervisedCourseRedirect() {
    redirect("/dashboard/courses/supervised/master");
}
