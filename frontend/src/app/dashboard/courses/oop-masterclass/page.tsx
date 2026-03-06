import { redirect } from "next/navigation";

export default function OOPCourseRedirect() {
    // Automatically teleport the user to our actual 3D content
    redirect("/dashboard/courses/oop-masterclass/master");
}
