import { create } from 'zustand';

const useRendererStore = create((set) => ({
  renderers: [],
  addRenderer: (renderer) =>
    set((state) => ({
      renderers: [...state.renderers, renderer]
    })),
  removeRenderer: (renderer) =>
    set((state) => ({
      renderers: state.renderers.filter((r) => r !== renderer)
    })),
  clearRenderers: () =>
    set(() => ({
      renderers: []
    }))
}));

export default useRendererStore;
