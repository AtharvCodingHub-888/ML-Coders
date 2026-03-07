import { createServerClient } from "./supabase";

export interface MLMetric {
    id: string;
    model_id: string;
    metric_name: string;
    value: number;
    epoch?: number;
    created_at: string;
}

export async function saveMetric(modelId: string, metricName: string, value: number, epoch?: number) {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("ml_metrics")
        .insert({ model_id: modelId, metric_name: metricName, value, epoch })
        .select()
        .single();

    if (error) return null;
    return data as MLMetric;
}

export async function getMetrics(modelId: string, metricName?: string) {
    const supabase = createServerClient();
    if (!supabase) return [];

    let query = supabase.from("ml_metrics").select("*").eq("model_id", modelId);
    if (metricName) query = query.eq("metric_name", metricName);

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) return [];
    return data as MLMetric[];
}
