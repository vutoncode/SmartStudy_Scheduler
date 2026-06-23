import { useScheduleStore } from '../store/scheduleStore';

export const useSchedule = () => {
  const {
    sessions,
    goals,
    subjects,
    loading,
    error,
    stats,
    fetchInitialData,
    addSession,
    updateSession,
    deleteSession,
    checkInSession
  } = useScheduleStore();

  return {
    sessions,
    goals,
    subjects,
    loading,
    error,
    stats,
    fetchInitialData,
    addSession,
    updateSession,
    deleteSession,
    checkInSession
  };
};

export default useSchedule;
