import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function EmissionChart({ data }: { data: any[] }) {
    return (
        <section className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold mb-8 text-zinc-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-lime-500 rounded-full"></span>
                카테고리별 배출 비중 (kg)
            </h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={13} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                        <YAxis stroke="#a1a1aa" fontSize={13} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: '#f7fee7' }}
                            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #ecfccb", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                            itemStyle={{ color: "#65a30d", fontWeight: "bold" }}
                        />
                        <Bar dataKey="value" fill="#84cc16" radius={[10, 10, 0, 0]} barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}