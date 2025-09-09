"use client";
import * as React from 'react';
import { Navbar } from '@/components/common/navbar';
import { Sidebar } from '@/components/common/sidebar';
import { AnimatedMetrics } from '@/components/dashboard/animated-metrics';
import { Metric } from '@/types';

export default function OwnerDashboard() {
  const metrics: Metric[] = [
    { label: 'Total Volume', value: 124500000, delta: 12, color: 'blue' }, // ₹ in paise
    { label: 'Fees Collected', value: 456700, delta: 4, color: 'green' },
    { label: 'Active Retailers', value: 32, delta: 2, color: 'orange' },
    { label: 'Chargebacks', value: 3, delta: -1, color: 'red' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-responsive pt-6 grid grid-cols-1 md:grid-cols-[16rem,1fr] gap-6">
        <Sidebar />
        <main className="pb-12">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <AnimatedMetrics items={metrics} />
        </main>
      </div>
    </div>
  );
}

