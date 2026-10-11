"use client";

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

const createIcon = (paths: string[], viewBox = "0 0 24 24") => {
  return function Icon({ size = 24, strokeWidth = 2, className, style, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        {...props}
        aria-hidden="true"
      >
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    );
  };
};

// Most used icons (inline SVGs from lucide-react)
export const Trash2 = createIcon(["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"]);
export const Package = createIcon(["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.3 7 12 12l8.7-5", "M12 22V12"]);
export const Eye = createIcon(["M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0", "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]);
export const EyeOff = createIcon(["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24", "M2 2l20 20"]);
export const Search = createIcon(["M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"]);
export const Pencil = createIcon(["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", "m15 5 4 4"]);
export const Wrench = createIcon(["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"]);
export const Users = createIcon(["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M16 3.128a4 4 0 0 1 0 7.744", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.128a4 4 0 0 1 0 7.744"]);
export const Repeat = createIcon(["M4 9v-2a2 2 0 0 1 2-2h10", "m3 9 3-3 3 3", "M20 15v2a2 2 0 0 1-2 2H6", "m18 15-3 3-3-3"]);
export const ArrowRightLeft = createIcon(["M7 7h10v10", "M17 7 7 17", "M7 17h10v-10"]);
export const Shield = createIcon(["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]);
export const RotateCcw = createIcon(["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"]);
export const Calculator = createIcon(["M18 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2", "M16 6h-2v4h2v-4", "M12 6h-2v4h2v-4", "M8 6H6v4h2V6", "M8 14H6v4h2v-4", "M12 14h-2v4h2v-4", "M16 14h-2v4h2v-4"]);
export const ArrowRight = createIcon(["M5 12h14", "m12 5-7-7 7-7"]);
export const User = createIcon(["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M12 11a4 4 0 0 1 8 0v2a8 8 0 0 1-16 0v-2a4 4 0 0 1 8 0z"]);
export const MapPin = createIcon(["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 10a3 3 0 0 1 0-6 3 3 0 0 1 0 6z"]);
export const Lock = createIcon(["M18 8h-1a2 2 0 0 0-2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a2 2 0 0 0-2-2H6", "M10 8v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]);
export const Landmark = createIcon(["M22 17v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2", "M22 7l-5 5", "M2 12h20"]);
export const History = createIcon(["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5", "M12 7v5l4 2"]);
export const FileDown = createIcon(["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20", "M12 15v6", "m9 18 3 3-3 3"]);

export const Boxes = createIcon(["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.3 7 12 12l8.7-5", "M12 22V12"]);
export const BookOpen = createIcon(["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]);
export const ChevronLeft = createIcon(["m15 18-6-6 6-6"]);
export const ChevronRight = createIcon(["m9 18 6-6-6-6"]);
export const ChevronsLeft = createIcon(["m11 17-5-5 5-5", "m18 17-5-5 5-5"]);
export const ChevronsRight = createIcon(["m6 17 5-5-5-5", "m13 17 5-5-5-5"]);
export const Plus = createIcon(["M5 12h14", "M12 5v14"]);
export const X = createIcon(["M18 6 6 18", "M6 6l12 12"]);
export const ArrowLeft = createIcon(["M18 15 12 9l-6 6"]);
export const Inbox = createIcon(["M22 12h-4l-3-10-9 4 9 4-3 10h4v-8z", "M2 12h12.06a2 2 0 0 1 1.94 1.5L22 20.5"]);
export const Trash = createIcon(["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"]);

// Additional icons
export const BarChart3 = createIcon(["M3 3v18h18", "m9 17 4-4 4 4 8-8"]);

export const FileText = createIcon(["M14 2v4a2 2 0 0 0 2 2h4", "M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z", "M16 13a2 2 0 0 0 0-4h-2a2 2 0 0 0 0 4h2z", "M8 13a2 2 0 0 0 0-4H6a2 2 0 0 0 0 4h2z", "M8 17a2 2 0 0 0 0-4H6a2 2 0 0 0 0 4h2z"]);
export const ClipboardList = createIcon(["M9 4h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M9 14h10", "M9 18h7", "M9 10h10", "M5 4h4v16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"]);
export const PiggyBank = createIcon(["M19 5c-1.5 0-2.8 1.4-3 3-.35 2.5-2 4.5-3 5.5-.17.18-.38.2-.55.2H9a6 6 0 0 1-6-6V5a3 3 0 0 1 3-3h10z", "M2 9v1c0 2.5 2 5 5 5h10c2.5 0 5-2.5 5-5V9", "M9 5v2"]);
export const Download = createIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]);
export const Upload = createIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 19V9"]);



// Missing icons
export const AlertTriangle = createIcon(["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"]);
export const TrendingUp = createIcon(["M4 17l5-5 5 5", "M20 12v5H15"]);
export const Clock = createIcon(["M12 6v6l4 2", "M12 12a10 10 0 1 1-10-10 10 10 0 0 1 10 10z"]);
export const CheckCircle = createIcon(["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M9 11l3 3L22 4"]);
export const XCircle = createIcon(["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", "M15 9 9 15", "M9 9l6 6"]);
export const Activity = createIcon(["M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"]);
export const Wallet = createIcon(["M21 12V7H5a2 2 0 0 1 0-4h14v4", "M3 5v14a2 2 0 0 0 2 2h14"]);



// Missing icons
export const Filter = createIcon(["M3 3h18v18H3z", "M7 7h10", "M7 11h7", "M7 15h4"]);
export const Printer = createIcon(["M6 9V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7", "M6 18H4a2 2 0 0 1-2-2v-5", "M6 14h12v4H6z", "M9 18v-3h6v3"]);

// Re-added icons that were accidentally removed
export const Calendar = createIcon(["M8 2v4", "M16 2v4", "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M3 10h18"]);
export const Coins = createIcon(["M12 8a5 5 0 0 1 5 5", "M12 16a7 7 0 0 1-7-7", "M22 12a10 10 0 0 0-20 0", "M12 16a7 7 0 0 0 7-7"]);
export const TrendingDown = createIcon(["M13 17 8 12l5-5", "M17 17V5", "M7 17 3 13l5-5"]);
