import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], scrollContainerId: string): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const root = document.getElementById(scrollContainerId);
    if (!root) return;

    const handleScroll = () => {
      const containerTop = root.getBoundingClientRect().top;
      const threshold = containerTop + root.clientHeight * 0.35;

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveId(current);
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => root.removeEventListener('scroll', handleScroll);
  }, [sectionIds, scrollContainerId]);

  return activeId;
}
