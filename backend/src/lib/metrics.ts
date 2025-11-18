/**
 * Simple metrics abstraction for tracking application performance
 * In production, this would integrate with Prometheus, DataDog, etc.
 */

export interface MetricLabels {
  [key: string]: string | number;
}

class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, labels?: MetricLabels, value: number = 1): void {
    const key = this.buildKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[METRIC] Counter: ${key} = ${current + value}`);
    }
  }

  /**
   * Set a gauge metric (current value)
   */
  setGauge(name: string, value: number, labels?: MetricLabels): void {
    const key = this.buildKey(name, labels);
    this.gauges.set(key, value);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[METRIC] Gauge: ${key} = ${value}`);
    }
  }

  /**
   * Record a histogram value (for latencies, sizes, etc.)
   */
  recordHistogram(name: string, value: number, labels?: MetricLabels): void {
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[METRIC] Histogram: ${key} recorded value ${value}`);
    }
  }

  /**
   * Time a function execution
   */
  async time<T>(name: string, fn: () => Promise<T>, labels?: MetricLabels): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.recordHistogram(`${name}_duration_ms`, duration, labels);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordHistogram(`${name}_duration_ms`, duration, { ...labels, error: 'true' });
      throw error;
    }
  }

  /**
   * Get current metrics snapshot
   */
  getSnapshot(): {
    counters: Record<string, number>;
    gauges: Record<string, number>;
    histograms: Record<string, { count: number; avg: number; min: number; max: number }>;
  } {
    const histogramStats: Record<string, any> = {};

    this.histograms.forEach((values, key) => {
      const count = values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / count;
      const min = Math.min(...values);
      const max = Math.max(...values);
      histogramStats[key] = { count, avg, min, max };
    });

    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: histogramStats,
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }

  private buildKey(name: string, labels?: MetricLabels): string {
    if (!labels) return name;

    const labelPairs = Object.entries(labels)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    return `${name}{${labelPairs}}`;
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

// Convenience functions
export const incrementCounter = (name: string, labels?: MetricLabels, value?: number) =>
  metrics.incrementCounter(name, labels, value);

export const setGauge = (name: string, value: number, labels?: MetricLabels) =>
  metrics.setGauge(name, value, labels);

export const recordHistogram = (name: string, value: number, labels?: MetricLabels) =>
  metrics.recordHistogram(name, value, labels);

export const timeAsync = <T>(name: string, fn: () => Promise<T>, labels?: MetricLabels) =>
  metrics.time(name, fn, labels);

export const getMetricsSnapshot = () => metrics.getSnapshot();
export const resetMetrics = () => metrics.reset();
