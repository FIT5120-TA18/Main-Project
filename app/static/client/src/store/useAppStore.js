import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Profile state
  profile: {
    ageBand: '',
    state: '',
    workStatus: '',
    weeklyIncome: '',
    livingArrangement: '',
    studyStatus: '',
  },
  setProfile: (profile) => set({ profile }),

  // Goals state
  selectedGoals: [],
  setSelectedGoals: (goals) => set({ selectedGoals: goals }),

  // Pathways state
  pathways: {
    pathwayA: {
      name: '',
      living: '',
      workHours: '',
      studyLoad: '',
    },
    pathwayB: null,
  },
  setPathwayA: (data) =>
    set((state) => ({
      pathways: {
        ...state.pathways,
        pathwayA: { ...state.pathways.pathwayA, ...data },
      },
    })),
  setPathwayB: (data) =>
    set((state) => ({
      pathways: {
        ...state.pathways,
        pathwayB: data,
      },
    })),
  removePathwayB: () =>
    set((state) => ({
      pathways: {
        ...state.pathways,
        pathwayB: null,
      },
    })),

  // Results state
  results: null,
  setResults: (results) => set({ results }),

  // Reset all state
  reset: () =>
    set({
      profile: {
        ageBand: '',
        state: '',
        workStatus: '',
        weeklyIncome: '',
        livingArrangement: '',
        studyStatus: '',
      },
      selectedGoals: [],
      pathways: {
        pathwayA: {
          name: '',
          living: '',
          workHours: '',
          studyLoad: '',
        },
        pathwayB: null,
      },
      results: null,
    }),
}));
