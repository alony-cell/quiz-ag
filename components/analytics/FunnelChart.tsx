'use client';

interface FunnelChartProps {
    data: { step: string; count: number }[];
}

export default function FunnelChart({ data }: FunnelChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                No funnel data available yet.
            </div>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const prevCount = index > 0 ? data[index - 1].count : item.count;
                const dropOff = index > 0 ? Math.round(((prevCount - item.count) / prevCount) * 100) : 0;

                return (
                    <div key={item.step} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700">{item.step}</span>
                            <div className="text-right">
                                <span className="font-bold text-slate-900">{item.count}</span>
                                {index > 0 && (
                                    <span className="text-xs text-red-500 ml-2">
                                        (-{dropOff}%)
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="h-8 bg-slate-100 rounded-r-lg overflow-hidden relative">
                            <div
                                className="h-full bg-blue-500 rounded-r-lg transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
