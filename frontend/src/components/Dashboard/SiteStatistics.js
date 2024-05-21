import React from "react";

function SiteStatistics({ data }) {
    console.log(data)
    return (
        <div className="stats stats-vertical shadow-lg border p-0 h-full w-full">
            <div className="stat">
                <div className="stat-title font-bold text-xl">Sales </div>
                <div className="stat-value text-mainOrange overflow-auto">{data.sales}</div>
                <div className="stat-desc">Lifetime (S$)</div>
            </div>

            <div className="stat">
                <div className="stat-title font-bold text-xl">Orders</div>
                <div className="stat-value text-mainOrange">{data.orders}</div>
                <div className="stat-desc">Lifetime</div>
            </div>

            <div className="stat">
                <div className="stat-title font-bold text-xl">Customers</div>
                <div className="stat-value text-mainOrange">{data.users}</div>
                <div className="stat-desc">Lifetime</div>
            </div>
        </div>
    );
}

export default SiteStatistics;
