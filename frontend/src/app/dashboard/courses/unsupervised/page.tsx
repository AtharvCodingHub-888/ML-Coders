import { redirect } from "next/navigation";

export default function UnsupervisedCourseRedirect() {
    redirect("/dashboard/courses/unsupervised/master");
}
