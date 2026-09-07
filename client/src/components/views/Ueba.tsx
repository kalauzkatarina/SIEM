import { useEffect, useState } from 'react';
import { IUebaAPI } from '../../api/ueba/IUebaAPI';
import { AnomalyResultDTO } from '../../types/ueba/AnomalyResultDTO';
import { MdOutlineAnalytics } from 'react-icons/md';
import AnomaliesTable from '../tables/ueba/AnomaliesTable';
import AnomaliesGraph from '../ueba/AnomaliesGraph';
import AnomaliesFilterSelect from '../ueba/AnomaliesFilterSelect';
import { IoClose } from 'react-icons/io5';

interface UebaProps {
  uebaApi: IUebaAPI;
}

export default function Ueba({ uebaApi }: UebaProps) {
  const [anomalies, setAnomalies] = useState<AnomalyResultDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>("*");
  const [roles, setRoles] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<number[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyResultDTO | null>(null);

  const token = 'token'; // TODO: DELETE AFTER TESTING

  const getFilterOptions = (): { label: string; value: string; type: "role" | "user" }[] => {
    const options: { label: string; value: string; type: "role" | "user" }[] = [];

    // Add all roles first (from API)
    roles.forEach((role) => {
      options.push({
        label: role,
        value: `role:${role}`,
        type: "role",
      });
    });

    // Then add all user IDs (from API)
    const userIds = new Set<number>();
    anomalies.forEach((a) => {
      if (a.userId !== undefined) {
        userIds.add(a.userId);
      }
    });
    // const sorted = Array.from(userIds).sort((a, b) => a - b);
    const sorted = [...userIds].sort((a, b) => a - b);
    sorted.forEach((id) => {
      options.push({
        label: `user ${id}`,
        value: `user:${id}`,
        type: "user",
      });
    });

    return options;
  };

  useEffect(() => {
    handleGetAllAnomalies();
    fetchRolesAndUserIds();
  }, []);

  const fetchRolesAndUserIds = async () => {
    try {
      const [rolesData, userIdsData] = await Promise.all([
        uebaApi.getAllRoles(token),
        uebaApi.getAllUserIds(token)
      ]);

      console.log(token)
      console.log('Roles from API:', rolesData);
      console.log('User IDs from API:', userIdsData);

      // Extract arrays from response objects
      const rolesArray = Array.isArray(rolesData) ? rolesData : (rolesData as any).response || [];
      const userIdsArray = Array.isArray(userIdsData) ? userIdsData : (userIdsData as any).response || [];

      setRoles(rolesArray.filter((role: any) => role !== null && role !== undefined));
      setUserIds(userIdsArray.filter((id: any) => id !== null && id !== undefined));
    } catch (err) {
      console.error('Failed to fetch roles and user IDs:', err);
    }
  };

  const handleGetAllAnomalies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await uebaApi.getAllAnomalies(token);
      setAnomalies(data);
    } catch (err) {
      setError('Failed to fetch anomalies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = async (filterValue: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("FILTER VALUE: " + filterValue);
      if (filterValue.startsWith('role:')) {
        const role = filterValue.split(':')[1];
        const data = await uebaApi.analyzeRoleBehavior(token, role);
        setAnomalies(data);
        setFilterValue("*"); // Reset filter since API already returns filtered data
      } else if (filterValue.startsWith('user:')) {
        const userIdStr = filterValue.split(':')[1];
        const userId = parseInt(userIdStr);
        console.log("USERID: " + userId)
        const data = await uebaApi.analyzeUserBehavior(token, userId);
        setAnomalies(data);
        setFilterValue("*"); // Reset filter since API already returns filtered data
      }
    } catch (err) {
      setError('Failed to fetch anomalies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-gray-300 bg-[#f5f5f5] rounded-[14px] p-4!">
      <div className="flex items-center gap-2! mb-4!">
        <MdOutlineAnalytics size={24} className="text-[#0a84ff]" />
        <h2 className="text-xl font-semibold text-gray-800">User & Entity Behavior Analytics</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4! p-3! bg-red-50 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4! text-[#0a84ff]">
          Loading anomalies...
        </div>
      )}

      {/* Graph and Filter */}
      {!loading && anomalies.length > 0 && (
        <>
          <AnomaliesGraph
            anomalies={anomalies}
            filterValue={filterValue}
          />
          <AnomaliesFilterSelect
            value={filterValue}
            onChange={setFilterValue}
            onSelect={handleFilterSelect}
            options={getFilterOptions()}
          />
        </>
      )}

      {/* Anomalies Table */}
      {!loading && (
        <AnomaliesTable
          anomalies={anomalies}
          onRowClick={(anomaly) => setSelectedAnomaly(anomaly)}
        />
      )}

      {/* Модал за приказ детаља (ако је селектован) */}
      {selectedAnomaly && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center z-[1000]"
          onClick={() => setSelectedAnomaly(null)}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-[700px] max-h-[100vh]! overflow-auto border border-gray-300 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
              <div></div>
              <h2 className="m-0 text-xl text-gray-800 font-semibold">Anomaly Details</h2>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="bg-transparent border-none cursor-pointer text-gray-600 text-2xl p-0 flex items-center hover:text-[#0a84ff] transition-colors"
              >
                <IoClose />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col p-5! gap-4!">
              
              <div>
                <label className="block text-base text-gray-500 mb-1">Title</label>
                <div className="text-[#0a84ff] text-m font-semibold">{selectedAnomaly.title}</div>
              </div>

              <div>
                <label className="block text-base text-gray-500 mb-1">Description</label>
                <div className="text-gray-800 text-m leading-relaxed">{selectedAnomaly.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base text-gray-500 mb-1">User / Role</label>
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-[#0a84ff] bg-[#0a84ff]/10 rounded-md">
                    {selectedAnomaly.userId ? `User ${selectedAnomaly.userId}` : selectedAnomaly.userRole || "N/A"}
                  </span>
                </div>
                <div>
                  <label className="block text-base text-gray-500 mb-1">Detected At</label>
                  <div className="text-gray-800 text-m mt-1">
                    {selectedAnomaly.createdAt ? new Date(selectedAnomaly.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-base text-gray-500 mb-1">
                  Correlated Alerts ({selectedAnomaly.correlatedAlerts?.length || 0})
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAnomaly.correlatedAlerts?.map((alertId) => (
                    <span
                      key={alertId}
                      className="px-2 py-1 bg-gray-100 border border-gray-300/10 rounded-md text-m font-mono text-gray-800"
                    >
                      #{alertId}
                    </span>
                  ))}
                </div>
              </div>

              {/* Дугме за затварање на дну */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedAnomaly(null)}
                  className="w-full py-3 rounded-lg bg-[#007a55] hover:bg-[#005c40] text-white font-semibold text-base transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
