"use client";
import * as React from 'react';
import { Navbar } from '@/components/common/navbar';
import { AnimatedMetrics } from '@/components/dashboard/animated-metrics';
import { Metric } from '@/types';

export default function RetailerDashboard() {
  const metrics: Metric[] = [
    { label: 'Today Volume', value: 2450000, delta: 6, color: 'blue' },
    { label: 'Fees Paid', value: 32000, delta: -2, color: 'green' },
    { label: 'Transactions', value: 18, delta: 3, color: 'orange' },
    { label: 'Declines', value: 1, delta: 0, color: 'red' }
  ];
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-responsive pt-6 pb-12">
        <h2 className="text-xl font-semibold mb-4">Your Store</h2>
        <AnimatedMetrics items={metrics} />
      </div>
    </div>
  );
}

