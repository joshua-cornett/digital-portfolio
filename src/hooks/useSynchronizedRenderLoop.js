import { useEffect } from 'react';
import { useRendererStore } from '@stores';

/**
 * A hook to synchronize the render loop across components, automatically registering and unregistering renderers.
 *
 * @param {function} renderFunction The render function for the component.
 */
const useSynchronizedRenderLoop = (renderFunction) => {
  const addRenderer = useRendererStore((state) => state.addRenderer);
  const removeRenderer = useRendererStore((state) => state.removeRenderer);

  useEffect(() => {
    const renderer = { render: renderFunction };

    // Register the renderer
    addRenderer(renderer);

    // Cleanup on unmount
    return () => {
      removeRenderer(renderer);
    };
  }, [renderFunction, addRenderer, removeRenderer]);

  // Handle the main animation loop
  useEffect(() => {
    const animate = () => {
      const renderers = useRendererStore.getState().renderers;
      renderers.forEach((renderer) => {
        if (renderer && typeof renderer.render === 'function') {
          renderer.render();
        }
      });

      requestAnimationFrame(animate);
    };

    animate(); // Start the animation loop
  }, []);
};

export default useSynchronizedRenderLoop;
