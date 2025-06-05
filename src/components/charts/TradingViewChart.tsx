'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib'

// Import types from lightweight-charts
import type {
  IChartApi,
  ISeriesApi,
  CandlestickData,
  DeepPartial,
  ChartOptions,
  CandlestickSeriesOptions,
  Time
} from 'lightweight-charts'

// Types for TradingView Lightweight Charts
interface CandlestickChartData {
  time: Time
  open: number
  high: number
  low: number
  close: number
}

interface TradingViewChartProps {
  data?: CandlestickChartData[]
  className?: string
}

// Default sample candlestick data
const defaultData: CandlestickChartData[] = [
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
  { time: '2019-04-21' as Time, open: 74.43, high: 83.20, low: 74.00, close: 80.01 },
  { time: '2019-04-22' as Time, open: 80.01, high: 99.50, low: 79.20, close: 96.63 },
  { time: '2019-04-23' as Time, open: 96.63, high: 97.80, low: 74.80, close: 76.64 },
  { time: '2019-04-24' as Time, open: 76.64, high: 87.10, low: 75.50, close: 81.89 },
  { time: '2019-04-25' as Time, open: 81.89, high: 83.80, low: 72.50, close: 74.43 },
  { time: '2019-04-26' as Time, open: 74.43, high: 82.90, low: 73.60, close: 80.01 },
  { time: '2019-04-27' as Time, open: 80.01, high: 98.80, low: 78.90, close: 96.63 },
  { time: '2019-04-28' as Time, open: 96.63, high: 97.50, low: 75.60, close: 76.64 },
  { time: '2019-04-29' as Time, open: 76.64, high: 86.80, low: 76.20, close: 81.89 },
  { time: '2019-04-30' as Time, open: 81.89, high: 84.20, low: 72.20, close: 74.43 },
]

export function TradingViewChart({
  data = defaultData,
  className
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let cleanup: (() => void) | undefined
    let retryTimeout: NodeJS.Timeout | undefined
    let retryCount = 0
    const maxRetries = 10

    const initChart = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamic import to avoid SSR issues
        const { createChart, CrosshairMode, CandlestickSeries } = await import('lightweight-charts')

        if (!isMounted || !chartContainerRef.current) return

        // Check if container has valid dimensions
        const containerWidth = chartContainerRef.current.clientWidth
        const containerHeight = chartContainerRef.current.clientHeight

        console.log('Container dimensions:', { containerWidth, containerHeight })

        // If container doesn't have dimensions yet, retry after a short delay
        if (containerWidth === 0 || containerHeight === 0) {
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`Container dimensions not ready, retrying in 100ms... (attempt ${retryCount}/${maxRetries})`)
            retryTimeout = setTimeout(() => {
              if (isMounted) {
                initChart()
              }
            }, 100)
            return
          } else {
            console.error('Max retries reached, using fallback dimensions')
            // Continue with fallback dimensions instead of failing
          }
        }

        // Use fallback dimensions if still too small or if we reached max retries
        const width = Math.max(containerWidth || 400, 400)
        const height = Math.max(containerHeight || 300, 300)

        console.log('Using chart dimensions:', { width, height })

        // Chart colors optimized for dark themes
        const chartColors = {
          background: 'transparent',
          textColor: '#ffffff',
          borderColor: '#374151',
          upColor: '#10b981',
          downColor: '#ef4444',
          gridColor: '#374151'
        }

        // Create chart with responsive configuration
        const chartOptions: DeepPartial<ChartOptions> = {
          width,
          height,
          layout: {
            background: { color: chartColors.background },
            textColor: chartColors.textColor,
          },
          grid: {
            vertLines: {
              color: chartColors.gridColor,
            },
            horzLines: {
              color: chartColors.gridColor,
            },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
          },
          rightPriceScale: {
            borderColor: chartColors.borderColor,
          },
          timeScale: {
            borderColor: chartColors.borderColor,
            timeVisible: true,
            secondsVisible: false,
          },
        }

        const chart = createChart(chartContainerRef.current, chartOptions)

        // Add candlestick series with styling
        const candlestickSeriesOptions: DeepPartial<CandlestickSeriesOptions> = {
          upColor: chartColors.upColor,
          downColor: chartColors.downColor,
          borderVisible: false,
          wickUpColor: chartColors.upColor,
          wickDownColor: chartColors.downColor,
        }

        const candlestickSeries = chart.addSeries(CandlestickSeries, candlestickSeriesOptions)

        // Convert data to proper format
        const formattedData: CandlestickData[] = data.map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close
        }))

        // Set data
        candlestickSeries.setData(formattedData)

        // Store references for cleanup
        chartRef.current = chart
        seriesRef.current = candlestickSeries

        // Handle container resize using ResizeObserver
        let resizeObserver: ResizeObserver | undefined

        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            const newWidth = Math.max(chartContainerRef.current.clientWidth, 400)
            const newHeight = Math.max(chartContainerRef.current.clientHeight, 300)
            console.log('Resizing chart to:', { newWidth, newHeight })
            chart.applyOptions({
              width: newWidth,
              height: newHeight,
            })
          }
        }

        // Use ResizeObserver for better container size detection
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(handleResize)
          resizeObserver.observe(chartContainerRef.current)
        }

        // Fallback to window resize for older browsers
        window.addEventListener('resize', handleResize)

        console.log('Chart initialized successfully')
        setIsLoading(false)

        cleanup = () => {
          if (resizeObserver) {
            resizeObserver.disconnect()
          }
          window.removeEventListener('resize', handleResize)
          if (chart) {
            chart.remove()
          }
        }
      } catch (err) {
        console.error('Error initializing chart:', err)
        console.error('Container ref:', chartContainerRef.current)
        console.error('Container dimensions:', {
          width: chartContainerRef.current?.clientWidth,
          height: chartContainerRef.current?.clientHeight
        })
        if (isMounted) {
          setError(`Failed to load chart: ${err instanceof Error ? err.message : 'Unknown error'}`)
          setIsLoading(false)
        }
      }
    }

    initChart()

    return () => {
      isMounted = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
      if (cleanup) {
        cleanup()
      }
      chartRef.current = null
      seriesRef.current = null
    }
  }, [data])

  // Update data when prop changes (removed since we handle it in the main useEffect)

  if (error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full", className)}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <div
        ref={chartContainerRef}
        className={cn(
          "w-full h-full",
          isLoading && "hidden"
        )}
      />
    </div>
  )
}

export default TradingViewChart