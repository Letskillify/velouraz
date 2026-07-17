import React, { useMemo } from "react";
import { ArrowRight, ArrowUpRight, Box, Clock3, Gem, PackageCheck, ShoppingBag, UsersRound } from "lucide-react";
import { Chart as ChartJS, ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const timestampDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const orderAmount = (order) => Number(order.total ?? order.totalAmount ?? order.grandTotal ?? order.amount ?? 0);
const change = (current, previous) => previous ? `${(((current - previous) / previous) * 100).toFixed(1)}%` : current ? "100%" : "0.0%";

const Stat = ({ label, value, note, icon: Icon, tint, positive = true }) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(37,17,24,.035)]">
    <div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold text-slate-500">{label}</p><p className="mt-2 text-[25px] font-bold tracking-tight text-slate-900">{value}</p></div><span className={`grid h-11 w-11 place-items-center rounded-full ${tint}`}><Icon size={20} strokeWidth={1.8} /></span></div>
    <p className="mt-3 flex items-center gap-1 text-[10px] text-slate-500"><ArrowUpRight size={12} className={positive ? "text-emerald-500" : "rotate-90 text-rose-500"} /><strong className={positive ? "text-emerald-600" : "text-rose-600"}>{note}</strong> vs previous period</p>
  </article>
);

