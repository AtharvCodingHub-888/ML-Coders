import { createServerClient } from "./supabase";

export interface MLModel {
    id: string;
    user_id: string;
    name: string;
    type: string;
    parameters: Record<string, any>;
    accuracy?: number;
    created_at: string;
}

export interface TrainingData {
    id: string;
    model_id: string;
    features: number[];
    label: number | string;
    created_at: string;
}

export interface Prediction {
    id: string;
    model_id: string;
    user_id: string;
    input: Record<string, any>;
    output: Record<string, any>;
    confidence?: number;
    created_at: string;
}

export async function saveModel(userId: string, name: string, type: string, parameters: Record<string, any>, accuracy?: number) {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("ml_models")
        .insert({ user_id: userId, name, type, parameters, accuracy })
        .select()
        .single();

    if (error) return null;
    return data as MLModel;
}

export async function getModels(userId: string) {
    const supabase = createServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("ml_models")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data as MLModel[];
}

export async function saveTrainingData(modelId: string, features: number[], label: number | string) {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("training_data")
        .insert({ model_id: modelId, features, label })
        .select()
        .single();

    if (error) return null;
    return data as TrainingData;
}

export async function savePrediction(modelId: string, userId: string, input: Record<string, any>, output: Record<string, any>, confidence?: number) {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("predictions")
        .insert({ model_id: modelId, user_id: userId, input, output, confidence })
        .select()
        .single();

    if (error) return null;
    return data as Prediction;
}

export async function getPredictions(userId: string, modelId?: string) {
    const supabase = createServerClient();
    if (!supabase) return [];

    let query = supabase.from("predictions").select("*").eq("user_id", userId);
    if (modelId) query = query.eq("model_id", modelId);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) return [];
    return data as Prediction[];
}
