/**
 * TypeScript types mirroring the Supabase database schema.
 * Update these if you modify the tables in supabase/schema.sql.
 */

export interface Profile {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    xp: number;
    level: number;
    rank_title: string;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: string;
    slug: string;
    title: string;
    category: "mathematics" | "python" | "ml";
    color: string;
    icon: string;
    sort_order: number;
    is_locked: boolean;
    created_at: string;
}

export interface CoursePhase {
    id: string;
    course_id: string;
    phase_number: number;
    title: string;
    content_markdown: string;
    is_locked: boolean;
    created_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    course_id: string;
    phase_id: string;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
}

// Supabase Database type — used by createClient<Database>()
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: {
                    id: string;
                    email: string;
                    name?: string | null;
                    avatar_url?: string | null;
                    xp?: number;
                    level?: number;
                    rank_title?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Omit<Profile, "id" | "created_at">>;
                Relationships: [];
            };
            courses: {
                Row: Course;
                Insert: Omit<Course, "id" | "created_at"> & { id?: string };
                Update: Partial<Omit<Course, "id" | "created_at">>;
                Relationships: [
                    {
                        foreignKeyName: "course_phases_course_id_fkey";
                        columns: ["id"];
                        referencedRelation: "course_phases";
                        referencedColumns: ["course_id"];
                    }
                ];
            };
            course_phases: {
                Row: CoursePhase;
                Insert: Omit<CoursePhase, "id" | "created_at"> & { id?: string };
                Update: Partial<Omit<CoursePhase, "id" | "created_at">>;
                Relationships: [
                    {
                        foreignKeyName: "course_phases_course_id_fkey";
                        columns: ["course_id"];
                        referencedRelation: "courses";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_progress: {
                Row: UserProgress;
                Insert: {
                    user_id: string;
                    course_id: string;
                    phase_id: string;
                    id?: string;
                    completed?: boolean;
                    completed_at?: string | null;
                    created_at?: string;
                };
                Update: Partial<Omit<UserProgress, "id" | "created_at">>;
                Relationships: [
                    {
                        foreignKeyName: "user_progress_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_progress_course_id_fkey";
                        columns: ["course_id"];
                        referencedRelation: "courses";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_progress_phase_id_fkey";
                        columns: ["phase_id"];
                        referencedRelation: "course_phases";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
        CompositeTypes: {};
    };
}
