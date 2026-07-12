'use client'

import * as React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DialogWrapperProps {
  trigger: React.ReactElement
  title: string
  description?: string
  children: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  confirmVariant?: React.ComponentProps<typeof Button>['variant']
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogWrapper({
  trigger,
  title,
  description,
  children,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  confirmVariant = 'default',
  isOpen,
  onOpenChange,
}: DialogWrapperProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-2">{children}</div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>
            {cancelText}
          </DialogClose>
          {onConfirm ? (
            <DialogClose render={<Button variant={confirmVariant} />} onClick={onConfirm}>
              {confirmText}
            </DialogClose>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