const DashboardOverview = ({ products, users, orders, onViewProducts }) => {
  const data = useMemo(() => {
    const now = new Date(); now.setHours(23, 59, 59, 999);
    const start = new Date(now); start.setDate(now.getDate() - 13); start.setHours(0, 0, 0, 0);
    const previousStart = new Date(start); previousStart.setDate(start.getDate() - 14);
    const labels = Array.from({ length: 14 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });
    const current = Array(14).fill(0); const previous = Array(14).fill(0);
    let revenue = 0; let priorRevenue = 0; let currentOrders = 0; let priorOrders = 0;
    orders.forEach((order) => {
      const date = timestampDate(order.createdAt || order.orderDate || order.date); const amount = orderAmount(order);
      if (!date) return;
      if (date >= start && date <= now) { const index = Math.floor((date - start) / 86400000); if (index >= 0 && index < 14) current[index] += amount; revenue += amount; currentOrders += 1; }
      if (date >= previousStart && date < start) { const index = Math.floor((date - previousStart) / 86400000); if (index >= 0 && index < 14) previous[index] += amount; priorRevenue += amount; priorOrders += 1; }
    });
    const categoryTotals = products.reduce((acc, product) => { const name = product.category || "Uncategorized"; acc[name] = (acc[name] || 0) + 1; return acc; }, {});
    return { labels: labels.map((date) => date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })), current, previous, revenue, priorRevenue, currentOrders, priorOrders, categoryTotals };
  }, [orders, products]);

  const inStock = products.filter((p) => Number(p.stock || 0) > 0).length;
  const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 10).length;
  const categoryNames = Object.keys(data.categoryTotals);
  const chartData = { labels: data.labels, datasets: [{ label: "This period", data: data.current, borderColor: "#9c1237", backgroundColor: "rgba(156,18,55,.10)", fill: true, tension: .42, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2.5 }, { label: "Previous period", data: data.previous, borderColor: "#a6b0bd", borderDash: [4, 4], tension: .42, pointRadius: 0, borderWidth: 1.5 }] };
  const doughnutData = { labels: categoryNames.length ? categoryNames : ["No categories"], datasets: [{ data: categoryNames.length ? Object.values(data.categoryTotals) : [1], backgroundColor: categoryNames.length ? ["#9c1237", "#f5bf62", "#67b999", "#9588e5", "#ef8ba4", "#7b91c8"] : ["#e9edf2"], borderWidth: 0, hoverOffset: 3 }] };
  const activities = [
    { icon: ShoppingBag, text: `${orders.length} order${orders.length === 1 ? "" : "s"} in the database`, time: "Live", tone: "bg-amber-50 text-amber-600" },
    { icon: PackageCheck, text: `${products.length} products in catalogue`, time: "Live", tone: "bg-rose-50 text-[#9c1237]" },
    { icon: UsersRound, text: `${users.length} registered customers`, time: "Live", tone: "bg-emerald-50 text-emerald-600" },
  ];
  return <div className="space-y-5">
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Total Revenue" value={money(data.revenue)} note={change(data.revenue, data.priorRevenue)} icon={Gem} tint="bg-emerald-50 text-emerald-600" positive={data.revenue >= data.priorRevenue} />
      <Stat label="Total Orders" value={data.currentOrders.toLocaleString("en-IN")} note={change(data.currentOrders, data.priorOrders)} icon={ShoppingBag} tint="bg-rose-50 text-[#a6173c]" positive={data.currentOrders >= data.priorOrders} />
      <Stat label="Total Products" value={products.length.toLocaleString("en-IN")} note={`${inStock} in stock`} icon={Box} tint="bg-amber-50 text-amber-600" />
      <Stat label="Total Customers" value={users.length.toLocaleString("en-IN")} note="Live database count" icon={UsersRound} tint="bg-violet-50 text-violet-600" />
    </section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_286px]">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(37,17,24,.035)] sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-[15px] font-bold text-slate-900">Sales Overview</h2><p className="mt-1 text-[11px] text-slate-400">Live revenue from orders over the last 14 days</p></div></div><div className="mt-5 h-56"><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, plugins: { legend: { position: "top", align: "end", labels: { usePointStyle: true, boxWidth: 7, font: { size: 10 } } }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${money(context.raw)}` } } }, scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 7, font: { size: 10 }, color: "#8a94a3" } }, y: { beginAtZero: true, border: { display: false }, grid: { color: "#eef1f4" }, ticks: { font: { size: 10 }, color: "#8a94a3", callback: (value) => money(value) } } } }} /></div></article>
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(37,17,24,.035)] sm:p-6"><h2 className="text-[15px] font-bold text-slate-900">Top Categories</h2><div className="mt-4 h-32"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} products` } } } }} /></div><div className="mt-5 space-y-2.5 text-[11px]">{categoryNames.length ? categoryNames.slice(0, 5).map((name, index) => <div className="flex justify-between" key={name}><span className="flex items-center gap-2 text-slate-600"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }} />{name}</span><b className="text-slate-700">{data.categoryTotals[name]}</b></div>) : <p className="text-center text-slate-400">Categories will appear here.</p>}</div><button onClick={onViewProducts} className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold">View all products <ArrowRight size={14}/></button></article>
    </section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_286px]"><article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(37,17,24,.035)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="text-[15px] font-bold text-slate-900">Recent Products</h2><p className="mt-1 text-[11px] text-slate-400">Latest live additions to your catalogue</p></div><button onClick={onViewProducts} className="text-[11px] font-semibold text-[#9c1237]">View all</button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead className="bg-slate-50 text-[10px] uppercase tracking-[.12em] text-slate-400"><tr><th className="px-6 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th></tr></thead><tbody className="divide-y divide-slate-50">{products.slice(0,5).map((p) => <tr key={p.id} className="text-[12px]"><td className="px-6 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-rose-50 text-[#9c1237]">{p.images?.[0]?<img src={p.images[0]} alt="" className="h-full w-full object-cover"/>:<Gem size={15}/>}</span><span className="max-w-[160px] truncate font-semibold text-slate-800">{p.name}</span></div></td><td className="px-4 py-3 text-slate-500">{p.category||"Uncategorized"}</td><td className="px-4 py-3 font-semibold">{money(p.price)}</td><td className={`px-4 py-3 ${Number(p.stock||0)?"text-emerald-600":"text-rose-600"}`}>{p.stock||0}</td></tr>)}{products.length===0&&<tr><td colSpan="4" className="px-6 py-11 text-center text-[12px] text-slate-400">Your newest catalogue additions will appear here.</td></tr>}</tbody></table></div></article><article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(37,17,24,.035)] sm:p-6"><h2 className="text-[15px] font-bold text-slate-900">Recent Activity</h2><div className="mt-4 space-y-4">{activities.map(({icon:Icon,text,time,tone})=><div className="flex gap-3" key={text}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}><Icon size={14}/></span><div><p className="text-[11px] leading-5 text-slate-700">{text}</p><p className="text-[10px] text-slate-400">{time}</p></div></div>)}</div><button className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold">Live updates enabled <Clock3 size={14}/></button></article></section>
  </div>;
};
export default DashboardOverview;
