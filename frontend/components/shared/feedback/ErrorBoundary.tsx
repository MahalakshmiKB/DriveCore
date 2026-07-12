'use client'

import * as React from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in boundary:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
          <Alert variant="destructive" className="max-w-md border-destructive/30">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 text-xs">
              {this.state.error?.message || 'An unexpected error occurred in this view.'}
            </AlertDescription>
          </Alert>
          <Button onClick={this.handleReset} className="mt-6" variant="outline">
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
