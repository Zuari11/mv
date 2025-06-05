'use client'

import { TradingViewChart } from '@/components/charts/TradingViewChart'
import type { Time } from 'lightweight-charts'

// Candlestick chart data for financial visualization
const chartData = [
  { time: '2019-04-11' as Time, open: 75.16, high: 82.84, low: 74.50, close: 80.01 },
  { time: '2019-04-12' as Time, open: 80.01, high: 98.50, low: 79.00, close: 96.63 },
  { time: '2019-04-13' as Time, open: 96.63, high: 97.20, low: 74.20, close: 76.64 },
  { time: '2019-04-14' as Time, open: 76.64, high: 85.50, low: 75.80, close: 81.89 },
  { time: '2019-04-15' as Time, open: 81.89, high: 83.20, low: 72.10, close: 74.43 },
  { time: '2019-04-16' as Time, open: 74.43, high: 82.50, low: 73.90, close: 80.01 },
  { time: '2019-04-17' as Time, open: 80.01, high: 99.00, low: 78.50, close: 96.63 },
  { time: '2019-04-18' as Time, open: 96.63, high: 98.10, low: 75.20, close: 76.64 },
  { time: '2019-04-19' as Time, open: 76.64, high: 86.30, low: 76.00, close: 81.89 },
  { time: '2019-04-20' as Time, open: 81.89, high: 84.50, low: 71.80, close: 74.43 },
]

export default function ChartsPage() {
  return (
    <TradingViewChart
      data={chartData}
      className="h-full w-full"
    />
  )
}
