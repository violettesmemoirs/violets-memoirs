import FlowerField from './FlowerField';

/**
 * Wraps a page's content with the top violet garland and a slow background
 * fade from cream at the top down to dusk at the bottom, so it lands right
 * where that page's own closing FlowerField (violets + ground) sits --
 * however tall the page's content actually is.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-fade">
      <FlowerField variant="garland" />
      {children}
    </div>
  );
}
