import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: { ageBand: null, state: null, workStatus: null, weeklyIncome: null, livingArrangement: null, studyStatus: null, goal: null, },
  pathways: [],
  results: null,
  errors: {},

  setProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data }, })),
  setPathways: (pathways) => set({ pathways }),
  setResults: (results) => set({ results }),
  setErrors: (errors) => set({ errors }),
  resetSession: () => set({ profile: { ageBand: null, state: null, workStatus: null, weeklyIncome: null, livingArrangement: null, studyStatus: null, goal: null, }, pathways: [], results: null, errors: {}, }),
  addPathway: (pathway) => set((state) => ({ pathways: [...state.pathways, pathway], })),
  updatePathway: (id, data) => set((state) => ({ pathways: state.pathways.map((p) => p.id === id ? { ...p, ...data } : p), })),
  removePathway: (id) => set((state) => ({ pathways: state.pathways.filter((p) => p.id !== id), })),
}));
