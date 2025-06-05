// Types for TradingView Lightweight Charts integration

export interface ChartData {
  time: string
  value: number
}

export interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export interface VolumeData {
  time: string
  value: number
  color?: string
}

export interface ChartOptions {
  width?: number
  height?: number
  layout?: {
    background?: { color: string }
    textColor?: string
  }
  grid?: {
    vertLines?: { color: string }
    horzLines?: { color: string }
  }
  crosshair?: {
    mode?: number
  }
  rightPriceScale?: {
    borderColor?: string
  }
  timeScale?: {
    borderColor?: string
    timeVisible?: boolean
    secondsVisible?: boolean
  }
}

export interface LineSeriesOptions {
  color?: string
  lineWidth?: number
  lineStyle?: number
  lineType?: number
  crosshairMarkerVisible?: boolean
  crosshairMarkerRadius?: number
  crosshairMarkerBorderColor?: string
  crosshairMarkerBackgroundColor?: string
  lastValueVisible?: boolean
  priceLineVisible?: boolean
  priceLineSource?: number
  priceLineWidth?: number
  priceLineColor?: string
  priceLineStyle?: number
  baseLineVisible?: boolean
  baseLineColor?: string
  baseLineWidth?: number
  baseLineStyle?: number
}

export interface CandlestickSeriesOptions {
  upColor?: string
  downColor?: string
  borderVisible?: boolean
  wickUpColor?: string
  wickDownColor?: string
  borderUpColor?: string
  borderDownColor?: string
  wickVisible?: boolean
}

export interface TradingViewChartProps {
  data?: ChartData[]
  candlestickData?: CandlestickData[]
  volumeData?: VolumeData[]
  height?: number
  width?: number
  className?: string
  title?: string
  description?: string
  chartType?: 'line' | 'candlestick' | 'area'
  theme?: 'light' | 'dark'
  options?: ChartOptions
  lineSeriesOptions?: LineSeriesOptions
  candlestickSeriesOptions?: CandlestickSeriesOptions
}

export interface ChartInstance {
  chart: any
  series: any
  remove: () => void
  resize: (width: number, height: number) => void
  updateData: (data: ChartData[] | CandlestickData[]) => void
}
