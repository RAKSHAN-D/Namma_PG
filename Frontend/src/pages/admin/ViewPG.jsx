import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminService from "../../services/admin.service";
import { ArrowLeft, CheckCircle, XCircle, MapPin, Building, User, Info, Utensils, Wifi, ShieldBan, ShieldCheck } from "lucide-react";

const ViewPG = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPgDetails();
    }, [id]);

    const fetchPgDetails = async () => {
        try {
            const data = await AdminService.getPgDetails(id);
            setPg(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching PG details:", err);
            if (err.response && err.response.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else if (err.response && err.response.status === 404) {
                setError("PG Not Found.");
            } else {
                setError("Failed to load PG details. " + (err.message || "Server Error"));
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading PG Details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center flex-col gap-4">
                <div className="text-xl text-red-500 font-bold">{error}</div>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Go Back</button>
            </div>
        );
    }

    if (!pg) return null;

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen font-sans text-gray-800">

            <div className="flex-1 p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                {pg.name}
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${pg.active ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                                    {pg.active ? "Active" : "Inactive"}
                                </span>
                            </h1>
                            <div className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                <MapPin size={14} /> {pg.area}, {pg.city}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newStatus = !pg.active;
                            AdminService.updatePgStatus(pg.id, newStatus).then(() => {
                                setPg({ ...pg, active: newStatus });
                            });
                        }}
                        className={`px-4 py-2 ${pg.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg shadow transition flex items-center gap-2`}
                    >
                        {pg.active ? <><ShieldBan size={16} /> Block PG</> : <><ShieldCheck size={16} /> Unblock PG</>}
                    </button>
                </div>

                {/* Grid Layout - 2x2 Symmetric Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">

                    {/* 1. Basic Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[16rem]">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                            <Info size={18} /> Basic Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">PG Name</span>
                                <span className="font-medium text-gray-800 text-right">{pg.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Gender</span>
                                <span className="font-medium text-gray-800">{pg.gender}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Total Rooms</span>
                                <span className="font-medium text-gray-800">{pg.totalRooms}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Total Floors</span>
                                <span className="font-medium text-gray-800">{pg.totalFloors}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Rating</span>
                                <span className="font-medium text-yellow-600">★ {pg.rating ? pg.rating.toFixed(1) : "N/A"}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-gray-500 block mb-1">Description</span>
                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {pg.description || "No description available."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Owner Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[16rem]">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                            <User size={18} /> Owner Details
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500">Name</span>
                                <span className="font-medium text-gray-800">{pg.ownerName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-blue-600">{pg.ownerEmail}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500">Username</span>
                                <span className="font-medium text-gray-800">{pg.ownerUsername || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium text-gray-800">
                                    {pg.ownerJoinedAt ? new Date(pg.ownerJoinedAt).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Facilities */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[20rem]">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                            <Wifi size={18} /> Facilities ({pg.facilities ? pg.facilities.length : 0})
                        </h2>
                        {pg.facilities && pg.facilities.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {pg.facilities.map((fac, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        {fac.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No facilities listed.</p>
                        )}
                    </div>

                    {/* 4. Food Details */}
                    {pg.food ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[20rem]">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
                                <Utensils size={18} /> Food Services
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Availability</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Food Type</span> <span className="font-medium">{pg.food.foodType}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Breakfast</span> <span className="font-medium">{pg.food.breakfast ? "✅ Yes" : "❌ No"}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Lunch</span> <span className="font-medium">{pg.food.lunch ? "✅ Yes" : "❌ No"}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Dinner</span> <span className="font-medium">{pg.food.dinner ? "✅ Yes" : "❌ No"}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Eggs Provided</span> <span className="font-medium">{pg.food.eggsProvided ? "✅ Yes" : "❌ No"}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Timings</h3>
                                    <div className="space-y-2 text-sm">
                                        {pg.food.breakfast && <div className="flex justify-between"><span className="text-gray-500">Breakfast</span> <span className="font-medium font-mono text-xs bg-gray-100 px-2 py-1 rounded">{pg.food.breakfastStartTime} - {pg.food.breakfastEndTime}</span></div>}
                                        {pg.food.lunch && <div className="flex justify-between"><span className="text-gray-500">Lunch</span> <span className="font-medium font-mono text-xs bg-gray-100 px-2 py-1 rounded">{pg.food.lunchStartTime} - {pg.food.lunchEndTime}</span></div>}
                                        {pg.food.dinner && <div className="flex justify-between"><span className="text-gray-500">Dinner</span> <span className="font-medium font-mono text-xs bg-gray-100 px-2 py-1 rounded">{pg.food.dinnerStartTime} - {pg.food.dinnerEndTime}</span></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specials & Info</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                        <span className="block text-yellow-600 text-xs font-bold mb-1">Sunday Special</span>
                                        {pg.food.sundaySpecial ? pg.food.sundaySpecialItem : "None"}
                                    </div>
                                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                                        <span className="block text-pink-600 text-xs font-bold mb-1">Weekly Sweet</span>
                                        {pg.food.weeklySweetProvided ? `${pg.food.weeklySweetItem} (${pg.food.weeklySweetDay})` : "None"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-center text-gray-400 italic">
                            Food details not available
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ViewPG;
