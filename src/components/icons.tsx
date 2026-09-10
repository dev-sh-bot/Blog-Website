import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowIcon(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}

export function SparkIcon(props: IconProps) {
  return <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true" {...props}><path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M7.3 32.7 32.7 7.3" /></svg>;
}
