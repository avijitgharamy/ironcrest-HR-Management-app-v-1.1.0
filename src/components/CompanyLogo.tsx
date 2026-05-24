/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CompanyLogoProps {
  className?: string;
  hideText?: boolean;
}

export default function CompanyLogo({ className = "w-10 h-10", hideText = false }: CompanyLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 shrink-0 select-none`}>
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuALpcssZ45H9ga34vaj8syW-iLi6jmu4a8wflWlz-qRBnCp0uxwbWL1tKo-645yDEk0Yrg1jIt7knW9xPoIiZuz4lsITQVDQe1Ei_p0m0cbMXOvINnDxiVVP1Zxk0u-gzEXCZVRqiCaWm9mCeSLI0jJ2bReEcB0l56kQJVI3hpnzdt0Pv9kcWndHRrXtZ5uouy5JOEnONXAexPYSIioYgdNaU_6TqrY9SF1mYqaTY_7MshDHLjtvDbGII9gCX-ClzxkujTZcopV2A"
        alt="I & C Ironcrest Global Logo"
        className={`${className} object-contain shrink-0`}
        referrerPolicy="no-referrer"
      />
      {!hideText && (
        <span className="sr-only">{"I & C Ironcrest Global"}</span>
      )}
    </div>
  );
}
