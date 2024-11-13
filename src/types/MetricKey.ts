import { TokenDetails } from "@/types/TokenDetails";
import { metrics } from "@/lib/metrics/metrics";

export type MetricKey = keyof TokenDetails & (typeof metrics)[number]["key"];
