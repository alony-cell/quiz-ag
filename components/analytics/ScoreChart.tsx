'use client';

interface ScoreChartProps {
    data: { range: string; count: number }[];
}

export default function ScoreChart({ data }: ScoreChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                No score data available yet.
            </div>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="h-64 flex items-end justify-between space-x-2 pt-6">
            {data.map((item) => {
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                    <div key={item.range} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full flex items-end justify-center h-full">
                            <div
                                className="w-full bg-blue-100 rounded-t-md group-hover:bg-blue-200 transition-all duration-300 relative"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.count}
                                </div>
                                <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md opacity-80" style={{ height: '100%' }}></div>
                            </div>
                        </div>
                        <span className="text-xs text-slate-500 mt-2 font-medium">{item.range}</span>
                    </div>
                );
            })}
        </div>
    );
}
