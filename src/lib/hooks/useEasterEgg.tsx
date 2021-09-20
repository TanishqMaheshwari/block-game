import { useState, useEffect } from 'react';

/**
 * Injects the block game easter egg trigger into the global space.
 * Returns a boolean indicating whether the block game easter egg has been triggered.
 * The actual name of the trigger function may be specified in the `triggerName` parameter.
 * If no trigger name is specified, it will default to `easteregg`.
 */
const useEasterEgg = (triggerName = 'easteregg'): boolean => {
  const [isTriggered, setTriggered] = useState(false);

  useEffect(() => {
    (globalThis as any)[triggerName] = () => {
      setTriggered(!isTriggered);
    };

    return () => {
      delete (globalThis as any)[triggerName];
    };
  }, [isTriggered, setTriggered, triggerName]);

  return isTriggered;
};

export default useEasterEgg;
