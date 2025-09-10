"use client";
import * as React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const data = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  volume: 500 + Math.round(200 * Math.sin(i / 2) + 150 * Math.random())
}));

export function AnalyticsCard() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="font-semibold">Volume (Last 14 days)</h3>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip cursor={false} />
              <Area type="monotone" dataKey="volume" stroke="#0A84FF" fillOpacity={1} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

